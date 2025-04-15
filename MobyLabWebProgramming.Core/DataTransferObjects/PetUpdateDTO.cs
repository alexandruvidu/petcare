using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class PetUpdateDTO
{
    [StringLength(50)]
    public string? Name { get; init; }

    [StringLength(50)]
    public string? Type { get; init; }

    [StringLength(50)]
    public string? Breed { get; init; }

    [Range(0, 100)]
    public int? Age { get; init; }
}