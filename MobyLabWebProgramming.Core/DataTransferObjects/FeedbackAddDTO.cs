// MobyLabWebProgramming.Core/DataTransferObjects/FeedbackAddDTO.cs
using System.ComponentModel.DataAnnotations;
using MobyLabWebProgramming.Core.Enums; 

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

    [Required]
    public FeedbackTypeEnum FeedbackType { get; set; } 

    [Required]
    public ContactPreferenceEnum ContactPreference { get; set; } 
    
    public bool AllowFollowUp { get; set; } 
}