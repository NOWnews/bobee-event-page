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
            document.getElementById('login-status').innerHTML = ''
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
            document.getElementById('login-status').innerHTML = '擲杯前，請先確認你已登入Facebook帳號<br>初次登入的善男信女，請先填寫資料，即可開始擲杯';
            $('span.stat-history-top-number').text('');
            $('span.stat-oppotunity-number').text('');
            $('span.stat-current-combo-number').text('');
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
            if(res.responseJSON && res.responseJSON.errCode === 11000){
                alert('暱稱重複 請輸入更換暱稱');
            }
        });
});