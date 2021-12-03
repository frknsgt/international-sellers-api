const HttpStatusCode = require('http-status-codes');
const TransactionsFactory = require('../database/transactionFactory');
const authTransactions = TransactionsFactory.creating('authTransactions');

class Authorization {
  constructor() {}

  static async userStatusAuthControl(req, res, next) {
    try {
      const result = await authTransactions.additiveUserTypesAsync(
        req.decode.UserTypeName
      );
      if (
        result.findIndex(
          statusName => statusName.UserTypeName == req.body.UserTypeName
        ) === -1
      ) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .send(
            'Unauthorized transaction! You cannot do any action on this user type.'
          );
      } else next();
    } catch (error) {
      res
        .status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(error.message);
    }
  }

  static async updateUserState(req, res, next) {
    try {
      const result = await authTransactions.updateUserState({
        Id: req.body.Id,
        UserTypeName: req.decode.UserTypeName
      });

      if (result) next();
      else
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .send('Unauthorized transaction!');
    } catch (error) {
      res
        .status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(error.message);
    }
  }
}

module.exports = Authorization;
