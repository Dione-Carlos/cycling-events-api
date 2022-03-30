import { AccountModel } from '../../domain/models/account'
import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError, serverSuccess } from '../../presentation/helpers/http/http-helpers'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve(serverSuccess(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }

  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()

  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toBeCalledWith(makeFakeRequest())
  })

  test('Should return the same of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverSuccess(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeServerError())))

    await sut.handle(makeFakeRequest())

    expect(logSpy).toBeCalledWith('any_stack')
  })
})
