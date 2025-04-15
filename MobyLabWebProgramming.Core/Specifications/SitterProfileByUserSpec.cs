using Ardalis.Specification;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class SitterProfileByUserSpec : Specification<SitterProfile>
{
    public SitterProfileByUserSpec(Guid userId)
    {
        Query.Where(p => p.UserId == userId);
    }
}