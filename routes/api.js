var express = require('express');
var router = express.Router();

// see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
// for more examples of route definitions

// THIS EXAMPLE DOES NOT (and should) DEAL WITH ERRORS -  check on the parameters
// THIS EXAMPLE DOES NOT (and should) DEAL WITH VALIDATION -  check on the parameters

// Creating a resource
router.post('/resources', (req, res) => {
  // to extract the resource info (for example "name") sent by the client, use
  const name = req.body.prodname;

  // Create the resource and return for example the resource object
  let resource = {somefield: req.body.prodname}; // we return a fixed value for demonstration purpose
  res.json(resource);
});

// Getting all the resources
router.get('/resources', (req, res) => {
  // To read for example a query string parameter (?sortBy=title) use:
  const sortBy = req.query.sortBy;
  // Return the resources
  let resource = [{somefield: "some value "},{somefield: "another value "}];
  res.json(resource);
});


// Getting a single resource
// for example /resources/123 where 123 is some identifier to search for a resource
router.get('/resources/:id', (req, res) => {
  const resourceId = req.params.id;
  // Lookup the resource and if not found, return 404
  //         res.status(404).send('Resource not found.');
  // Else, return the resource object -  make sure to convert to JSON response

  // we return some fixed value for demonstration purpose
  let resource = [{somefield: resourceId},{somefield: "another value "}];
  res.json(resource);

});

// Updating an existing resource
router.put('/resources/:id', (req, res) => {
  // If resource not found, return 404, otherwise update it
  // and return the updated object or some value to confirm deletion
  res.json(req.params.id);
});

// Deleting a resource
router.delete('/resources/:id', (req, res) => {
  // If resource not found, return 404, otherwise delete it

  // and return the deleted object or some value to confirm deletion
  // we could also return a 204 status code
  res.send(req.params.id);
});


// another route example for deleting a resource using GET
// this is WRONG! you are supposed to use DELETE for deleting a resource
router.get('/resources/:id/delete', (req, res) => {
  const resourceId = req.params.id;
  // Return the resources
  let resource = {deleted: req.params.id}
  res.json(resource);
});



module.exports = router;
