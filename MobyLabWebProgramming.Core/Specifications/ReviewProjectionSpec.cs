using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class ReviewProjectionSpec : Specification<Review, ReviewDTO>
{
    public ReviewProjectionSpec(Guid sitterId)
    {
        Query.Where(r => r.SitterId == sitterId)
            .Include(r => r.Reviewer);

        Query.Select(r => new ReviewDTO
        {
            Id = r.Id,
            Rating = r.Rating,
            Comment = r.Comment,
            Date = r.Date,
            ReviewerId = r.ReviewerId,
            SitterId = r.SitterId,
            BookingId = r.BookingId,
            ReviewerName = r.Reviewer.Name
        });
    }

    public ReviewProjectionSpec(Guid bookingId, Guid reviewerId)
    {
        Query.Where(r => r.BookingId == bookingId && r.ReviewerId == reviewerId)
            .Include(r => r.Reviewer);

        Query.Select(r => new ReviewDTO
        {
            Id = r.Id,
            Rating = r.Rating,
            Comment = r.Comment,
            Date = r.Date,
            ReviewerId = r.ReviewerId,
            SitterId = r.SitterId,
            BookingId = r.BookingId,
            ReviewerName = r.Reviewer.Name
        });
    }
}