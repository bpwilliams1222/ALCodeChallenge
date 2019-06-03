using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AccuLynxCodeTest.Models
{
    public class QuestionModel
    {
        [NotMapped]
        public List<AnswerModel> answers { get; set; }
        public string share_link { get; set; }
        public int creation_date { get; set; }
        public int accepted_answer_id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public int question_id { get; set; }
        [NotMapped]
        public int answer_count { get; set; }
        public string link { get; set; }
        public string title { get; set; }
        public string body { get; set; }

        public QuestionModel()
        {
            answers = new List<AnswerModel>();
        }
    }
}
