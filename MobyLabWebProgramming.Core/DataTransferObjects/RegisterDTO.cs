using System.ComponentModel.DataAnnotations;
using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class RegisterDTO
{
    [Required]
    [StringLength(100)]
    public string Name { get; init; } = null!;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = null!;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = null!;

    [Required]
    [Phone]
    public string Phone { get; init; } = null!;

    [Required]
    public UserRoleEnum Role { get; init; }
}