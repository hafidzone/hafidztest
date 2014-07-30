var config, moment, rest;

rest = require('restler');

config = require('konfig')();

moment = require('moment');


exports.single = function(req, res) {
  
  console.log(config.app.API + '/presents/' + req.param('id'));
  return rest.get(config.app.API + '/presents/' + req.param('id')).on('complete', function(data, response) {
    if (response.statusCode === 200) {
      if (data.user.dp) {
        data.user.dp = data.user.dp.replace("http:", "");
      } else {
        data.user.dp = "/images/default-profile@2x.png";
      }
      return res.render('single', {
        present: data,
        moment: moment
      });
    } else {
      return res.status(404).send('Not found');
    }
  });
};

