using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Infrastructure.EntityConfigurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.StartDate).IsRequired();
        builder.Property(b => b.EndDate).IsRequired();
        builder.Property(b => b.Status).IsRequired().HasMaxLength(20);
        builder.Property(b => b.Notes).HasMaxLength(500);

        builder.HasOne(b => b.Client)
            .WithMany(u => u.ClientBookings)
            .HasForeignKey(b => b.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Sitter)
            .WithMany(u => u.SitterBookings)
            .HasForeignKey(b => b.SitterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Pet)
            .WithMany()
            .HasForeignKey(b => b.PetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
