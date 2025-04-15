using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class UserController(IUserService userService) : AuthorizedController(userService)
{
    [Authorize(Roles = nameof(UserRoleEnum.Admin))]
    [HttpPost]
    public async Task<ActionResult<RequestResponse<string>>> Add([FromBody] UserAddDTO user)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse.FromServiceResponse(await UserService.AddUser(user, currentUser.Result))
            : ErrorMessageResult<string>(currentUser.Error);
    }

    [Authorize(Roles = $"{nameof(UserRoleEnum.Admin)},{nameof(UserRoleEnum.Client)},{nameof(UserRoleEnum.Sitter)}")]
    [HttpPut]
    public async Task<ActionResult<RequestResponse<string>>> Update([FromBody] UserUpdateDTO user)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse.FromServiceResponse(await UserService.UpdateUser(user, currentUser.Result))
            : ErrorMessageResult<string>(currentUser.Error);
    }
    
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<UserDTO>>> GetMe()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse<UserDTO>.FromServiceResponse(await UserService.GetUser(currentUser.Result.Id))
            : ErrorMessageResult<UserDTO>(currentUser.Error);
    }
    
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RequestResponse<UserDTO>>> GetById([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse<UserDTO>.FromServiceResponse(await UserService.GetUser(id))
            : ErrorMessageResult<UserDTO>(currentUser.Error);
    }
    
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<UserDTO>>>> GetAllSitters()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse<List<UserDTO>>.FromServiceResponse(await UserService.GetAllSitters())
            : ErrorMessageResult<List<UserDTO>>(currentUser.Error);
    }

    [Authorize(Roles = nameof(UserRoleEnum.Admin))]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<PagedResponse<UserDTO>>>> GetPage([FromQuery] PaginationSearchQueryParams pagination)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse<PagedResponse<UserDTO>>.FromServiceResponse(await UserService.GetUsers(pagination))
            : ErrorMessageResult<PagedResponse<UserDTO>>(currentUser.Error);
    }
    
    [Authorize(Roles = nameof(UserRoleEnum.Admin))]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse<string>>> Delete([FromRoute] Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse.FromServiceResponse(await UserService.DeleteUser(id, currentUser.Result))
            : ErrorMessageResult<string>(currentUser.Error);
    }
    
    [Authorize(Roles = $"{nameof(UserRoleEnum.Client)},{nameof(UserRoleEnum.Sitter)}")]
    [HttpDelete]
    public async Task<ActionResult<RequestResponse<string>>> DeleteSelf()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? RequestResponse.FromServiceResponse(await UserService.DeleteUser(currentUser.Result.Id, currentUser.Result))
            : ErrorMessageResult<string>(currentUser.Error);
    }
}
