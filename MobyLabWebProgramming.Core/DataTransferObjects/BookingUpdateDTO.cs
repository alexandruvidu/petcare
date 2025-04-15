using System.ComponentModel.DataAnnotations;
using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class BookingUpdateDTO
{
    public BookingStatusEnum? Status { get; init; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}