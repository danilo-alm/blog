import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpStatus: number;
    let message: string;
    let constraintField: string | undefined;

    switch (exception.code) {
      case 'P2002':
        httpStatus = HttpStatus.CONFLICT;
        message = 'Entidade já existe';
        break;

      case 'P2003':
        constraintField = (
          exception.meta?.constraint as string[] | undefined
        )?.[0];
        httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
        message = `Entidade referenciada por ${constraintField} não existe`;
        break;

      case 'P2014':
        httpStatus = HttpStatus.CONFLICT;
        message = 'Entidade possui dependentes';
        break;

      case 'P2025':
        httpStatus = HttpStatus.NOT_FOUND;
        message = 'Entidade não encontrada';
        break;

      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        message =
          'Um erro inesperado aconteceu. Por favor, contate o administrador';
        console.error('An unexpected error occurred:', exception);
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: message,
      date: new Date().toISOString(),
      path: request.url,
    });
  }
}
