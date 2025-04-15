using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class PetSpec : Specification<Pet>
{
    public PetSpec(Guid petId, Guid ownerId)
    {
        Query.Where(p => p.Id == petId && p.OwnerId == ownerId);
    }
    
    public PetSpec(Guid petId)
    {
        Query.Where(p => p.Id == petId);
    }
}