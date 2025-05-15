using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Core.Entities;

public class FeedbackConfiguration : IEntityTypeConfiguration<Feedback>
{
    public void Configure(EntityTypeBuilder<Feedback> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Rating).IsRequired();
        builder.Property(e => e.Comment).IsRequired().HasMaxLength(1000);
        builder.Property(e => e.Email).HasMaxLength(255);
        builder.HasOne(e => e.User)
            .WithMany() // Assuming User doesn't have a direct ICollection<Feedback>
            .HasForeignKey(e => e.UserId)
            .IsRequired(false) // UserId is nullable
            .OnDelete(DeleteBehavior.SetNull); // Or Cascade if user deletion should remove their feedback
    }
}
