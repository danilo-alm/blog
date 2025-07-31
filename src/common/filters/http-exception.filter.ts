import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const message = this.extractMessage(errorResponse, exception);

    response.status(status).json({
      statusCode: status,
      message: message,
      date: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractMessage(
    errorResponse: any,
    exception: HttpException,
  ): string | string[] {
    if (typeof errorResponse === 'string') {
      return errorResponse;
    }

    if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      'message' in errorResponse
    ) {
      return (errorResponse as { message: string | string[] }).message;
    }

    console.error('Erro inesperado:', exception);
    return 'Um erro inesperado ocorreu.';
  }
}
