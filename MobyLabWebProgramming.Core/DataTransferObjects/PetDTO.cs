namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class PetDTO
{
    public Guid Id { get; init; }
    public string Name { get; init; } = null!;
    public string Type { get; init; } = null!;
    public string Breed { get; init; } = null!;
    public int Age { get; init; }
}