using Ardalis.Specification;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.Specifications;

public sealed class UserProjectionSpec : Specification<User, UserDTO>
{
    public UserProjectionSpec(Guid id)
    {
        Query.Where(u => u.Id == id);

        Query.Select(u => new UserDTO
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role
        });
    }

    public UserProjectionSpec(string? search)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            Query.Where(u => u.Name.Contains(search) || u.Email.Contains(search));
        }

        Query.Select(u => new UserDTO
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role
        });
    }

    public UserProjectionSpec(UserRoleEnum? role, string? search = null)
    {
        if (role.HasValue)
        {
            Query.Where(u => u.Role == role.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            Query.Where(u => u.Name.Contains(search) || u.Email.Contains(search));
        }

        Query.Select(u => new UserDTO
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role
        });
    }
}