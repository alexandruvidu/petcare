using System.Net;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class ReviewService(IRepository<WebAppDatabaseContext> repository) : IReviewService
{
    public async Task<ServiceResponse> AddReview(ReviewAddDTO dto, Guid reviewerId, CancellationToken cancellationToken = default)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            Rating = dto.Rating,
            Comment = dto.Comment,
            Date = DateTime.UtcNow,
            ReviewerId = reviewerId,
            SitterId = dto.SitterId,
            BookingId = dto.BookingId
        };

        await repository.AddAsync(review, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<ReviewDTO>>> GetReviewsForSitter(Guid sitterId, CancellationToken cancellationToken = default)
    {
        var reviews = await repository.ListAsync(new ReviewProjectionSpec(sitterId), cancellationToken);
        return ServiceResponse.ForSuccess(reviews);
    }

    public async Task<ServiceResponse<ReviewDTO>> GetReviewByBooking(Guid bookingId, Guid reviewerId, CancellationToken cancellationToken = default)
    {
        var review = await repository.GetAsync(new ReviewProjectionSpec(bookingId, reviewerId), cancellationToken);

        return review != null
            ? ServiceResponse.ForSuccess(review)
            : ServiceResponse.FromError<ReviewDTO>(CommonErrors.EntityNotFound);
    }

    public async Task<ServiceResponse> UpdateReview(Guid reviewId, ReviewUpdateDTO dto, Guid reviewerId, CancellationToken cancellationToken = default)
    {
        var review = await repository.GetAsync(new ReviewSpec(reviewId, reviewerId), cancellationToken);
        if (review == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Review not found or not authorized.", ErrorCodes.EntityNotFound));
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment ?? review.Comment;
        review.Date = DateTime.UtcNow;

        await repository.UpdateAsync(review, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeleteReview(Guid reviewId, CancellationToken cancellationToken = default)
    {
        var review = await repository.GetAsync(new ReviewSpec(reviewId), cancellationToken);

        if (review == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Review not found.", ErrorCodes.EntityNotFound));
        }

        await repository.DeleteAsync<Review>(review.Id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }
}
