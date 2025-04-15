namespace MobyLabWebProgramming.Core.Entities;

public class Review : BaseEntity
{
    public int Rating { get; set; } // 1 to 5
    public string Comment { get; set; } = null!;
    public DateTime Date { get; set; }

    public Guid ReviewerId { get; set; }
    public User Reviewer { get; set; } = null!;

    public Guid SitterId { get; set; }
    public User Sitter { get; set; } = null!;

    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
}
