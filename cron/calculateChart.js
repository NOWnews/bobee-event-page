import Debug from 'debug';
const debug = Debug('bobee-event-page/cron/calculateChart.js');
import Promise from 'bluebird';
import cron from 'cron';
import _ from 'lodash';
import moment from 'moment-timezone';
import mongoose from 'mongoose';

var GameLog = mongoose.model('GameLog');
var User = mongoose.model('User');
var Chart = mongoose.model('Chart');

module.exports = new cron.CronJob({
    //設定每5分鐘收錄一次
    cronTime: '0 */5 * * * *',

    // 主要邏輯區
    onTick: async() => {
        try {
            console.log('----- 每5分鐘的計算排行開始 -----');
            var allUserGameLog = await GameLog.find();
            var gameLogsByFacebookId = _.groupBy(allUserGameLog, 'facebookId');

            _.forEach(gameLogsByFacebookId, async (logs) => {
                //計算個人歷史最高連續聖杯數
                var mostHolyCount = 0;
                var count = 0;
                var isHoly = false;
                var reachedTime;
                _.forEach(logs, log => {
                    var isHoly = log.result === 'holy';
                    if (isHoly) {
                        ++count;
                        if (count >= mostHolyCount) {
                            reachedTime = log.createdAt;
                        }
                    } else {
                        count = 0;
                    }
                    if (count >= mostHolyCount) {
                        mostHolyCount = count;
                    }
                });


                debug('Chart going to be saved %O', {
                    facebookId : logs[0].facebookId,
                    mostHolyCount,
                    reachedTime
                });

                await Chart.findOneAndUpdate({
                    facebookId : logs[0].facebookId,
                },{
                    nickname: logs[0].nickname,
                    facebookId : logs[0].facebookId,
                    mostHolyCount,
                    reachedTime
                },{
                    upsert : true
                })

            });
            console.log('----- 每5分鐘的計算排行結束 -----');
        } catch (err) {
            return console.error(err);
        }
    },
    start: true,
    runOnInit: true
});