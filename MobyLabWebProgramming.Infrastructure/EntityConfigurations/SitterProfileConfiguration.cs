using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Infrastructure.EntityConfigurations;

public class SitterProfileConfiguration : IEntityTypeConfiguration<SitterProfile>
{
    public void Configure(EntityTypeBuilder<SitterProfile> builder)
    {
        builder.HasKey(sp => sp.Id);

        builder.Property(sp => sp.Bio)
            .HasMaxLength(1000);

        builder.Property(sp => sp.YearsExperience)
            .IsRequired();

        builder.Property(sp => sp.HourlyRate)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(sp => sp.Location)
            .HasMaxLength(100);
        
        builder.HasOne(sp => sp.User)
            .WithOne()
            .HasForeignKey<SitterProfile>(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
