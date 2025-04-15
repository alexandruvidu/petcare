using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IRegisterService
{
    Task<ServiceResponse<LoginResponseDTO>> Register(RegisterDTO register, CancellationToken cancellationToken = default);
}