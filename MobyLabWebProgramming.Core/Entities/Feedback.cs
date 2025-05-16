// MobyLabWebProgramming.Core/Entities/Feedback.cs
using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.Entities;

public class Feedback : BaseEntity
{
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = default!;
    public string? Email { get; set; } // Optional, for non-logged-in users
    public Guid? UserId { get; set; } // Optional, if submitted by a logged-in user
    public User? User { get; set; } // Navigation property
    public FeedbackTypeEnum FeedbackType { get; set; } 
    public ContactPreferenceEnum ContactPreference { get; set; } 
    public bool AllowFollowUp { get; set; } 
}