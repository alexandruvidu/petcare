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
        var currentUser = await GetCurrentUser().ConfigureAwait(false); 
        return FromServiceResponse(await _feedbackService.AddFeedback(feedbackDto, currentUser.Result, HttpContext.RequestAborted));
    }
};