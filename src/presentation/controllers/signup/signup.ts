import { InvalidParamError } from '../../errors'
import { badRequest, serverError, serverSuccess } from '../../helpers/http-helpers'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return serverSuccess(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
