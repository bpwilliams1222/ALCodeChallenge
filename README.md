# ALCodeChallenge
This is an application that pulls in data leveraging Stackoverflow's API on an automated basis. It pulls in questions with accepted answers where there are more than one answer option to a given question. This data will be provided to users through an interactive game-like experience where they can choose from a list of recent questions or be provided 10 random questions to attempt to answer. The application will track your score, good luck!


Step 1:
Download to Local Machine

Step 2:
Setup local sql db instance, generate a connection string and paste that into the appsettings.json file on line 9. This will configure the application to utilize your database.

Step 3:
Using the Package Manager Console within VS copy the 3 following lines, executing them one at a time.
update-database -Context QuestionsDb
update-database -Context AnswersDb
update-database -Context UsersDb

That is all the setup that should be needed to execute this web app locally using VS. If you are running this application on a new database please be aware that the application pulls data from Stack Overflows API at an automated rate. It is highly recommended that you let the application run for atleast 2 minutes prior to interacting with the application on a new database. This will ensure that there is enough data aquired within the database for interaction.
