function search() {
    //select and itterate over the question elements
    var elements = $('.questionScoreContainer');
    for (var i = 0; i < elements.length; i++) {
        //if a match is made either through a mean of equaility, or inclusion then ensure that element is not hidden, else hide non-matching elements
        if ($($($($(elements[i]).children()[0]).children()[2]).children()[0]).text() == $("#search").val() ||
            ($($($($(elements[i]).children()[0]).children()[2]).children()[0]).text()).includes($("#search").val()) ||
            ($($($($(elements[i]).children()[0]).children()[2]).children()[0]).text()).toLowerCase().includes($("#search").val().toLowerCase())) {
            $(elements[i]).removeClass('hidden');
        } else {
            $(elements[i]).addClass('hidden');
        }
    }
}
// Reusable function for opening Stack questions in a new tab
function openInTab(url) {
    var winOpened = window.open(url, '_blank');
    if (winOpened) {
        winOpened.focus();
    }
}
//Reusable function for expanding or collapsing a question div
function expandCollapse(div) {
    if ($($(div).children()[2]).hasClass('hidden')) {
        $($(div).children()[2]).removeClass('hidden');
        $($(div).prev()).text("-");
    } else {
        $($(div).children()[2]).addClass('hidden');
        $($(div).prev()).text("+");
    }
}
//Reusable function for making/adjusting a selected answer
function changeSelectedAnswer(selectedAnswerDiv) {
    if (!$(selectedAnswerDiv).hasClass('locked')) {
        if ($($(selectedAnswerDiv).parent()).children().hasClass('questionAnswerPossibility-selected')) {
            var childrenElements = $($(selectedAnswerDiv).parent()).children();
            for (var i = 0; i < childrenElements.length; i++) {
                if ($(childrenElements[i]).hasClass('questionAnswerPossibility-selected')) {
                    $(childrenElements[i]).toggleClass('questionAnswerPossibility');
                    $(childrenElements[i]).toggleClass('questionAnswerPossibility-selected');
                }
            }
        }
        $(selectedAnswerDiv).toggleClass('questionAnswerPossibility');
        $(selectedAnswerDiv).toggleClass('questionAnswerPossibility-selected');
    }
}

function validateName() {
    if ($("#username").val().length > 0) {
        $("#startGameBtn").prop('disabled', false);
    } else {
        $("#startGameBtn").prop('disabled', true);
    }
    
}