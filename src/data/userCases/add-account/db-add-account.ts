import { Encrypter, AccountModel, AddAccount, AddAccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return await new Promise(resolve => resolve({ email: '', id: '', name: '', password: '' }))
  }
}
