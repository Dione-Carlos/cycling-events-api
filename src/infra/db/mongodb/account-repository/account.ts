import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account/add-account'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(accountId.insertedId)

    return MongoHelper.map(account)
  }
}
