using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class SitterProfileUpdateDTO
{
    [StringLength(1000)]
    public string? Bio { get; init; }

    [Range(0, 100)]
    public int? YearsExperience { get; init; }

    [Range(0, 1000)]
    public decimal? HourlyRate { get; init; }

    [StringLength(200)]
    public string? Location { get; init; }
}