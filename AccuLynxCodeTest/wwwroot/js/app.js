var app = angular.module('app', []);

app.controller('GameSession', function ($scope, $http, $compile) {
    $scope.user = {
        "username": $("#username").val(),
        "correctAnswers": 0,
        "incorrectAnswers": 0
    }; 
    $scope.StartGameSessionSettings = function () {
        $('#start_game_session').toggleClass('hidden');
        $('#start_session_btn').toggleClass('hidden');
    };
    $scope.StartGameSession = function () {
        $('#start_game_session').toggleClass('hidden');
        $('#game_session').toggleClass('hidden');
        $scope.user.username = $("#username").val();
        $('#finishSessionContainer').removeClass('hidden');
    };   
    $scope.scoreQuestion = function ($event) {
        //If no selection was made, there is no need to score the question
        if ($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected')).length != 0) {
            var acceptedAnswerId = 0, selectedAnswerId = 0;
            //Get the proper acceptedAnswerId and selectedAnswerId from the DOM & event passed
            acceptedAnswerId = $($(angular.element($event.currentTarget)).parent()).next().attr('id');
            selectedAnswerId = $($($($(angular.element($event.currentTarget)).parent()).children()[2]).find($('.questionAnswerPossibility-selected'))).attr('id');
            //if they are equal then the user selected the right answer
            if (acceptedAnswerId == selectedAnswerId) {
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
                    } else if ($(questionAnswerPossibilityElements[i]).attr('id') == acceptedAnswerId) {
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
});

