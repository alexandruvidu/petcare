using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;
public interface IFeedbackService
{
    Task<ServiceResponse> AddFeedback(FeedbackAddDTO feedback, UserDTO? currentUser, CancellationToken cancellationToken = default);
}