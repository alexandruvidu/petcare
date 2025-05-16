// MobyLabWebProgramming.Core/Enums/FeedbackEnums.cs
namespace MobyLabWebProgramming.Core.Enums
{
    public enum FeedbackTypeEnum
    {
        GeneralInquiry, // Default value if stored as 0
        BugReport,
        FeatureRequest,
        Compliment
    }

    public enum ContactPreferenceEnum
    {
        NoContact, // Default value if stored as 0
        Email,
        Phone
    }
}
