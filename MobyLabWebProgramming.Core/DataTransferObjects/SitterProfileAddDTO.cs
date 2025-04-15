using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class SitterProfileAddDTO
{
    [Required]
    [StringLength(1000)]
    public string Bio { get; init; } = null!;

    [Required]
    [Range(0, 100)]
    public int YearsExperience { get; init; }

    [Required]
    [Range(0, 1000)]
    public decimal HourlyRate { get; init; }

    [Required]
    [StringLength(200)]
    public string Location { get; init; } = null!;
}