// MobyLabWebProgramming.Core/DataTransferObjects/FeedbackAddDTO.cs
using System.ComponentModel.DataAnnotations;
public class FeedbackAddDTO
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    [Required]
    [StringLength(1000)]
    public string Comment { get; set; } = default!;
    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }
    // UserId will be taken from current user if logged in, or null
}