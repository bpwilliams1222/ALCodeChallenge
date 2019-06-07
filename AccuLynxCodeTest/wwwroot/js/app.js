var app = angular.module('app', []);

app.controller('GameSession', function ($scope, $http, $compile) {
    //Session variables
    $scope.user = {
        "username": $("#username").val(),
        "correctAnswers": 0,
        "incorrectAnswers": 0
    }; 
    $scope.gameData = {};
    $scope.lastSelectedQuestionTableRow = {};

    $scope.StartGameSessionSettings = function () {
        //Prepare game ui while the user is filling out their name
        $('.questionsTableContainer').prepend('<h2>Recent Stack Overflow Questions</h2><hr /><table id="questionsTable" class="table table-striped table-hover">' +
            '<thead><tr><th>Creation Date</th><th>Question Title</th></tr></thead><tbody></tbody></table>');
        $http({
            url: "http://" + window.location.host + "/Home/GetGameData",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify($scope.gameData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            $scope.gameData = response.data;
            for (var i = 0; i < $scope.gameData.length; i++) {
                buildQuestionsTable($scope.gameData[i]);
            }
            });
        //Update UI to display right controls and hide elements that are no longer needed
        $('.descriptionContainer').addClass('hidden');
        $('.getStartedBtnContainer').addClass('hidden');
        $('.gameSettingsContainer').removeClass('hidden');
    };

    $scope.StartGameSession = function () {
        //Game UI is already setup, show elements, and hide the elements that are not needed
        $('.gameSettingsContainer').addClass('hidden');
        $('.tableSearch').removeClass('hidden');
        $('.questionsTableContainer').removeClass('hidden');
        $scope.user.username = $("#username").val();        
    };  
    
    $scope.scoreQuestion = function () {
        //If no selection was made, there is no need to score the question
        if ($('.questionAnswerPossibility-selected').length !== 0) {
            //Get question data in preparation for comparing
            var questionData = getQuestionElementById($($scope.lastSelectedQuestionTableRow).attr('id'));
            //Get variables
            var acceptedAnswerId = questionData.accepted_answer_id;
            var selectedAnswerId = $('.questionAnswerPossibility-selected').attr('id');
            //compare if match then it is a correct answer, if not incorrect, update accordingly
            if (acceptedAnswerId == selectedAnswerId) {
                //update session data
                $scope.user.correctAnswers++;
                //Display correct answer to user, and in the appropriate color
                $('.answerIndicator').text('Correct');
                $('.answerIndicator').addClass('correct');
                //adjust classes to adjust correct answer border to green color
                $('.questionAnswerPossibility-selected').addClass('questionAnswerPossibility-selected-correct');
                $('.questionAnswerPossibility-selected-correct').removeClass('questionAnswerPossibility-selected');
            } else {
                //update session data
                $scope.user.incorrectAnswers++;
                //display incorrect answer to user, and in the appropriate color
                $('.answerIndicator').text('Incorrect');
                $('.answerIndicator').addClass('incorrect');
                //adjust classes to adjust incorrect answer border to red color
                $('.questionAnswerPossibility-selected').addClass('questionAnswerPossibility-selected-incorrect');
                $('.questionAnswerPossibility-selected-incorrect').removeClass('questionAnswerPossibility-selected');
                //gather elements, itterate over them to find the correct answer and mark it with green border, locking them from being adjusted from this point
                var elements = $('.questionAnswersContainer').children();
                for (var i = 0; i < elements.length; i++) {
                    if ($(elements[i]).attr('id') == acceptedAnswerId) {
                        $(elements[i]).addClass('questionAnswerPossibility-selected-correct');
                    }
                    $(elements[i]).addClass('locked');
                }                
            }
            //hide Submit button from UI
            $('.submitBtnContainer').addClass('hidden');
            //update scoring numbers on UI
            $('.correctUserScore').text($scope.user.correctAnswers);
            $('.incorrectUserScore').text($scope.user.incorrectAnswers);
            //remove row from table so that the user cannot answer the same question
            $($scope.lastSelectedQuestionTableRow).remove();
            //remove question from session data
            $scope.gameData.shift();
        }
        //If more than 1 answer, either correct or incorrect, has been provided allow the user to end their scoring session
        if (($scope.user.correctAnswers + $scope.user.incorrectAnswers) >= 1) {
            $('.endGameBtn').prop('disabled', false);
        }
    };

    $scope.finishSession = function () {        
        $http({
            url: "http://" + window.location.host + "/Home/FinishSession",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify($scope.user),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            console.log(response.data);
            //If server responds with true, user data was saved successfully
            if (response.data === "true") {
                //update UI to reset to start of game/session
                $('.finishSessionContainer').addClass('hidden');
                $('.questionsTableContainer').addClass('hidden');
                $(".userScoreContainer").addClass('hidden');
                $(".questionScoreContainer").addClass('hidden');
                $('.finishSessionContainer').addClass('hidden');
                $('.getStartedBtnContainer').removeClass('hidden');
                $('.descriptionContainer').removeClass('hidden');
            }
        });
    };    

    //reusable function used to find an element in the array of questions by the elements id
    function getQuestionElementById(id) {
        for (var q = 0; q < $scope.gameData.length; q++) {
            if ($scope.gameData[q].question_id == id) {
                var questionData = $scope.gameData[q];
                break;
            }
        }
        return questionData;
    }

    $scope.questionSelected = function ($event) {
        //If more than 1 answer, either correct or incorrect, has been provided allow the user to end their scoring session, else disable button
        if (($scope.user.correctAnswers + $scope.user.incorrectAnswers) >= 1) {
            $('.endGameBtn').prop('disabled', false);
        } else {
            $('.endGameBtn').prop('disabled', true);
        }
        //remove and answer elements from question UI, clear out any answer indicators from previous questions viewed/answered
        $($('.questionAnswersContainer').children()).remove();
        $('.answerIndicator').text('');
        $('.answerIndicator').removeClass('incorrect');
        $('.answerIndicator').removeClass('correct');

        //Update UI with question data based on the selected row
        var questionData = getQuestionElementById($($event.currentTarget).attr('id'));
        $scope.lastSelectedQuestionTableRow = $event.currentTarget;
        $('.questionTitle').text(questionData.title);
        $('.questionTitle').attr('onclick', 'openInTab(' + "'" + questionData.share_link + "'" + ')');
        $('.questionBody').text(questionData.body);
        //Add Answers
        for (var i = 0; i < questionData.answers.length; i++) {
            $('.questionAnswersContainer').append('<div id="' + questionData.answers[i].answer_id + '" class="col-sm-offset-1 col-sm-11 questionAnswerPossibility h6"' +
                'onclick="changeSelectedAnswer($(this))" > ' + questionData.answers[i].body + '</div ><div class="col-sm-12" style="top:-10px;"><hr /></div>');
        }
        //Update Score on UI for current session
        $('.correctUserScore').text($scope.user.correctAnswers);
        $('.incorrectUserScore').text($scope.user.incorrectAnswers);
        //Hide questions table and show UI for question view
        $('.questionsTableContainer').addClass('hidden');
        $('.tableSearch').addClass('hidden');
        $(".userScoreContainer").removeClass('hidden');
        $(".questionScoreContainer").removeClass('hidden');
        $('.finishSessionContainer').removeClass('hidden');
        $('.submitBtnContainer').removeClass('hidden');
    };

    $scope.loadMoreQuestions = function () {
        $http({
            url: "http://" + window.location.host + "/Home/GetGameData",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify($scope.gameData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            //Remove children and re-add them from the data returned as it includes all the data
            $('#questionsTable>tbody').children().remove();
            $scope.gameData = response.data;
            for (var i = 0; i < $scope.gameData.length; i++) {
                buildQuestionsTable($scope.gameData[i]);
            }
        });
    };
    
    function buildQuestionsTable(questionData) {    
        //Convert UNIX timestamp from questionData received via Stacks API to a Date object to display in a more user-friendly format
        var dateObj = new Date(questionData.creation_date * 1000);
        //Compile each row so that it registers the click event with the angular controller
        angular.element($('#questionsTable>tbody')).append($compile('<tr ng-click="questionSelected($event)" id="' + questionData.question_id + '"><td>' + dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString() + '</td><td>' + questionData.title + '</td></tr>')($scope));
    }

    $scope.goBack = function () {
        //Update UI, hide question view and show questions table
        $('.questionsTableContainer').removeClass('hidden');
        $(".userScoreContainer").addClass('hidden');
        $(".questionScoreContainer").addClass('hidden');
        $('.finishSessionContainer').addClass('hidden');
        $('.tableSearch').removeClass('hidden');
    };
});

