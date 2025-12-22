var express = require('express');
var router = express.Router();

// see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
// for more examples of route definitions

// Simulated in-memory data store (in production, use a real database)
let resources = [
  { id: 1, name: 'Resource 1', description: 'First resource' },
  { id: 2, name: 'Resource 2', description: 'Second resource' }
];
let nextId = 3;

/**
 * Middleware to validate resource creation data
 * checks that 'name' is provided and is a non-empty string
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const validateResourceCreation = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name is required and must be a non-empty string'
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name must be 100 characters or less'
    });
  }

  next();
};

/**
 * Middleware to validate resource update data
 * checks that at least one of 'name' or 'description' is provided
 * and that they are of correct types if provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const validateResourceUpdate = (req, res, next) => {
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'At least one field (name or description) must be provided'
    });
  }

  if (name && (typeof name !== 'string' || name.trim() === '' || name.length > 100)) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Name must be a non-empty string with 100 characters or less'
    });
  }

  if (description && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Description must be a string'
    });
  }

  next();
};

/**
 * Middleware to validate resource ID in the URL parameter
 * checks that 'id' is a positive integer
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const validateResourceId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Resource ID must be a positive integer'
    });
  }

  req.resourceId = id;
  next();
};

/** Creating a new resource
 * POST /resources
 * Body parameters:
 * - name (string, required)
 * - description (string, optional)
 */
router.post('/resources', validateResourceCreation, (req, res) => {
  try {
    const { name, description = '' } = req.body;

    // Create the resource
    const newResource = {
      id: nextId++,
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString()
    };

    resources.push(newResource);

    // Return 201 Created with the new resource
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create resource'
    });
  }
});

/** Getting a list of resources
 * GET /resources
 * Query parameters:
 * - sortBy (string, optional): field to sort by (id, name, description, createdAt)
 * - order (string, optional): asc or desc (default: asc)
 */
router.get('/resources', (req, res) => {
  try {
    const { sortBy, order = 'asc' } = req.query;

    let result = [...resources];

    // Sorting
    if (sortBy) {
      const validSortFields = ['id', 'name', 'description', 'createdAt'];
      if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: `sortBy must be one of: ${validSortFields.join(', ')}`
        });
      }

      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === 'string') {
          return order === 'desc'
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        }

        return order === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    // Return with metadata
    res.json({
      data: result,
      metadata: {
        total: resources.length,
        count: result.length
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch resources'
    });
  }
});


// Getting a single resource
router.get('/resources/:id', validateResourceId, (req, res) => {
  try {
    const resource = resources.find(r => r.id === req.resourceId);

    if (!resource) {
      return res.status(404).json({
        error: 'Not found',
        message: `Resource with ID ${req.resourceId} not found`
      });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch resource'
    });
  }
});

// Updating an existing resource
router.put('/resources/:id', validateResourceId, validateResourceUpdate, (req, res) => {
  try {
    const resourceIndex = resources.findIndex(r => r.id === req.resourceId);

    if (resourceIndex === -1) {
      return res.status(404).json({
        error: 'Not found',
        message: `Resource with ID ${req.resourceId} not found`
      });
    }

    const { name, description } = req.body;

    // Update the resource
    if (name) {
      resources[resourceIndex].name = name.trim();
    }
    if (description !== undefined) {
      resources[resourceIndex].description = description.trim();
    }
    resources[resourceIndex].updatedAt = new Date().toISOString();

    res.json(resources[resourceIndex]);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update resource'
    });
  }
});

// Deleting a resource
router.delete('/resources/:id', validateResourceId, (req, res) => {
  try {
    const resourceIndex = resources.findIndex(r => r.id === req.resourceId);

    if (resourceIndex === -1) {
      return res.status(404).json({
        error: 'Not found',
        message: `Resource with ID ${req.resourceId} not found`
      });
    }

    // Delete the resource
    const deletedResource = resources.splice(resourceIndex, 1)[0];

    // Return the deleted resource or 204 No Content
    res.json({
      message: 'Resource deleted successfully',
      deleted: deletedResource
    });

    // Alternative: return 204 No Content
    // res.status(204).send();
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete resource'
    });
  }
});


module.exports = router;
