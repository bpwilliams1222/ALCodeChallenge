using AccuLynxCodeTest.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccuLynxCodeTest.DataContexts
{
    public class AnswersDb : DbContext
    {
        public DbSet<AnswerModel> Answers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(Startup.DBConnectionString);
        }
    }
}
