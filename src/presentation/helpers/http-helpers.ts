import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error?: Error): HttpResponse => {
  if (error) {
    console.log(error) // add a logger to visualize the logs
  }

  return {
    statusCode: 500,
    body: new ServerError()
  }
}

export const serverSuccess = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
