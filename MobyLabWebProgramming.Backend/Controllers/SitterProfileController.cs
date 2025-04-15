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
public class SitterProfileController(ISitterProfileService profileService, IUserService userService) : AuthorizedController(userService)
{
    [Authorize(Roles = nameof(UserRoleEnum.Sitter))]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] SitterProfileAddDTO profile)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await profileService.AddProfile(profile, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize(Roles = nameof(UserRoleEnum.Sitter))]
    [HttpPut]
    public async Task<ActionResult<RequestResponse>> Update([FromBody] SitterProfileUpdateDTO profile)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await profileService.UpdateProfile(profile, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }

    [HttpGet("{sitterId:guid}")]
    public async Task<ActionResult<RequestResponse<SitterProfileDTO>>> Get(Guid sitterId)
    {
        return FromServiceResponse(await profileService.GetProfile(sitterId));
    }
    
    [Authorize(Roles = nameof(UserRoleEnum.Sitter))]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<SitterProfileDTO>>> MyProfile()
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await profileService.GetProfile(currentUser.Result.Id))
            : ErrorMessageResult<SitterProfileDTO>(currentUser.Error);
    }
}