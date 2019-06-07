# ALCodeChallenge
This is an application that pulls in data leveraging Stackoverflow's API. It pulls in questions with accepted answers where there are more than one answer option to a given question. This data will be provided to users through an interactive game-like experience where they can choose from a list of answers to a question in attempts to choose correctly versus what was accepted within Stackoverflow. Good luck!


Step 1:
Download to Local Machine

Step 2:
Setup local sql db instance, generate a connection string and paste that into the Startup.cs file on line 18. This will configure the application to utilize that database.

Step 3:
Using the Package Manager Console within VS copy the 3 following lines, executing them one at a time.
update-database -Context QuestionsDb
update-database -Context AnswerDb
update-database -Context UsersDb

That is all the setup that should be needed to execute this web app localling using VS.
