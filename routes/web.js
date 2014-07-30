

/* GET home page. */
exports.index = function(req, res){
  res.render('web/index', { title: 'Present' });
};

exports.privacy = function(req, res){
  res.render('web/privacy', { title: 'Present' });
};

