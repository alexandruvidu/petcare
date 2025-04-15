using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

public interface IPetService
{
    Task<ServiceResponse> AddPet(PetAddDTO pet, Guid ownerId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdatePet(Guid petId, PetUpdateDTO pet, Guid ownerId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeletePet(Guid petId, Guid ownerId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<List<PetDTO>>> GetMyPets(Guid ownerId, CancellationToken cancellationToken = default);
    Task<ServiceResponse<PetDTO>> GetPetById(Guid petId, Guid ownerId, CancellationToken cancellationToken = default);
}