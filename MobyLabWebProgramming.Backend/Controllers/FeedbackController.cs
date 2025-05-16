namespace MobyLabWebProgramming.Backend.Controllers;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]/[action]")]
public class FeedbackController : AuthorizedController // Inherit if you need GetCurrentUser()
{
    private readonly IFeedbackService _feedbackService;

    public FeedbackController(IFeedbackService feedbackService, IUserService userService) : base(userService) // Pass IUserService to base
    {
        _feedbackService = feedbackService;
    }

    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] FeedbackAddDTO feedbackDto)
    {
        // GetCurrentUser can be null if the endpoint is public, handle accordingly
        // For feedback, it's often public, but can be tied to user if logged in.
        UserDTO? currentUser = null;
        if (User.Identity?.IsAuthenticated == true) // Check if a token was provided and validated
        {
            var userResult = await GetCurrentUser().ConfigureAwait(false); 
            if(userResult.Result != null) {
                currentUser = userResult.Result;
            }
        }
        return FromServiceResponse(await _feedbackService.AddFeedback(feedbackDto, currentUser, HttpContext.RequestAborted));
    }
};