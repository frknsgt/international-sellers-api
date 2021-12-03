const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken } = require('../middleware');
const categoryTransactions = TransactionsFactory.creating(
  'categoryTransactions'
);
const { categoryValidator } = validators;
const { tokenControl } = verifyToken;
const { HttpStatusCode } = require('http-status-codes');
const { errorSender } = require('../utils');

router.get(
  '/category',
  tokenControl,
  categoryValidator.limitAndOffset,
  async (req, res) => {
    try {
      const result = await categoryTransactions.selectAsync(req.query);
      res.json(result);
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.stack);
    }
  }
);

router.get(
  '/category/:Id',
  tokenControl,
  categoryValidator.paramId,
  async (req, res) => {
    try {
      const result = await categoryTransactions.findOneAsync(req.params);
      res.status(HttpStatusCode.OK).json(result || {});
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.delete(
  '/category',
  tokenControl,
  categoryValidator.bodyId,
  async (req, res) => {
    try {
      const result = await categoryTransactions.deleteAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'The category Id you were looking for was not found!'
        );
      res.json('The category was deleted successfully.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.put(
  '/category',
  tokenControl,
  categoryValidator.update,
  async (req, res) => {
    try {
      const result = await categoryTransactions.updateAsync(req.body, {
        Id: req.body.Id
      });
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'The category Id you were looking for was not found!'
        );
      res.json('category information has been updated');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('Category is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

router.post(
  '/category',
  tokenControl,
  categoryValidator.insert,
  async (req, res) => {
    try {
      const result = await categoryTransactions.insertAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'There was a problem adding the category!'
        );
      res.json('category inserted.');
    } catch (err) {
      if (err.errno === 1062)
        res
          .status(HttpStatusCode.CONFLICT)
          .send('Category is already registered in the system !');
      else
        res
          .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send(err.message);
    }
  }
);

module.exports = router;
