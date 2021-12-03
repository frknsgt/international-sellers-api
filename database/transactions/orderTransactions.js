const {
  FadabHelper,
  selectAsync,
  findOneAsync
} = require('fadab-mysql-helper');

class OrderTransactions extends FadabHelper {
  constructor() {
    super();
    this.baseTable = 'tblOrder';
    this.vwName = 'vwOrderList';
  }

  vwSelectAsync(selectedOptions) {
    return selectAsync(this.vwName, selectedOptions);
  }

  vwFindOneAsync(where) {
    return findOneAsync(this.vwName, where);
  }
}

module.exports = OrderTransactions;
