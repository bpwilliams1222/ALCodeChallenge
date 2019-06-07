using AccuLynxCodeTest.DataContexts;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Timers;

namespace AccuLynxCodeTest.Models
{
    public class DataModel
    {
        public dynamic items { get; set; }
        public bool has_more { get; set; }
        public int quota_max { get; set; }
        public int quota_remaining { get; set; }
    }
    public class StorageModel
    {
        private BackgroundWorker DataUpdateService;
        private Timer DataUpdateServiceTimer;
        private int FromDate = 1551835052;
        private int ToDate = 1552007792;
        private int runFlag = 0;

        public StorageModel()
        {
            //Initialize fromdate and todate from db records to ensure proper start point when fetching questions from the api, this will avoid any potential to receive a duplicate record.
            using (var questionsDb = new QuestionsDb())
            {
                if (questionsDb.Questions.Count() > 0)
                {
                    FromDate = questionsDb.Questions.OrderByDescending(c => c.creation_date).First().creation_date + 1;
                    ToDate = FromDate + 172740;
                }
            }
            /*Instatiate a BackgroundWord, and run the worker only when the process has been checked by a timer interval to ensure it is not currently running. This will avoid duplicate records 
            and ensure we only run one process at a time incrementing the fromdate and todate after each successful api pull and db update*/
            using (DataUpdateService = new BackgroundWorker())
            {
                DataUpdateService.DoWork += FetchData;
                DataUpdateServiceTimer = new System.Timers.Timer(new TimeSpan(0, 5, 0).TotalMilliseconds);
                DataUpdateServiceTimer.Elapsed += CheckDataUpdateProcess;
                DataUpdateServiceTimer.Start();
            }           
        }

        // checks Background process to determine if it is running, if not executes ReceiveNews method
        private void CheckDataUpdateProcess(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (!DataUpdateService.IsBusy)
            {
                DataUpdateService.RunWorkerAsync();
                //If the runFlag has not reached an 8 hour mark, then increment runFlag
                if (runFlag != 60)
                {
                    runFlag++;
                    //Every 2 runs throttle back the api calling incrementally over time
                    if (runFlag % 10 == 0)
                    {
                        DataUpdateServiceTimer = new System.Timers.Timer(new TimeSpan(0, runFlag, 0).TotalMilliseconds);
                        DataUpdateServiceTimer.Elapsed += CheckDataUpdateProcess;
                        DataUpdateServiceTimer.Start();
                    }
                }                
            }
        }

        private async void FetchData(object sender, DoWorkEventArgs e)
        {
            try
            {
                //HttpClientHandler is needed to configure the HttpClient to utlize GZip
                HttpClientHandler handler = new HttpClientHandler()
                {
                    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
                };
                using (HttpClient client = new HttpClient(handler))
                {
                    //Get response from API
                    using (HttpResponseMessage response = await client.GetAsync("https://api.stackexchange.com/2.2/questions?filter=!6h_6LPB9mi4f3VS50f9bHUwlhXNhd(idEXcx.qsqzpIjX9&order=desc&sort=activity&site=stackoverflow&pagesize=100&fromdate=" + FromDate + "&todate=" + ToDate))
                    {
                        using (HttpContent content = response.Content)
                        {
                            //Read content as a string, easiest for parsing the json string into an explicit model
                            var result = await content.ReadAsStringAsync();
                            DataModel jsonObj = JsonConvert.DeserializeObject<DataModel>(result);
                            List<QuestionModel> Questions = JsonConvert.DeserializeObject<List<QuestionModel>>(jsonObj.items.ToString());
                            //initialize db, prepare for update
                            using (var questionsDb = new QuestionsDb())
                            {
                                //If less than 100 records received throttle back the timer that controls the interval between api calls
                                if (Questions.Count < 100)
                                {
                                    DataUpdateServiceTimer = new System.Timers.Timer(new TimeSpan(1, 0, 0).TotalMilliseconds);
                                    DataUpdateServiceTimer.Elapsed += CheckDataUpdateProcess;
                                    DataUpdateServiceTimer.Start();
                                    runFlag = 60;
                                }
                                //No need to take action if there are not any questions
                                if (Questions.Count > 0)
                                {
                                    //Only interested in questions that have 2 answers or more and one of them have been accepted
                                    await questionsDb.AddRangeAsync(Questions.Where(c => c.answer_count >= 2 && c.accepted_answer_id > 0));
                                    var dbSaveResult = await questionsDb.SaveChangesAsync();
                                    //No need to increment the flag variable if the data fetched was not successfully updated to the db
                                    if (dbSaveResult >= 1)
                                    {
                                        /*Increment these flag parameters for use in the next api call, this will make sure we don't accidentally call for 
                                        the same data and attempt to add a duplicate record into the db*/
                                        FromDate = questionsDb.Questions.OrderByDescending(c => c.creation_date).First().creation_date + 1;
                                        ToDate = FromDate + 172740;
                                    }
                                }
                            }
                            using (var answersDb = new AnswersDb())
                            {
                                /*Iterate over each question and parse json string into a answer model and save to db, again only interested in 
                                questions with more than 2 answers where one has been accepted*/
                                foreach (QuestionModel question in Questions.Where(c => c.answer_count >= 2 && c.accepted_answer_id > 0))
                                {
                                    await answersDb.Answers.AddRangeAsync(question.answers);
                                }
                                await answersDb.SaveChangesAsync();
                            }
                            //Clear variable and release resources to GC
                            if (Questions != null)
                            {
                                Questions.Clear();
                            }
                        }
                    }
                }
            } catch(Microsoft.EntityFrameworkCore.DbUpdateException error)
            {
                using (var questionsDb = new QuestionsDb())
                {
                    FromDate = questionsDb.Questions.OrderByDescending(c => c.creation_date).First().creation_date + 100;
                    ToDate = FromDate + 172740;
                }
            }
        }
        
        public async void AddUser(UserModel user)
        {
            //save user object to db
            using (var usersDb = new UsersDb())
            {
                usersDb.Users.Add(user);
                await usersDb.SaveChangesAsync();
            }
        }

        public async void UpdateUser(UserModel user)
        {
            //Find old user data, and update it with the incoming data model, then save changes to db
            using (var usersDb = new UsersDb())
            {
                var oldDbUserData = await usersDb.Users.FirstOrDefaultAsync(c => c.username == user.username);
                oldDbUserData.correctAnswers += user.correctAnswers;
                oldDbUserData.incorrectAnswers += user.incorrectAnswers;
                await usersDb.SaveChangesAsync();
            }
        }
    }
}
