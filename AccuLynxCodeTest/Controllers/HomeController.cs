using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AccuLynxCodeTest.Models;
using System.Net;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using AccuLynxCodeTest.DataContexts;
using Microsoft.EntityFrameworkCore.Internal;

namespace AccuLynxCodeTest.Controllers
{
    public class HomeController : Controller
    {
        private StorageModel DataStorageService = new StorageModel();

        public IActionResult Quiz()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
        
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public IActionResult FinishSession([FromBody]UserModel user)
        {
            try
            {
                //validation of model, this will ensure good data integrity on user data
                if (user.username != "" && user.username != null)
                {
                    using (var userDb = new UsersDb())
                    {
                        //check to ensure the username doesn't exist in the db, if yes, then update the record rather then add
                        if (userDb.Users.SingleOrDefault(c => c.username == user.username) == null)
                        {
                            DataStorageService.AddUser(user);
                        }
                        else
                        {
                            DataStorageService.UpdateUser(user);
                        }
                    }
                    //return true, this is used as a flag to ensure data was saved to perform necessary UI actions based on the results
                    return Json("true");
                }
            }
            catch
            {
                //could add error logging in the future
            }
            return Json("false");
        }

        [HttpPost]
        public IActionResult GetGameData([FromBody]List<QuestionModel> Questions)
        {
            var data = new List<QuestionModel>();
            //Null object can be received on initial application load
            if (Questions == null)
            {
                Questions = new List<QuestionModel>();
                try
                {
                    using (var questionDb = new QuestionsDb())
                    {
                        data = questionDb.Questions.OrderByDescending(c => c.creation_date).Take(25).ToList();
                    }
                }
                catch { }
            }
            else
            {
                //Determine last question on the DOM, order did change when object was passed from the angular controller
                var lastQuestionCreated = Questions.LastOrDefault();
                int lastCreationDate = 0;
                if (lastQuestionCreated != null)
                {
                    lastCreationDate = lastQuestionCreated.creation_date;
                    try
                    {
                        //Get 25 more questions that are older than the last question from the array
                        using (var questionDb = new QuestionsDb())
                        {
                            data = questionDb.Questions.Where(c => c.creation_date < lastCreationDate).OrderByDescending(c => c.creation_date).Take(25).ToList();
                        }
                    }
                    catch { }
                }
            }

            try
            {
                //Get coorisponding answers to questions grabbed to be returned
                using (var answersDb = new AnswersDb())
                {
                    foreach (var question in data)
                    {
                        question.answers = answersDb.Answers.Where(c => c.question_id == question.question_id).OrderBy(c => Guid.NewGuid()).ToList();
                    }
                }
            }
            catch { }
            //Add data to Questions received from the angular controller in preparation of returning the entire list
            Questions.AddRange(data);
            return Json(Questions);
        }

        [HttpPost]
        public IActionResult GetRandomGameData()
        {
            var data = new List<QuestionModel>();
            try
            {
                //Get 10 random questions from DB
                using (var questionDb = new QuestionsDb())
                {
                    data = questionDb.Questions.OrderByDescending(c => Guid.NewGuid()).Take(10).ToList();
                }
                // Get coorisponding answers to questions grabbed to be returned
                using (var answersDb = new AnswersDb())
                {
                    foreach (var question in data)
                    {
                        question.answers = answersDb.Answers.Where(c => c.question_id == question.question_id).OrderBy(c => Guid.NewGuid()).ToList();
                    }
                }
            }
            catch { }
            return Json(data);
        }

        public IActionResult Scores()
        {
            //get users from db and return to view
            var users = new List<UserModel>();
            try
            {
                using (var usersDb = new UsersDb())
                {
                    users = usersDb.Users.ToList();
                }
            }
            catch { }
            return View(users);
        }
    }
}
