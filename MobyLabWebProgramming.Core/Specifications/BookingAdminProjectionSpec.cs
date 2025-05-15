using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using System.Linq;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class BookingAdminProjectionSpec : Specification<Booking, BookingDTO>
{
    public BookingAdminProjectionSpec(string? search)
    {
        Query.Include(b => b.Client);
        Query.Include(b => b.Sitter);
        Query.Include(b => b.Pet);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            Query.Where(b => (b.Client != null && b.Client.Name.ToLower().Contains(search)) ||
                             (b.Sitter != null && b.Sitter.Name.ToLower().Contains(search)) ||
                             (b.Pet != null && b.Pet.Name.ToLower().Contains(search)) ||
                             b.Notes.ToLower().Contains(search) ||
                             b.Status.ToString().ToLower().Contains(search));
        }
        
        Query.OrderByDescending(b => b.StartDate);


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