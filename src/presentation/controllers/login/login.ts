import { badRequest } from '../../helpers/http-helpers'
import { EmailValidator } from '../signup/signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidatorStub: EmailValidator

  constructor(emailValidatorStub: EmailValidator) {
    this.emailValidatorStub = emailValidatorStub
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

    if (!password) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }

    const isValid = this.emailValidatorStub.isValid(email)

    if (!isValid) {
      return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
    }
  }
}
