﻿// <auto-generated />
using AccuLynxCodeTest.DataContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AccuLynxCodeTest.Migrations.UsersDbMigrations
{
    [DbContext(typeof(UsersDb))]
    partial class UsersDbModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("AccuLynxCodeTest.Models.UserModel", b =>
                {
                    b.Property<string>("username");

                    b.Property<int>("correctAnswers");

                    b.Property<int>("incorrectAnswers");

                    b.HasKey("username");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
