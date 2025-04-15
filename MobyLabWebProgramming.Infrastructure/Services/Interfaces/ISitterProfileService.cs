using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface ISitterProfileService
{
    Task<ServiceResponse> AddProfile(SitterProfileAddDTO dto, Guid sitterId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateProfile(SitterProfileUpdateDTO dto, Guid sitterId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<SitterProfileDTO>> GetProfile(Guid sitterId, CancellationToken cancellationToken = default);
}