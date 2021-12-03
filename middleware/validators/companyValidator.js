const joi = require('joi');
const HttpStatusCode = require('http-status-codes');
const CommonValidator = require('./commonValidator');

class CompanyValidator extends CommonValidator {
  constructor() {}

  static async update(req, res, next) {
    try {
      await joi
        .object({
          Id: joi.number().required(),
          CompanyName: joi
            .string()
            .min(3)
            .max(100)
            .pattern(new RegExp('^[A-Za-zÇçÖöŞşÜüĞğİı ]+$'))
            .required(),
          PhoneNumber: joi.string().max(20).pattern(new RegExp('^[+0-9 ]+$')),
          Description: joi.string().max(256).required(),
          Password: joi.string().max(99).required(),
          EmailAddress: joi.string().min(3).max(200).required()
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
          CompanyName: joi
            .string()
            .min(3)
            .max(100)
            .pattern(new RegExp('^[A-Za-zÇçÖöŞşÜüĞğİı ]+$'))
            .required(),
          PhoneNumber: joi.string().max(20).pattern(new RegExp('^[+0-9 ]+$')),
          Description: joi.string().max(256).required(),
          Password: joi.string().max(99).required(),
          EmailAddress: joi.string().min(3).max(200).required()
        })
        .validateAsync(req.body);
      next();
    } catch (err) {
      res.status(HttpStatusCode.EXPECTATION_FAILED).send(err.message);
    }
  }
}

module.exports = CompanyValidator;
