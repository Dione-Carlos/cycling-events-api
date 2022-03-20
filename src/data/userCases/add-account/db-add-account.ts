import { Harsher, AccountModel, AddAccount, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(private readonly harsher: Harsher, private readonly addAccountRepository: AddAccountRepository) {
    this.harsher = harsher
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel | any> {
    const hashedPassword = await this.harsher.hash(accountData.password)

    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })

    return await new Promise(resolve => resolve(account))
  }
}
