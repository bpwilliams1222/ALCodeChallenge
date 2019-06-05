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

namespace AccuLynxCodeTest.Controllers
{
    public class HomeController : Controller
    {
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
                if (user.username != "" && user.username != null)
                {
                    using (var userDb = new UsersDb())
                    {
                        if (userDb.Users.SingleOrDefault(c => c.username == user.username) == null)
                        {
                            AccuLynxCodeTest.Startup.DataStorageService.AddUser(user);
                        }
                        else
                        {
                            AccuLynxCodeTest.Startup.DataStorageService.UpdateUser(user);
                        }
                    }
                    return Json("true");
                }
            }
            catch (Exception c)
            {
                
            }
            return Json("false");
        }

        [HttpPost]
        public IActionResult GetGameData()
        {
            var data = new List<QuestionModel>();
            using(var questionDb = new QuestionsDb())
            {
                data = questionDb.Questions.OrderBy(c => Guid.NewGuid()).ToList();
                using(var answersDb = new AnswersDb())
                {
                    foreach(var question in data)
                    {
                        question.answers = answersDb.Answers.Where(c => c.question_id == question.question_id).OrderBy(c => Guid.NewGuid()).ToList();
                    }
                }

            }
            return Json(data);
        }

        [HttpPost]
        public IActionResult GetUserData()
        {
            return Json(AccuLynxCodeTest.Startup.DataStorageService.GetUsers());
        }
    }
}
