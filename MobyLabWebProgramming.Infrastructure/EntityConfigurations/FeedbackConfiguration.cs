using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums; 

public class FeedbackConfiguration : IEntityTypeConfiguration<Feedback>
{
    public void Configure(EntityTypeBuilder<Feedback> builder)
    {
        builder.ToTable("Feedback"); // Explicitly naming the table
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Rating).IsRequired();
        builder.Property(e => e.Comment).IsRequired().HasMaxLength(1000);
        builder.Property(e => e.Email).HasMaxLength(255);
        
        // EF Core by default maps enums to integers, which aligns with the migration.
        builder.Property(e => e.FeedbackType)
            .IsRequired();

        builder.Property(e => e.ContactPreference)
            .IsRequired();

        builder.Property(e => e.AllowFollowUp).IsRequired();

        builder.HasOne(e => e.User)
            .WithMany() // Assuming User doesn't have a direct ICollection<Feedback>
            .HasForeignKey(e => e.UserId)
            .IsRequired(false) 
            .OnDelete(DeleteBehavior.SetNull); 
    }
}