using Microsoft.EntityFrameworkCore.Migrations;

namespace AccuLynxCodeTest.Migrations.UsersDbMigrations
{
    public partial class InitialCreate_UsersDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    username = table.Column<string>(nullable: false),
                    correctAnswers = table.Column<int>(nullable: false),
                    incorrectAnswers = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.username);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
