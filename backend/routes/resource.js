const express = require('express');
const crudController = require('../controllers/crudController');

// Build a standard REST router for a model.
function resourceRouter(Model, label) {
  const router = express.Router();
  const c = crudController(Model, label);

  router.get('/', c.getAll);
  router.get('/:id', c.getOne);
  router.post('/', c.create);
  router.put('/:id', c.update);
  router.delete('/:id', c.remove);

  return router;
}

module.exports = resourceRouter;
