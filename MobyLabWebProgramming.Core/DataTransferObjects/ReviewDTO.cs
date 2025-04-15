namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class ReviewDTO
{
    public Guid Id { get; init; }
    public int Rating { get; init; }
    public string Comment { get; init; } = null!;
    public DateTime Date { get; init; }

    public Guid ReviewerId { get; init; }
    public string? ReviewerName { get; init; }

    public Guid SitterId { get; init; }
    public string? SitterName { get; init; }

    public Guid BookingId { get; init; }
}