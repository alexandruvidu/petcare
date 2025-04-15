namespace MobyLabWebProgramming.Core.Entities;

public class Pet : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Breed { get; set; } = null!;
    public int Age { get; set; }

    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
}
