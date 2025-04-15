namespace MobyLabWebProgramming.Core.Entities;

public class SitterProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public int YearsExperience { get; set; }
    public decimal HourlyRate { get; set; }
    public string Location { get; set; } = null!;
}
