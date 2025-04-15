using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class BookingDTO
{
    public Guid Id { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public BookingStatusEnum Status { get; init; }
    public string Notes { get; init; } = null!;
    public Guid ClientId { get; init; }
    public Guid SitterId { get; init; }
    public Guid PetId { get; init; }
    public string? ClientName { get; init; }
    public string? SitterName { get; init; }
    public string? PetName { get; init; }
}