const {
  FadabHelper,
  selectAsync,
  findOneAsync
} = require('fadab-mysql-helper');

class ProductTransactions extends FadabHelper {
  constructor() {
    super();
    this.baseTable = 'tblProduct';
    this.vwName = 'vwProductList';
  }

  vwSelectAsync(selectedOptions) {
    return selectAsync(this.vwName, selectedOptions);
  }

  vwFindOneAsync(where) {
    return findOneAsync(this.vwName, where);
  }
}

module.exports = ProductTransactions;
