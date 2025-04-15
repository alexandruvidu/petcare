using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class ReviewAddDTO
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; init; }

    
    [StringLength(1000)]
    public string Comment { get; init; } = null!;

    [Required]
    public Guid SitterId { get; init; }

    [Required]
    public Guid BookingId { get; init; }
}