function updateStat() {
    $.get("/statistic").done(function(statRes) {
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
                .done(function(res) {
                    if (res.hasContactInfo) {
                        bobee.init();
                        updateStat();
                    } else {
                        $("#contactInfoModal").modal('show');
                    }

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

//填寫contact info
$("#contactInfoForm").on('submit', function(e) {
    e.preventDefault();
    var serializedData = $(this).serializeArray();
    var dataObj = {};
    $.map(serializedData, function(n, i) {
        dataObj[n['name']] = n['value'];
    });
    $.post('contactInfo', dataObj)
        .done(function(res) {
             $("#contactInfoModal").modal('hide');
             bobee.init();
             updateStat();
        })
        .fail(function(res) {
            console.error(res);
        });
});