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
public class PetController(IPetService petService, IUserService userService) : AuthorizedController(userService)
{
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Add([FromBody] PetAddDTO pet)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await petService.AddPet(pet, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Update(Guid id, [FromBody] PetUpdateDTO pet)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await petService.UpdatePet(id, pet, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<PetDTO>>>> GetMyPets()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await petService.GetMyPets(currentUser.Result.Id))
            : ErrorMessageResult<List<PetDTO>>(currentUser.Error);
    }
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RequestResponse<PetDTO>>> GetById(Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await petService.GetPetById(id, currentUser.Result.Id))
            : ErrorMessageResult<PetDTO>(currentUser.Error);
    }
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Delete(Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await petService.DeletePet(id, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }
}
