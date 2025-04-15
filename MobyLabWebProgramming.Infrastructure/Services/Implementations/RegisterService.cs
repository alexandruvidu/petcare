using System.Net;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class RegisterService(IUserService userService) : IRegisterService
{
    public async Task<ServiceResponse<LoginResponseDTO>> Register(RegisterDTO register, CancellationToken cancellationToken = default)
    {
        var userAdd = new UserAddDTO
        {
            Name = register.Name,
            Email = register.Email,
            Password = PasswordUtils.HashPassword(register.Password),
            Phone = register.Phone,
            Role = register.Role
        };

        var result = await userService.AddUser(userAdd, requestingUser: null, cancellationToken);

        if (!result.IsOk)
        {
            return ServiceResponse.FromError<LoginResponseDTO>(result.Error!);
        }

        var loginDto = new LoginDTO(register.Email, userAdd.Password);
        return await userService.Login(loginDto, cancellationToken);
    }
}