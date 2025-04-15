using System.Net;
using MobyLabWebProgramming.Core.Constants;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class UserService(
    IRepository<WebAppDatabaseContext> repository,
    ILoginService loginService,
    IMailService mailService
) : IUserService
{
    public async Task<ServiceResponse<LoginResponseDTO>> Login(LoginDTO login, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new UserSpec(login.Email), cancellationToken);
        if (result == null) return ServiceResponse.FromError<LoginResponseDTO>(CommonErrors.UserNotFound);
        if (result.Password != login.Password) return ServiceResponse.FromError<LoginResponseDTO>(new(HttpStatusCode.BadRequest, "Invalid credentials.", ErrorCodes.WrongPassword));

        var userDto = new UserDTO { Id = result.Id, Name = result.Name, Email = result.Email, Phone = result.Phone, Role = result.Role };
        var token = loginService.GetToken(userDto, DateTime.UtcNow, TimeSpan.FromDays(7));

        return ServiceResponse.ForSuccess(new LoginResponseDTO { Token = token, User = userDto });
    }

    public async Task<ServiceResponse<UserDTO>> GetUser(Guid id, CancellationToken cancellationToken = default)
    {
        var result = await repository.GetAsync(new UserProjectionSpec(id), cancellationToken);
        return result != null ? ServiceResponse.ForSuccess(result) : ServiceResponse.FromError<UserDTO>(CommonErrors.UserNotFound);
    }

    public async Task<ServiceResponse<PagedResponse<UserDTO>>> GetUsers(PaginationSearchQueryParams pagination, CancellationToken cancellationToken = default)
    {
        var result = await repository.PageAsync(pagination, new UserProjectionSpec(pagination.Search), cancellationToken);
        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> AddUser(UserAddDTO user, UserDTO? requestingUser, CancellationToken cancellationToken = default)
    {
        if (requestingUser != null && requestingUser.Role != UserRoleEnum.Admin)
            return ServiceResponse.FromError(CommonErrors.Forbidden);

        var exists = await repository.GetAsync(new UserSpec(user.Email), cancellationToken);
        if (exists != null) return ServiceResponse.FromError(CommonErrors.AlreadyExists);

        await repository.AddAsync(new User
        {
            Id = Guid.NewGuid(),
            Email = user.Email,
            Name = user.Name,
            Password = user.Password,
            Role = user.Role,
            Phone = user.Phone
        }, cancellationToken);

        await mailService.SendMail(user.Email, "Welcome to PetCare", MailTemplates.UserAddTemplate(user.Name), true, "PetCare", cancellationToken);
        return ServiceResponse.ForSuccess();
    }

public async Task<ServiceResponse> UpdateUser(UserUpdateDTO dto, UserDTO? requestingUser, CancellationToken cancellationToken = default)
{
    if (requestingUser == null)
        return ServiceResponse.FromError(CommonErrors.Forbidden); // Add this if you haven’t yet.

    var user = await repository.GetAsync(new UserSpec(requestingUser.Id), cancellationToken);
    if (user == null)
        return ServiceResponse.FromError(CommonErrors.UserNotFound);

    if (!string.IsNullOrWhiteSpace(dto.Name)) user.Name = dto.Name;
    if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email;
    if (!string.IsNullOrWhiteSpace(dto.Phone)) user.Phone = dto.Phone;
    if (!string.IsNullOrWhiteSpace(dto.Password)) user.Password = PasswordUtils.HashPassword(dto.Password);

    await repository.UpdateAsync(user, cancellationToken);
    return ServiceResponse.ForSuccess();
}


    public async Task<ServiceResponse> DeleteUser(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser != null && requestingUser.Role != UserRoleEnum.Admin && requestingUser.Id != id)
            return ServiceResponse.FromError(CommonErrors.Forbidden);

        await repository.DeleteAsync<User>(id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<UserDTO>>> GetAllSitters(CancellationToken cancellationToken = default)
    {
        var sitters = await repository.ListAsync(new UserProjectionSpec(UserRoleEnum.Sitter), cancellationToken);
        return ServiceResponse.ForSuccess(sitters);
    }
}
