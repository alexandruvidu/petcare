using System.ComponentModel.DataAnnotations;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class BookingAddDTO
{
    [Required]
    public DateTime StartDate { get; init; }

    [Required]
    public DateTime EndDate { get; init; }

    [Required]
    [StringLength(1000)]
    public string Notes { get; init; } = null!;

    [Required]
    public Guid SitterId { get; init; }

    [Required]
    public Guid PetId { get; init; }
}