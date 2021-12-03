const { FadabHelper } = require('fadab-mysql-helper');

class CategoryTransactions extends FadabHelper {
  constructor() {
    super();
    this.baseTable = 'tblCategory';
  }
}

module.exports = CategoryTransactions;
