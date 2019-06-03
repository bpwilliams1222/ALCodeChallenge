using Microsoft.EntityFrameworkCore.Migrations;

namespace AccuLynxCodeTest.Migrations.AnswersDbMigrations
{
    public partial class InitialCreate_AnswersDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    answer_id = table.Column<int>(nullable: false),
                    question_id = table.Column<int>(nullable: false),
                    creation_date = table.Column<int>(nullable: false),
                    body = table.Column<string>(nullable: true),
                    title = table.Column<string>(nullable: true),
                    share_link = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.answer_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answers");
        }
    }
}
