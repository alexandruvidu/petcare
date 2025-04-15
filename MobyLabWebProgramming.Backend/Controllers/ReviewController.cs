using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ReviewController(IReviewService reviewService, IUserService userService) : AuthorizedController(userService)
{
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] ReviewAddDTO review)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await reviewService.AddReview(review, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }
    
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Update(Guid id, [FromBody] ReviewUpdateDTO review)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await reviewService.UpdateReview(id, review, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }

    [HttpGet("{sitterId:guid}")]
    public async Task<ActionResult<RequestResponse<List<ReviewDTO>>>> GetForSitter(Guid sitterId)
    {
        return FromServiceResponse(await reviewService.GetReviewsForSitter(sitterId));
    }
    
    [Authorize]
    [HttpGet("{bookingId:guid}")]
    public async Task<ActionResult<RequestResponse<ReviewDTO>>> GetByBooking(Guid bookingId)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await reviewService.GetReviewByBooking(bookingId, currentUser.Result.Id))
            : ErrorMessageResult<ReviewDTO>(currentUser.Error);
    }
    
    [Authorize(Roles = nameof(UserRoleEnum.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Delete(Guid id)
    {
        return FromServiceResponse(await reviewService.DeleteReview(id));
    }
}