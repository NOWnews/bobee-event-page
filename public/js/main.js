  //鬼火size RWD
  if (window.innerWidth < 1200) {
    $(".fire img").load(function () {
      var ele = $(this);
      var scale = (window.innerWidth - 30) / 1140;
      var height = ele.height();
      var width = ele.width();
      ele.css('height', height * scale);
      ele.css('width', width * scale);
    });
  }
  //跟著scroll滑動效果
  var rellax = new Rellax('.rellax');

  //fb登入檢查
  function statusChangeCallback() {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        getUserData();
      } else {
        $('div#slot-machine').css('visibility', 'hidden');
        $('div.bg-cover').removeClass('hide');
        $('div.prevent-cover').removeClass('hide');
        document.getElementById('status').innerHTML = '請先登入Facebook才能玩遊戲！！'
      }
    });
  }

  //取得使用者資料
  function getUserData() {
    FB.api('/me?fields=email', function (response) {
      window.fbRes = response;
      if (response.error) {
        document.getElementById('status').innerHTML = '取得資料有誤，請重新登入後才可以玩遊戲!!';
        $('div.bg-cover').removeClass('hide');
        $('div#slot-machine').css('visibility', 'hidden');
      } else {
        leftCountCheck();
      }
    });
  }

  //剩幾場可玩
  function leftCountCheck() {
    $('div.prevent-cover').removeClass('hide');
    var settings = {
      "url": "/leftCount",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      },
      "data": {
        "facebookId": window.fbRes.id
      }
    }
    $.ajax(settings).done(function (response) {
      if (response.leftCount > 0) {
        $('div.prevent-cover').addClass('hide');
        $.get('/todayScore?facebookId=' + window.fbRes.id, function (res) {
          document.getElementById('status').innerHTML = '今日戰績：' + '<span style="font-size:5em;">' + res.todayWin + '</span> 勝 ' + '<span style="font-size:5em;">' + res.todayLose + '</span> 敗';
        });
        widget.init();
        $('div.bg-cover').addClass('hide');
        $('div#slot-machine').removeClass('hide');
        $('div#slot-machine').css('visibility', 'visible');
      } else {
        $('div#slot-machine').css('visibility', 'hidden');
        setTimeout(function () {
          $('div.bg-cover').removeClass('hide');
        }, 4000);
        document.getElementById('status').innerHTML = '一個帳號一天只能玩' + response.dailyPlayLimit + '次喔，你已經超過囉！！';
      }
    });
  }

  //每次遊戲紀錄
  function postRecord(win) {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        var settings = {
          "url": "/record",
          "method": "POST",
          "headers": {
            "content-type": "application/x-www-form-urlencoded",
          },
          "data": {
            "facebookId": window.fbRes.id,
            "facebookEmail": window.fbRes.email,
            "isWin": win
          }
        };
        $.ajax(settings).done(function (response) {
          leftCountCheck();
          //如果沒聯絡人資訊的話就填聯絡表
          if (!response.hasContact) {
            $('div.contact-form-div-wrapper').removeClass('hide');
          }
        });
      } else {
        FB.login();
      }
    });
  }

  //中獎通知聯絡表
  $('form#contact-form').on('submit', function (e) {
    e.preventDefault();
    $('#form-input-facebookId').val(fbRes.id);
    $('#form-input-facebookEmail').val(fbRes.email);
    $.post("/contact", $("form#contact-form").serialize());
    $('div.contact-form-div-wrapper').addClass('hide');
  });
