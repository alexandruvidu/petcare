using System.Net;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class SitterProfileService(IRepository<WebAppDatabaseContext> repository) : ISitterProfileService
{
    public async Task<ServiceResponse> AddProfile(SitterProfileAddDTO dto, Guid sitterId, CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetAsync(new SitterProfileByUserSpec(sitterId), cancellationToken);
        if (existing != null) return ServiceResponse.FromError(CommonErrors.AlreadyExists);

        var profile = new SitterProfile
        {
            Id = Guid.NewGuid(),
            UserId = sitterId,
            Bio = dto.Bio,
            YearsExperience = dto.YearsExperience,
            HourlyRate = dto.HourlyRate,
            Location = dto.Location
        };

        await repository.AddAsync(profile, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdateProfile(SitterProfileUpdateDTO dto, Guid sitterId, CancellationToken cancellationToken = default)
    {
        var profile = await repository.GetAsync(new SitterProfileByUserSpec(sitterId), cancellationToken);
        if (profile == null) return ServiceResponse.FromError(CommonErrors.EntityNotFound);
        
        if (!string.IsNullOrWhiteSpace(dto.Bio)) profile.Bio = dto.Bio;

        if (dto.YearsExperience.HasValue) profile.YearsExperience = dto.YearsExperience.Value;

        if (dto.HourlyRate.HasValue) profile.HourlyRate = dto.HourlyRate.Value;

        if (!string.IsNullOrWhiteSpace(dto.Location)) profile.Location = dto.Location;

        await repository.UpdateAsync(profile, cancellationToken);
        return ServiceResponse.ForSuccess();
    }


    public async Task<ServiceResponse<SitterProfileDTO>> GetProfile(Guid sitterId, CancellationToken cancellationToken = default)
    {
        var profile = await repository.GetAsync(new SitterProfileByUserSpec(sitterId), cancellationToken);
        if (profile == null) return ServiceResponse.FromError<SitterProfileDTO>(CommonErrors.EntityNotFound);

        return ServiceResponse.ForSuccess(new SitterProfileDTO
        {
            Bio = profile.Bio,
            YearsExperience = profile.YearsExperience,
            HourlyRate = profile.HourlyRate,
            Location = profile.Location
        });
    }
}
