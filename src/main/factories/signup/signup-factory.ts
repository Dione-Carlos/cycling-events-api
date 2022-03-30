import { Controller } from '../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { DbAddAccount } from '../../../data/userCases/add-account/db-add-account'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())

  return new LogControllerDecorator(signUpController, new LogMongoRepository())
}
