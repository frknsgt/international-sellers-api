const { FadabHelper } = require('fadab-mysql-helper');

class CompanyTransactions extends FadabHelper {
  constructor() {
    super();
    this.baseTable = 'tblCompany';
  }
}

module.exports = CompanyTransactions;
