using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class BookingProjectionSpec : Specification<Booking, BookingDTO>
{
    public BookingProjectionSpec(Guid userId)
    {
        Query.Where(b => b.ClientId == userId || b.SitterId == userId);
        Query.Include(b => b.Client);
        Query.Include(b => b.Sitter);
        Query.Include(b => b.Pet);

        Query.Select(b => new BookingDTO
        {
            Id = b.Id,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            Status = b.Status,
            Notes = b.Notes,
            ClientId = b.ClientId,
            SitterId = b.SitterId,
            PetId = b.PetId,
            ClientName = b.Client.Name,
            SitterName = b.Sitter.Name,
            PetName = b.Pet.Name
        });
    }

    public BookingProjectionSpec(Guid bookingId, bool byIdOnly = true)
    {
        Query.Where(b => b.Id == bookingId);
        Query.Include(b => b.Client);
        Query.Include(b => b.Sitter);
        Query.Include(b => b.Pet);

        Query.Select(b => new BookingDTO
        {
            Id = b.Id,
            StartDate = b.StartDate,
            EndDate = b.EndDate,
            Status = b.Status,
            Notes = b.Notes,
            ClientId = b.ClientId,
            SitterId = b.SitterId,
            PetId = b.PetId,
            ClientName = b.Client.Name,
            SitterName = b.Sitter.Name,
            PetName = b.Pet.Name
        });
    }
}