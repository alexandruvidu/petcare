using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

public class PetService(IRepository<WebAppDatabaseContext> repository) : IPetService
{
    public async Task<ServiceResponse> AddPet(PetAddDTO dto, Guid ownerId, CancellationToken cancellationToken = default)
    {
        var pet = new Pet
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type,
            Breed = dto.Breed,
            Age = dto.Age,
            OwnerId = ownerId
        };

        await repository.AddAsync(pet, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> UpdatePet(Guid petId, PetUpdateDTO dto, Guid ownerId, CancellationToken cancellationToken = default)
    {
        var pet = await repository.GetAsync(new PetSpec(petId, ownerId), cancellationToken);
        if (pet == null) return ServiceResponse.FromError(CommonErrors.EntityNotFound);

        if (!string.IsNullOrWhiteSpace(dto.Name)) pet.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Type)) pet.Type = dto.Type;
        if (!string.IsNullOrWhiteSpace(dto.Breed)) pet.Breed = dto.Breed;
        if (dto.Age.HasValue) pet.Age = dto.Age.Value;

        await repository.UpdateAsync(pet, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse> DeletePet(Guid petId, Guid ownerId, CancellationToken cancellationToken = default)
    {
        var pet = await repository.GetAsync(new PetSpec(petId, ownerId), cancellationToken);
        if (pet == null) return ServiceResponse.FromError(CommonErrors.EntityNotFound);

        await repository.DeleteAsync<Pet>(pet.Id, cancellationToken);
        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<List<PetDTO>>> GetMyPets(Guid ownerId, CancellationToken cancellationToken = default)
    {
        var pets = await repository.ListAsync(new PetProjectionSpec(ownerId), cancellationToken);
        return ServiceResponse.ForSuccess(pets);
    }

    public async Task<ServiceResponse<PetDTO>> GetPetById(Guid petId, Guid ownerId, CancellationToken cancellationToken = default)
    {
        var pet = await repository.GetAsync(new PetProjectionSpec(petId, ownerId), cancellationToken);
        return pet != null
            ? ServiceResponse.ForSuccess(pet)
            : ServiceResponse.FromError<PetDTO>(CommonErrors.EntityNotFound);
    }
}
