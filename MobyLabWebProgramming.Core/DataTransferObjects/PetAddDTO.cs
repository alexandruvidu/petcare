using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class PetAddDTO
{
    [Required]
    [StringLength(50)]
    public string Name { get; init; } = null!;

    [Required]
    [StringLength(50)]
    public string Type { get; init; } = null!;

    [Required]
    [StringLength(50)]
    public string Breed { get; init; } = null!;

    [Required]
    [Range(0, 100)]
    public int Age { get; init; }
}