using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IUserService
{
    Task<ServiceResponse<LoginResponseDTO>> Login(LoginDTO login, CancellationToken cancellationToken = default);
    Task<ServiceResponse<UserDTO>> GetUser(Guid id, CancellationToken cancellationToken = default);
    Task<ServiceResponse<PagedResponse<UserDTO>>> GetUsers(PaginationSearchQueryParams pagination, CancellationToken cancellationToken = default);
    Task<ServiceResponse> AddUser(UserAddDTO user, UserDTO? requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateUser(UserUpdateDTO dto, UserDTO? requestingUser, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteUser(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<UserDTO>>> GetAllSitters(CancellationToken cancellationToken = default);
}