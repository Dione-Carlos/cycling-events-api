import { AccountModel } from '../../../userCases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>
}
