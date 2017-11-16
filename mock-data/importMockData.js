  var config = require('../config/config'),
      glob = require('glob'),
      mongoose = require('mongoose'),
      bluebird = require('bluebird'),
      moment = require('moment-timezone');

  mongoose.connect('mongodb://localhost/bobee-event-development', {
      useMongoClient: true,
  });
  mongoose.Promise = bluebird;
  mongoose.set('debug', config.mongooseDebug);

  var db = mongoose.connection;
  db.on('error', function() {
      throw new Error('unable to connect to database at ' + 'mongodb://localhost/bobee-event-development');
  });

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function(model) {
      require(model);
  });

  (async function() {
      var GameLog = mongoose.model('GameLog'),
          User = mongoose.model('User'),
          Chart = mongoose.model('Chart');

      var userNumber = 100;

      for (var i = 0; i < userNumber; i++) {
          var user = {
              facebookId: `00000000${i}`,
              name: `mock ${i} 號`,
              nickname: `小${i}號`,
              phone: `00${i}`,
              email: `pp${i}@pp.cc`
          };
          try{await User.create(user);}catch(err){
            //   console.error(err);
          }
      }
      var users = await User.find({});
      var gameLogsNumber = 5;
      for(var j=0;j<users.length;j++){
          for(var jj = 0 ; jj < gameLogsNumber ; jj++ ){
                var yesterday = moment.tz('Asia/Taipei').add(-1,'day');

                var results = ['holy', 'holy', 'smile', 'negative'];
                var randomIndex = Math.floor(Math.random() * results.length);
                var randomResult = results[randomIndex];

                await GameLog.create({
                    updatedAt: yesterday,
                    createdAt: yesterday,
                    result: randomResult,
                    facebookId : users[j].facebookId
                });

                // var now = moment();
          }
      }


      process.exit();



  })();

  // (async function(){
  //     await User.find({});
  // })();

//   process.exit();