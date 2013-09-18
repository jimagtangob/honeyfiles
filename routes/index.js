
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Honey File by Threat Stack, Inc',
    layout: 'main'
  });
};

// LOGIN
exports.login = function(req, res){
  res.render('login', { 
    title: 'Honey File Login',
    layout: 'login'
  });
};
