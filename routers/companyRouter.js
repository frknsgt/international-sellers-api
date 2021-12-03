const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken } = require('../middleware');
const companyTransactions = TransactionsFactory.creating('companyTransactions');
const companyValidator = validators.companyValidator;
const HttpStatusCode = require('http-status-codes');
const tokenControl = verifyToken.tokenControl;
const { errorSender } = require('../utils');

router.get(
  '/company',
  tokenControl,
  companyValidator.limitAndOffset,
  async (req, res) => {
    try {
      const result = await companyTransactions.selectAsync(req.query);
      res.json(result);
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.get(
  '/company/:Id',
  tokenControl,
  companyValidator.paramId,
  async (req, res) => {
    try {
      const result = await companyTransactions.findOneAsync(req.params);
      res.json(result || {});
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.delete(
  '/company',
  tokenControl,
  companyValidator.bodyId,
  async (req, res) => {
    try {
      const result = await companyTransactions.deleteAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'There is no such company ID in the system !'
        );
      res.json('The company registration was deleted successfully.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.put(
  '/company',
  tokenControl,
  companyValidator.update,
  async (req, res) => {
    try {
      const result = await companyTransactions.updateAsync(req.body, {
        Id: req.body.Id
      });
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'There is no such company ID in the system !'
        );
      res.json('Company information has been updated');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('Company is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

router.post(
  '/company',
  tokenControl,
  companyValidator.insert,
  async (req, res) => {
    try {
      const result = await companyTransactions.insertAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.INTERNAL_SERVER_ERROROR,
          'There was a problem adding the company !'
        );
      res.json('Company registered.');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('Company is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

module.exports = router;
