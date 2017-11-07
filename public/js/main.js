function updateStat() {
    $.get("/statistic").done(function(statRes) {
        console.log(statRes);
        setTimeout(function() {
            $('span.stat-history-top-number').text(statRes.mostHolyCount);
            $('span.stat-oppotunity-number').text(statRes.todayOppotunity);
            $('span.stat-current-combo-number').text(statRes.currentComboNumber);
        }, 1000)

    });
}


//fb登入檢查
function statusChangeCallback() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            $.post("/login", response)
                .done(function() {
                    bobee.init();
                    updateStat();
                })
                .fail(function() {
                    console.error('登入後未驗證成功');
                });
        } else {
            bobee.stopListen();
            document.getElementById('status').innerHTML = '請先登入Facebook才能玩遊戲！！'
        }
    });
}