import express, { Router, Request, Response, NextFunction } from 'express';
import crudController from '../controllers/crudController';
import { Model, Document } from 'mongoose';

// Build a standard REST router for a model.
export default function resourceRouter(ModelClass: any, label: string): Router {
  const router = express.Router();
  const c = crudController(ModelClass, label);

  router.get('/', c.getAll);
  router.get('/:id', c.getOne);
  router.post('/', c.create);
  router.put('/:id', c.update);
  router.delete('/:id', c.remove);

  return router;
}
