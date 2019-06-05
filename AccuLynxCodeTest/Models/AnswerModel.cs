using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccuLynxCodeTest.Models
{
    public class AnswerModel
    {
        [System.ComponentModel.DataAnnotations.Schema.DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None)]
        [System.ComponentModel.DataAnnotations.Key]
        public int answer_id { get; set; }
        public int question_id { get; set; }
        public int creation_date { get; set; }
        public string body { get; set; }
        public string title { get; set; }
        public string share_link { get; set; }

        public AnswerModel()
        {

        }
    }
}
