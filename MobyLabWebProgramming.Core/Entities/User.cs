using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.Entities;

/// <summary>
/// This is an example for a user entity, it will be mapped to a single table and each property will have it's own column except for entity object references also known as navigation properties.
/// </summary>
public class User : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public UserRoleEnum Role { get; set; } // Client/Sitter/Admin
    public string Phone { get; set; } = null!;

    public ICollection<Pet> Pets { get; set; } = null!;
    public ICollection<Booking> SitterBookings { get; set; } = null!;
    public ICollection<Booking> ClientBookings { get; set; } = null!;
    public ICollection<Review> ReviewsWritten { get; set; } = null!;
    public ICollection<Review> ReviewsReceived { get; set; } = null!;
}

