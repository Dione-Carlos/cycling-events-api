import { Controller } from '../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation'
import { LogControllerDecorator } from '../decorators/log'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { DbAddAccount } from '../../data/userCases/add-account/db-add-account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): Controller => {
  const salt = 10
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())

  return new LogControllerDecorator(signUpController, new LogMongoRepository())
}
