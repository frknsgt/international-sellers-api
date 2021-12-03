const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken } = require('../middleware');
const productTransactions = TransactionsFactory.creating('productTransactions');
const { productValidator } = validators;
const HttpStatusCode = require('http-status-codes');
const tokenControl = verifyToken.tokenControl;
const { errorSender } = require('../utils');

router.get(
  '/product',
  tokenControl,
  productValidator.limitAndOffset,
  async (req, res) => {
    try {
      const result = await productTransactions.vwSelectAsync(req.query);
      res.json(result);
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.get(
  '/product/:Id',
  tokenControl,
  productValidator.paramId,
  async (req, res) => {
    try {
      const result = await productTransactions.vwFindOneAsync(req.params);
      res.json(result || {});
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.delete(
  '/product',
  tokenControl,
  productValidator.bodyId,
  async (req, res) => {
    try {
      const result = await productTransactions.deleteAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'There is no such product ID in the system !'
        );
      res.json('The product registration was deleted successfully.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.put(
  '/product',
  tokenControl,
  productValidator.update,
  async (req, res) => {
    try {
      const result = await productTransactions.updateAsync(req.body, {
        Id: req.body.Id
      });
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'There is no such product ID in the system !'
        );
      res.json('product information has been updated');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('product is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

router.post(
  '/product',
  tokenControl,
  productValidator.insert,
  async (req, res) => {
    try {
      const result = await productTransactions.insertAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.INTERNAL_SERVER_ERROROR,
          'There was a problem adding the product !'
        );
      res.json('product registered.');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('product is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

module.exports = router;
