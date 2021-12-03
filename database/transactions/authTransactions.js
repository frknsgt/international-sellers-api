const { queryAsync } = require('fadab-mysql-helper');

class AuthTransactions {
  constructor() {}

  async additiveUserTypesAsync(UserTypeName) {
    const result = await queryAsync(`CALL prAdditiveUserTypes(?)`, [
      UserTypeName
    ]);
    return result[0];
  }

  async updateUserState({ Id, UserTypeName }) {
    return (
      await queryAsync('CALL prUpdateUserState(?,?)', [Id, UserTypeName])
    )[0][0];
  }
}

module.exports = AuthTransactions;
