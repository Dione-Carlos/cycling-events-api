import { DbAddAccount } from './db-add-account'
import { AccountModel, AddAccountModel, Harsher, AddAccountRepository } from './db-add-account-protocols'

const makeHarsher = (): Harsher => {
  class HarsherStub implements Harsher {
    async hash(value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HarsherStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddAccount
  harsherStub: Harsher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const harsherStub = makeHarsher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(harsherStub, addAccountRepositoryStub)

  return { sut, harsherStub, addAccountRepositoryStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Harsher with correct password', async () => {
    const { sut, harsherStub } = makeSut()
    const harshSpy = jest.spyOn(harsherStub, 'hash')

    await sut.add(makeFakeAccountData())

    expect(harshSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Harsher throws', async () => {
    const { sut, harsherStub } = makeSut()

    jest.spyOn(harsherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.add(makeFakeAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())

    expect(account).toEqual(makeFakeAccount())
  })
})
