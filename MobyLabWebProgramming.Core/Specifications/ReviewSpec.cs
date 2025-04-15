using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class ReviewSpec : Specification<Review>
{
    public ReviewSpec(Guid reviewId) =>
        Query.Where(r => r.Id == reviewId);

    public ReviewSpec(Guid reviewId, Guid reviewerId) =>
        Query.Where(r => r.Id == reviewId && r.ReviewerId == reviewerId);
}