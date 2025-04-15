using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class BookingSpec : Specification<Booking>
{
    public BookingSpec(Guid id)
    {
        Query.Where(b => b.Id == id);
    }
}