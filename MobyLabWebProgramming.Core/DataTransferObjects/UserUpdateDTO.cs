using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class UserUpdateDTO
{
    [StringLength(100)]
    public string? Name { get; init; }

    [EmailAddress]
    public string? Email { get; init; }

    [MinLength(6)]
    public string? Password { get; set; }

    [Phone]
    public string? Phone { get; init; }
}