using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.Entities;

public class Booking : BaseEntity
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public BookingStatusEnum Status { get; set; } // Pending, Accepted, Rejected, Completed
    public string Notes { get; set; } = null!;
    
    public Guid ClientId { get; set; }
    public User Client { get; set; } = null!;

    public Guid SitterId { get; set; }
    public User Sitter { get; set; } = null!;

    public Guid PetId { get; set; }
    public Pet Pet { get; set; } = null!;
}
