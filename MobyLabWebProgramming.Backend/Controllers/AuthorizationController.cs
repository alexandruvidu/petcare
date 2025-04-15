using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.Constants;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Handlers;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

/// <summary>
/// This is a controller to respond to authentication requests.
/// Inject the required services through the constructor.
/// </summary>
[ApiController] // This attribute specifies for the framework to add functionality to the controller such as binding multipart/form-data.
[Route("api/[controller]/[action]")] // The Route attribute prefixes the routes/url paths with template provides as a string, the keywords between [] are used to automatically take the controller and method name.
public class AuthorizationController(IUserService userService) : BaseResponseController // The controller must inherit ControllerBase or its derivations, in this case BaseResponseController.
{
    /// <summary>
    /// This method will respond to login requests.
    /// </summary>
    [HttpPost] // This attribute will make the controller respond to a HTTP POST request on the route /api/Authorization/Login having a JSON body deserialized as a LoginDTO.
    public async Task<ActionResult<RequestResponse<LoginResponseDTO>>> Login([FromBody] LoginDTO login) // The FromBody attribute indicates that the parameter is deserialized from the JSON body.
    {
        return FromServiceResponse(await userService.Login(login with { Password = PasswordUtils.HashPassword(login.Password)})); // The "with" keyword works only with records and it creates another object instance with the updated properties. 
    }
    
    [HttpPost]
    public async Task<ActionResult<RequestResponse<LoginResponseDTO>>> Register([FromBody] RegisterDTO register)
    {
        var userAdd = new UserAddDTO
        {
            Name = register.Name,
            Email = register.Email,
            Password = PasswordUtils.HashPassword(register.Password),
            Phone = register.Phone,
            Role = register.Role
        };

        var addUserResult = await userService.AddUser(userAdd, requestingUser: null);

        if (!addUserResult.IsOk)
        {
            return Ok(RequestResponse<LoginResponseDTO>.FromError(addUserResult.Error!));

        }
        
        var loginDto = new LoginDTO(register.Email, userAdd.Password);
        var loginResult = await userService.Login(loginDto);
        
        return RequestResponse<LoginResponseDTO>.FromServiceResponse(loginResult);
    }

}
