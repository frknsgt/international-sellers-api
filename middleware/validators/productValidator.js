const joi = require('joi');
const HttpStatusCode = require('http-status-codes');
const CommonValidator = require('./commonValidator');

class ProductValidator extends CommonValidator {
  constructor() {}

  static async update(req, res, next) {
    try {
      await joi
        .object({
          Id: joi.number().required(),
          ProductName: joi.string().min(3).max(100),
          Price: joi.number(),
          StockAmount: joi.number(),
          Description: joi.string().max(256),
          CategoryID: joi.number(),
          ImagePath: joi.string().max(200)
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }

  static async insert(req, res, next) {
    try {
      await joi
        .object({
          ProductName: joi.string().max(100).required(),
          Price: joi.number().required(),
          StockAmount: joi.number().required(),
          Description: joi.string().max(256).required(),
          CategoryID: joi.number().required(),
          ImagePath: joi.string().max(200)
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }
}

module.exports = ProductValidator;
