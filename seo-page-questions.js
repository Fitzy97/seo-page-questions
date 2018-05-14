var ie = (function(){

var a = document.createElement('audio');
return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));

}());

var ftgames;
ftgames = function () {
    var s = this;
    s.question = 0;
    s.sound = 0;
    s.current_user = 0;
    s.grade = 0;
    s.test = 0;

    s.init = function (grade, test) {
        ftg.grade = grade;
        ftg.test = test;
        s.loadGame();
    };

    s.loadGame = function () {
        s.ajax({
            'func': 'getQuestions',
            'grade': ftg.grade,
            'test': ftg.test
        }, s.startGame);
    };

    s.ajax = function (data, callback) {
        url = 'questions.php';
        $.ajax({
            data: data,
            url: url,
            'type': 'POST',
            'success': function (response) {
                eval(response);
                if (callback) {
                    callback();
                }
            }
        });
        return false;
    };

    s.startGame = function () {
        $('#question0').css('margin-top', '100px');

        $('#muteBtn').unbind('click').click(function() {
            if (s.sound == 0) {
                $('#muteImg').css('display', 'none');
                $('#unmuteImg').css('display', 'block');
                s.sound = 1;
            }
            else {
                $('#unmuteImg').css('display', 'none');
                $('#muteImg').css('display', 'block');
                s.sound = 0;
            }
        });

        $('.question .correct').unbind('click').click(function () {
            var $id = $(this).parent().parent().attr('id');
            var $k = $id.substring($id.indexOf('n') + 1);
            s.answerQuestion(1, $k);
        });
        $('.question .wrong').unbind('click').click(function () {
            var $id = $(this).parent().parent().attr('id');
            var $k = $id.substring($id.indexOf('n') + 1);
            s.answerQuestion(0, $k);
        });

        var $id = 0;
        var $k = 0;
        questionAudio = $('#question_audio' + $k);
        playButton = $('#soundBtn' + $k + ' .playBtn');
        pauseButton = $('#soundBtn' + $k + ' .pauseBtn');
        $('.question .soundBtn').unbind('click').click(function () {
            $id = $(this).attr('id');
            $k = $id.substring($id.indexOf('Btn') + 3);

            if (playButton.css('display') === 'block') {
                playButton.css('display', 'none');
                pauseButton.css({'display': 'block', 'margin': '0 auto'});
                if (ie && questionAudio && questionAudio.length) {
                    questionAudio.get(0).play();
                }
            }
            else {
                pauseButton.css('display', 'none');
                playButton.css('display', 'block');
                if (ie && questionAudio && questionAudio.length) {
                    questionAudio.get(0).pause();
                }
            }
        });
        if (questionAudio.ended) {
            playButton.css('display', 'none');
            pauseButton.css('display', 'block');
        }

        s.setAnswerArea();
        s.setAnswerImageArea();
        s.setDescTopArea();
        s.setHtmlArea();
        $(window).resize(s.setAnswerArea);
        $(window).resize(s.setAnswerImageArea);
        $(window).resize(s.setDescTopArea);
        $(window).resize(s.setHtmlArea);
    };

    s.setHtmlArea = function() {
        newHeight = ($('.question').height() + parseInt($('.question').css('margin-top'), 10) + $('.descTop').height())*5;
        $('html').css('height', newHeight);

        //Trying to get parent iframe the same height as $('html')
        id = '#'+window.name;
        $(id, window.parent.document).css('height', $('html').height());
    }

    s.setDescTopArea = function() {
        $('.descTop').each(function() {
            $(this).css('width', $(this).parent().width());
            if ($(this).height() > 30) {
                newMarginTop = -58-($(this).height()-30);
                $(this).css('margin-top', newMarginTop);
            }
            else if ($(this).height() <= 30) {
                newMarginTop = -58+($(this).height()-30);
                $(this).css('margin-top', newMarginTop);
            }
        });
    };

    s.setAnswerImageArea = function() {

        $('.answerImage').each(function() {
            // height = $(this).parent.height();
            // $(this).height(height).width(height);
            height = $('.question').height();
            $(this).css('height', height);
            $(this).css('width', $(this).css('height'));

            left = ($('.question').width()-$(this).width())/2 + parseInt($('.question').css('padding-left'), 10);
            $(this).css('left', left);
        });
    };

    s.setAnswerArea = function () {

        //Pixel width the answer areas are based on
        base = 470;
        //The biggest width we want to go for images
        max = 900;
        $('.question .image').each(function () {
            parent = $(this).parent().parent().parent();
            width = $(this).parent().parent().width();
            height = parent.height() - parent.find('.questionText').height();

            prop = 1;
            imgW = $(this).data('width');
            imgH = $(this).data('height');
            oimgW = imgW;
            oimgH = imgH;
            wrong = $(this).parent().siblings('.wrong');
            correct = $(this).parent().siblings('.correct');
            answerArea = [];
            answerArea['aw'] = wrong.data('width');
            answerArea['ah'] = wrong.data('height');
            answerArea['ax'] = wrong.data('posx');
            answerArea['ay'] = wrong.data('posy');
            answerArea['w'] = correct.data('width');
            answerArea['h'] = correct.data('height');
            answerArea['x'] = correct.data('posx');
            answerArea['y'] = correct.data('posy');


            if (imgW > base) {
                prop = imgW / base;
                anwserArea = s.setAnswerAreaProportions(answerArea, prop);
            }
            if (width > max) {
                //Set imgW to max
                if (imgW > max) {
                    prop = max / imgW;
                    imgH = imgH * prop;
                    imgW = max;
                    anwserArea = s.setAnswerAreaProportions(answerArea, prop);
                }
            }
            if (imgW != width) {
                prop = width / imgW;
                imgH = imgH * prop;
                imgW = width;
                anwserArea = s.setAnswerAreaProportions(answerArea, prop);
            }
            if (imgH != height && $(window).width() >= 645) {
                prop = height / imgH;
                imgW = imgW * prop;
                imgH = height;
                anwserArea = s.setAnswerAreaProportions(answerArea, prop);
            }
            if ($(window).width() < 645) {
                parent.height(parent.find('.questionText').height() + imgH);
                height = parent.height() - parent.find('.questionText').height();
                imgW = parent.width();
                imgH = (imgW * oimgH) / oimgW;
            }

            margin = (height - imgH) / 2;
            $(this).parent().parent().css({width: imgW + 'px', height: imgH + 'px', margin: margin + 'px auto'});
            $(this).width(imgW).height(imgH);
            $(this).children('img').width(imgW).height(imgH);
            wrong.width(answerArea['aw']).height(answerArea['ah']).css('margin', answerArea['ay'] + 'px 0 0 ' + answerArea['ax'] + 'px');
            correct.width(answerArea['w']).height(answerArea['h']).css('margin', answerArea['y'] + 'px 0 0 ' + answerArea['x'] + 'px');
        });
    };

    s.setAnswerAreaProportions = function (answerArea, prop) {
        answerArea['aw'] = answerArea['aw'] * prop;
        answerArea['ah'] = answerArea['ah'] * prop;
        answerArea['ax'] = answerArea['ax'] * prop;
        answerArea['ay'] = answerArea['ay'] * prop;
        answerArea['w'] = answerArea['w'] * prop;
        answerArea['h'] = answerArea['h'] * prop;
        answerArea['x'] = answerArea['x'] * prop;
        answerArea['y'] = answerArea['y'] * prop;
        return answerArea;
    };

    s.playSound = function (c, a, v) {
        if (s.sound === 1 && ie) {
            if (typeof v === 'undefined') {
                v = .6;
            }
            if (c && a) {
                sound = $('#audio .' + c + ' .' + a);
            }
            if (sound.length > 0 && sound !== 'undefined') {
                sound.prop('volume', v).get(0).play(0);
            }
        }
    };

    s.answerQuestion = function (c, k) {
        if (c) {
            pos = Math.floor(Math.random() * $('#audio .game .correct audio').length) + 1;
            s.playSound('game', 'correct audio:nth-child(' + (pos) + ')');
            questionAudio = $('#question_audio' + s.question);
            console.log(pos);
            if (ie && questionAudio.length) {
                questionAudio.get(0).pause();
                questionAudio.get(0).currentTime = 0;
            }
            $('#question' + k + ' .answerImage').css('display', 'block');
            $('#question' + k + ' .correctImage').css('display', 'block').animate({opacity: 1}, 700, function () {
                $('#question' + k + ' .correctImage').animate({opacity: 0}, 2000, function () {
                    $('#question' + k + ' .correctImage').css('display', 'none');
                    $('#question' + k + ' .answerImage').css('display', 'none');
                });
            });
        } else {
            s.playSound('game', 'wrong audio:nth-child(' + (Math.floor(Math.random() * $('#audio .game .wrong audio').length) + 1) + ')');
            $('#question' + k + ' .answerImage').css('display', 'block');
            $('#question' + k + ' .incorrectImage').css('display', 'block').animate({opacity: 1}, 700, function () {
                $('#question' + k + ' .incorrectImage').animate({opacity: 0}, 2000, function () {
                    $('#question' + k + ' .incorrectImage').css('display', 'none');
                    $('#question' + k + ' .answerImage').css('display', 'none');
                });
            });
        }
    };
};
