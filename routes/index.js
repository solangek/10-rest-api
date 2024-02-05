var express = require('express');
var router = express.Router();

/**
 * description: render the index page
 * note : in general even if a page has no dynamic content (we could put
 * a static file index.html in the public folder and avoid writing
 * the code below), it is better to use a route to render the page
 * as it will be easier to add dynamic content in the future.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); // render the index.ejs file
});

module.exports = router;
