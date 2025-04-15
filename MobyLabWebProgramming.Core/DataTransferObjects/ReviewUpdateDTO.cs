using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class ReviewUpdateDTO
{
    [Range(1, 5)]
    public int Rating { get; init; }

    [StringLength(1000)]
    public string? Comment { get; init; }
}