using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;
using System.Threading;
using System.Threading.Tasks;

public class FeedbackService(IRepository<WebAppDatabaseContext> repository) : IFeedbackService
{
    public async Task<ServiceResponse> AddFeedback(FeedbackAddDTO dto, UserDTO? currentUser, CancellationToken cancellationToken = default)
    {
        var feedback = new Feedback
        {
            Rating = dto.Rating,
            Comment = dto.Comment,
            Email = dto.Email,
            UserId = currentUser?.Id // Associate with logged-in user if available
        };
        await repository.AddAsync(feedback, cancellationToken);
        return ServiceResponse.ForSuccess();
    }
}