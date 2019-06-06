var app = angular.module('app', []);

app.controller('GameSession', function ($scope, $http, $compile) {
    $scope.user = {
        "username": $("#username").val(),
        "correctAnswers": 0,
        "incorrectAnswers": 0
    }; 
    $scope.gameData = {};

    $scope.StartGameSessionSettings = function () {
        $http({
            url: "https://" + window.location.host + "/Home/GetGameData",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify($scope.gameData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            $scope.gameData = response.data;
            for (var i = 0; i < $scope.gameData.length; i++) {
                buildQuestionHTML($scope.gameData[i]);
            }
        });
        $('#start_game_session').toggleClass('hidden');
        $('#start_session_btn').toggleClass('hidden');
    };

    $scope.StartGameSession = function () {
        $('#start_game_session').toggleClass('hidden');
        $('#game_session').toggleClass('hidden');
        $scope.user.username = $("#username").val();        
    };  
    
    $scope.scoreQuestion = function ($event) {
        //If no selection was made, there is no need to score the question
        if ($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected')).length !== 0) {
            var acceptedAnswerId = 0, selectedAnswerId = 0;
            //Get the proper acceptedAnswerId and selectedAnswerId from the DOM & event passed
            acceptedAnswerId = $($(angular.element($event.currentTarget)).parent()).next().attr('id');
            selectedAnswerId = $($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected'))).attr('id');
            //if they are equal then the user selected the right answer
            if (acceptedAnswerId === selectedAnswerId) {
                //update user record, and DOM to reflect an accurate answer
                $scope.user.correctAnswers++;
                $($($(angular.element($event.currentTarget)).parent()).children()[0]).text("Correct");
                $($($(angular.element($event.currentTarget)).parent()).children()[0]).addClass('correct');
                $($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected'))).addClass('questionAnswerPossibility-selected-correct');
                $($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected'))).removeClass('questionAnswerPossibility-selected');
            } else {
                //update user record, and DOM to reflect an inaccurate answer
                $scope.user.incorrectAnswers++;
                $($($(angular.element($event.currentTarget)).parent()).children()[0]).text("Incorrect");
                $($($(angular.element($event.currentTarget)).parent()).children()[0]).addClass('incorrect');
                //change border color on incorrect answer, and add green border to correct answer
                $(angular.element($event.currentTarget)).toggleClass('hidden');
                //itterate over questions to find the incorrect selection and identify it to the user, and also the correct answer to identify to the user
                var questionAnswerPossibilityElements = $($($(angular.element($event.currentTarget)).prev()).children()[2]).children();
                for (var i = 0; i < questionAnswerPossibilityElements.length; i++) {
                    if ($(questionAnswerPossibilityElements[i]).hasClass('questionAnswerPossibility-selected')) {
                        //This is the incorrect selection
                        $(questionAnswerPossibilityElements[i]).addClass('questionAnswerPossibility-selected-incorrect');
                        $(questionAnswerPossibilityElements[i]).removeClass('questionAnswerPossibility-selected');
                    } else if ($(questionAnswerPossibilityElements[i]).attr('id') === acceptedAnswerId) {
                        //This is the correct selection
                        $(questionAnswerPossibilityElements[i]).addClass('questionAnswerPossibility-selected-correct');
                        $(questionAnswerPossibilityElements[i]).removeClass('questionAnswerPossibility-selected');
                    }
                }
            }
            //hide Submit button and lock answer possibilities after a successful answer submittion
            $(angular.element($event.currentTarget)).addClass('hidden');
            var elementsToLock = $($($(angular.element($event.currentTarget)).prev()).children()[2]).children();
            for (var j = 0; j < elementsToLock.length; j++) {
                $(elementsToLock[j]).addClass('locked');
            }
        }
        if (($scope.user.correctAnswers + $scope.user.incorrectAnswers) >= 1) {
            $('#finishSessionContainer').removeClass('hidden');
        }
    };

    $scope.finishSession = function () {        
        $http({
            url: "https://" + window.location.host + "/Home/FinishSession",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify($scope.user),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            console.log(response.data);
            if (response.data === "true") {
                $('#finishSessionContainer').addClass('hidden');
            }
        });
    };    

    function buildQuestionHTML(questionData) {
        $('#game_session').append('<div class="questionScoreContainer col-sm-12"></div>');
        $($('.questionScoreContainer').last()).append('<div class="col-sm-12 scoreContainer">' +
            '<div class="col-sm-offset-5 col-sm-7 h3">' +
            '</div><div class="col-sm-12 h1 toggle" onclick="expandCollapse($(this).next())">+</div>' +
            '<div class="col-sm-12 questionContainer">' +
            '<div class="col-sm-offset-1 col-sm-11 questionTitle h4" onclick="openInTab(' + "'" + questionData.share_link + "'" + ')">' + questionData.title + '</div>' +
            '<div class="col-sm-12 questionBodyContainer h6"><div class="col-sm-offset-1 col-sm-11 questionBody h6">' + questionData.body + '</div></div>' +
            '<div class="col-sm-12 hidden questionAnswersContainer h6">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<input type="hidden" id="' + questionData.accepted_answer_id + '" class="acceptedAnswerId" />' +
            '<input type="hidden" id="' + questionData.question_id + '" class="questionId" />');
        angular.element($('.scoreContainer').last()).append($compile('<div ng-click="scoreQuestion($event)" class="col-sm-offset-5 col-sm-7"><button class="btn">Submit Selection</button></div>')($scope));
        for (var i = 0; i < questionData.answers.length; i++) {
            $($('.questionAnswersContainer').last()).append('<div id="' + questionData.answers[i].answer_id + '" class="col-sm-offset-1 col-sm-11 questionAnswerPossibility h6" onclick="changeSelectedAnswer($(this))">' + questionData.answers[i].body + '</div>' +
                '<div class="col-sm-12" style="top:-10px;"><hr /></div>');
        }
    }
});

