using System.Net;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class BookingService(IRepository<WebAppDatabaseContext> repository) : IBookingService
{
    public async Task<ServiceResponse> CreateBooking(BookingAddDTO dto, Guid clientId, CancellationToken cancellationToken = default)
    {
        var sitter = await repository.GetAsync(new UserSpec(dto.SitterId), cancellationToken);
        var pet = await repository.GetAsync(new PetSpec(dto.PetId), cancellationToken);

        if (sitter == null || pet == null)
        {
            return ServiceResponse.FromError(new ErrorMessage(
                HttpStatusCode.NotFound,
                "Sitter or Pet not found.",
                ErrorCodes.EntityNotFound));
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Notes = dto.Notes,
            Status = BookingStatusEnum.Pending,
            ClientId = clientId,
            SitterId = dto.SitterId,
            PetId = dto.PetId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(booking, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateBooking(Guid bookingId, BookingUpdateDTO dto, Guid userId, UserRoleEnum role, CancellationToken cancellationToken = default)
    {
        var booking = await repository.GetAsync(new BookingSpec(bookingId), cancellationToken);

        if (booking == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Booking not found.", ErrorCodes.EntityNotFound));
        }

        var isClient = booking.ClientId == userId;
        var isSitter = booking.SitterId == userId;

        // Only the sitter or client can modify depending on the field
        if (!isClient && !isSitter)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You are not authorized to update this booking.", ErrorCodes.CannotUpdate));
        }

        // Allow sitter to update status
        if (dto.Status.HasValue)
        {
            booking.Status = dto.Status.Value;
        }

        // Allow client to update basic info
        if (isClient)
        {
            if (dto.StartDate.HasValue)
                booking.StartDate = dto.StartDate.Value;

            if (dto.EndDate.HasValue)
                booking.EndDate = dto.EndDate.Value;

            if (!string.IsNullOrWhiteSpace(dto.Notes))
                booking.Notes = dto.Notes;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        await repository.UpdateAsync(booking, cancellationToken);

        return ServiceResponse.ForSuccess();
    }


    public async Task<ServiceResponse<List<BookingDTO>>> GetBookingsForUser(UserDTO user, CancellationToken cancellationToken = default)
    {
        var bookings = await repository.ListAsync(new BookingProjectionSpec(user.Id), cancellationToken);
        return ServiceResponse.ForSuccess(bookings);
    }

    public async Task<ServiceResponse<BookingDTO>> GetBookingById(Guid bookingId, UserDTO currentUser, CancellationToken cancellationToken = default)
    {
        var booking = await repository.GetAsync(new BookingProjectionSpec(bookingId), cancellationToken);

        if (booking == null)
        {
            return ServiceResponse.FromError<BookingDTO>(new ErrorMessage(
                HttpStatusCode.NotFound,
                "Booking not found.",
                ErrorCodes.EntityNotFound));
        }

        if (booking.ClientId != currentUser.Id && booking.SitterId != currentUser.Id)
        {
            return ServiceResponse.FromError<BookingDTO>(new ErrorMessage(
                HttpStatusCode.Forbidden,
                "You do not have permission to access this booking.",
                ErrorCodes.CannotUpdate));
        }

        return ServiceResponse.ForSuccess(booking);
    }

    public async Task<ServiceResponse> DeleteBooking(Guid bookingId, Guid userId, UserRoleEnum role, CancellationToken cancellationToken = default)
    {
        var booking = await repository.GetAsync(new BookingSpec(bookingId), cancellationToken);

        if (booking == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Booking not found.", ErrorCodes.EntityNotFound));
        }

        var isClient = booking.ClientId == userId;
        var isSitter = booking.SitterId == userId;

        if ((role == UserRoleEnum.Client && !isClient) || (role == UserRoleEnum.Sitter && !isSitter))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "You are not allowed to delete this booking.", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Booking>(booking.Id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }
}
