using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IReviewService
{
    Task<ServiceResponse> AddReview(ReviewAddDTO dto, Guid reviewerId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<ReviewDTO>>> GetReviewsForSitter(Guid sitterId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteReview(Guid reviewId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateReview(Guid reviewId, ReviewUpdateDTO dto, Guid userId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<ReviewDTO>> GetReviewByBooking(Guid bookingId, Guid userId, CancellationToken cancellationToken = default);
}