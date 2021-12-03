const router = require('express')();
const TransactionsFactory = require('../database/transactionFactory');
const { validators, verifyToken } = require('../middleware');
const orderTransactions = TransactionsFactory.creating('orderTransactions');
const { orderValidator } = validators;
const HttpStatusCode = require('http-status-codes');
const tokenControl = verifyToken.tokenControl;
const { errorSender } = require('../utils');

router.get(
  '/order',
  tokenControl,
  orderValidator.limitAndOffset,
  async (req, res) => {
    try {
      const result = await orderTransactions.vwSelectAsync(req.query);
      res.json(result);
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.get(
  '/order/:Id',
  tokenControl,
  orderValidator.paramId,
  async (req, res) => {
    try {
      const result = await orderTransactions.vwFindOneAsync(req.params);
      res.json(result || {});
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.delete(
  '/order',
  tokenControl,
  orderValidator.bodyId,
  async (req, res) => {
    try {
      const result = await orderTransactions.deleteAsync(req.body);
      if (!result.affectedRows)
        throw errorSender.errorObject(
          HttpStatusCode.GONE,
          'There is no such order ID in the system !'
        );
      res.json('The order registration was deleted successfully.');
    } catch (err) {
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
    }
  }
);

router.put('/order', tokenControl, orderValidator.update, async (req, res) => {
  try {
    const result = await orderTransactions.updateAsync(req.body, {
      Id: req.body.Id
    });
    if (!result.affectedRows)
      throw errorSender.errorObject(
        HttpStatusCode.GONE,
        'There is no such order ID in the system !'
      );
    res.json('order information has been updated');
  } catch (err) {
    if (err.errno === 1062)
      res
        .status(HttpStatusCode.CONFLICT)
        .send('order is already registered in the system !');
    else
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
  }
});

router.post('/order', tokenControl, orderValidator.insert, async (req, res) => {
  try {
    const result = await orderTransactions.insertAsync(req.body);
    if (!result.affectedRows)
      throw errorSender.errorObject(
        HttpStatusCode.INTERNAL_SERVER_ERROROR,
        'There was a problem adding the order !'
      );
    res.json('order registered.');
  } catch (err) {
    if (err.errno === 1062)
      res
        .status(HttpStatusCode.CONFLICT)
        .send('order is already registered in the system !');
    else
      res
        .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(err.message);
  }
});

module.exports = router;
