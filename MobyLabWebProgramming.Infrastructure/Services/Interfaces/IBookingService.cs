using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IBookingService
{
    Task<ServiceResponse> CreateBooking(BookingAddDTO dto, Guid clientId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateBooking(Guid bookingId, BookingUpdateDTO dto, Guid userId, UserRoleEnum role, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<BookingDTO>>> GetBookingsForUser(UserDTO user, CancellationToken cancellationToken = default);
    Task<ServiceResponse<BookingDTO>> GetBookingById(Guid bookingId, UserDTO currentUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteBooking(Guid bookingId, Guid userId, UserRoleEnum role, CancellationToken cancellationToken = default);
}