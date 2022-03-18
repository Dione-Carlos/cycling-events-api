import { badRequest, serverError, serverSuccess } from '../../helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })

      return serverSuccess(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
