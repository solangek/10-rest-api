var express = require('express');
var router = express.Router();

// see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
// for more examples of route definitions


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
router.get('/resources/:id', (req,
                                              res) => {
  const resourceId = req.params.id;
  // Lookup the resource and if not found, return 404
  //         res.status(404).send('Resource not found.');
  // Else, return the resource object -  make sure to convert to JSON response
  let resource = [{somefield: "some value "}];
  res.json(resource);
});

// Updating a resource
router.put('/resources/:id', (req, res) => {
  // If resource not found, return 404, otherwise update it
  // and return the updated object or some value to confirm deletion
  res.json(req.params.id);
});

// Deleting a resource
router.delete('/resources/:id', (req, res) => {
  // If resource not found, return 404, otherwise delete it
  // and return the deleted object or some value to confirm deletion
  res.send(req.params.id);
});


// another route example for deleting a the resource
router.get('/resources/:id/delete', (req, res) => {

  const resourceId = req.params.id;
  // Return the resources
  let resource = {deleted: req.params.id}
  res.json(resource);
});



module.exports = router;
