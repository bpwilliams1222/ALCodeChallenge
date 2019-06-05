using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AccuLynxCodeTest.Models
{
    public class UserModel
    {
        [System.ComponentModel.DataAnnotations.Schema.DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None)]
        [System.ComponentModel.DataAnnotations.Key]
        public string username { get; set; }
        public int correctAnswers { get; set; }
        public int incorrectAnswers { get; set; }

        public UserModel()
        {
            username = String.Empty;
            correctAnswers = 0;
            incorrectAnswers = 0;
        }

        public UserModel(string _username)
        {
            username = _username;
            correctAnswers = 0;
            incorrectAnswers = 0;
        }
    }
}
