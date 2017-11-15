var bobee = {
    animtePeriod: 4500,
    animateLoading: false,
    init: function() {
        //click event
        var that = this;
        $('div.gif-wrapper').on('click', function() {
            that.playGif();
        });
        //shake event
        var myShakeEvent = new Shake({
            threshold: 10, // optional shake strength threshold
            timeout: this.animtePeriod // optional, determines the frequency of event generation
        });
        myShakeEvent.start();
        window.addEventListener('shake', this.shakeEventDidOccur, false);
    },
    shakeEventDidOccur: function() {
        var that = this;
        that.playGif();

    },
    playGif: function() {
        var that = this;
        if (this.animateLoading) {
            return;
        }
        this.animateLoading = true;
        $('img.img-game-init').animateCss('bounce');
        $.get('./play', function(res) {
            if(res.overGameLimit){
                return alert('超過今日可玩的次數囉');
            }
            updateStat();
            var gifUrl = "";
            switch (res.result) {
                case 'holy':
                    gifUrl = "./img/game-holy.gif";
                    break;
                case 'smile':
                    gifUrl = "./img/game-smile.gif";
                    break;
                case 'negative':
                    gifUrl = "./img/game-negative.gif";
                    break;
                default:
                    gifUrl = "./img/game-init.png";
                    break;
            }
            that.playAudio();
            var img = $('div.gif-wrapper').children('img').first();
            var initPngUrl = img.attr('src');
            img.attr('src', gifUrl); // 動畫開始播
            setTimeout(function() {
                img.attr('src', initPngUrl);
                that.animateLoading = false;
            }, that.animtePeriod);
        });
    },
    playAudio: function() {
        var audio = document.getElementById("audio");
        audio.play();
    },
    stopListen: function() {
        $('div.gif-wrapper').unbind('click');
        window.removeEventListener('shake', this.shakeEventDidOccur, false);
    },
    showFillForm: function(){
        var div = $('div.game');
    }
};

// bobee

// (function() {
//     var animtePeriod = 4500;
//     var animateLoading = false;

//     //click event
//     $('div.gif-wrapper').on('click', function() {
//         playGif();
//     });
//     //click event end

//     //shake event
//     var myShakeEvent = new Shake({
//         threshold: 10, // optional shake strength threshold
//         timeout: animtePeriod // optional, determines the frequency of event generation
//     });

//     myShakeEvent.start();
//     window.addEventListener('shake', shakeEventDidOccur, false);
//     var n = 1;

//     function shakeEventDidOccur() {
//         playGif();
//         $('#status').text(n++);
//     }
//     //shake event end


//     function playGif() {
//         if (animateLoading) {
//             return;
//         }
//         animateLoading = true;
//         $('img.img-game-init').animateCss('bounce');
//         $.get('./play', function(res) {
//             var gifUrl = "";
//             switch (res.result) {
//                 case 'holy':
//                     gifUrl = "./img/game-holy.gif";
//                     break;
//                 case 'smile':
//                     gifUrl = "./img/game-smile.gif";
//                     break;
//                 case 'negative':
//                     gifUrl = "./img/game-negative.gif";
//                     break;
//                 default:
//                     gifUrl = "./img/game-init.png";
//                     break;
//             }
//             playAudio();
//             var img = $('div.gif-wrapper').children('img').first();
//             var initPngUrl = img.attr('src');
//             img.attr('src', gifUrl); // 動畫開始播
//             setTimeout(function() {
//                 img.attr('src', initPngUrl);
//                 animateLoading = false;
//             }, animtePeriod);
//         });


//     }


//     function playAudio() {
//         var audio = document.getElementById("audio");
//         audio.play();
//     }
// })();