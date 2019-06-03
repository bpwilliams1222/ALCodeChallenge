using Microsoft.EntityFrameworkCore.Migrations;

namespace AccuLynxCodeTest.Migrations
{
    public partial class InitialCreate_QuestionsDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    share_link = table.Column<string>(nullable: true),
                    creation_date = table.Column<int>(nullable: false),
                    accepted_answer_id = table.Column<int>(nullable: false),
                    question_id = table.Column<int>(nullable: false),
                    link = table.Column<string>(nullable: true),
                    title = table.Column<string>(nullable: true),
                    body = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.question_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Questions");
        }
    }
}
