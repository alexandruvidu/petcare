namespace MobyLabWebProgramming.Core.DataTransferObjects;

public sealed class SitterProfileDTO
{
    public string Bio { get; init; } = null!;
    public int YearsExperience { get; init; }
    public decimal HourlyRate { get; init; }
    public string Location { get; init; } = null!;
}