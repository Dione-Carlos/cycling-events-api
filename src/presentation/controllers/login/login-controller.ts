import { badRequest, serverError, serverSuccess, unauthorized } from '../../helpers/http/http-helpers'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor(private readonly authentication: Authentication, private readonly validation: Validation) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) return badRequest(error)

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) return unauthorized()

      return serverSuccess({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
