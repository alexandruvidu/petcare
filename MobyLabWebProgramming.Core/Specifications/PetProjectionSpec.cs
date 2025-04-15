using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class PetProjectionSpec : Specification<Pet, PetDTO>
{
    public PetProjectionSpec(Guid ownerId)
    {
        Query.Where(p => p.OwnerId == ownerId);

        Query.Select(p => new PetDTO
        {
            Id = p.Id,
            Name = p.Name,
            Type = p.Type,
            Breed = p.Breed,
            Age = p.Age
        });
    }

    public PetProjectionSpec(Guid petId, Guid ownerId)
    {
        Query.Where(p => p.Id == petId && p.OwnerId == ownerId);

        Query.Select(p => new PetDTO
        {
            Id = p.Id,
            Name = p.Name,
            Type = p.Type,
            Breed = p.Breed,
            Age = p.Age
        });
    }
}