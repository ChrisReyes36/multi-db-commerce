import {
  BadRequestException,
  Catch,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { throwError, Observable } from 'rxjs';

type RpcErrorResponse = {
  statusCode: number;
  message: string;
  errors?: unknown;
};

@Catch()
export class RmqGlobalExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(RmqGlobalExceptionFilter.name);

  catch(exception: unknown): Observable<never> {
    const error = this.buildRpcError(exception);

    if (error.statusCode >= 500) {
      this.logger.error(exception);
    }

    return throwError(() => new RpcException(error));
  }

  private buildRpcError(exception: unknown): RpcErrorResponse {
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const data = response as Record<string, unknown>;

        return {
          statusCode: exception.getStatus(),
          message:
            typeof data.message === 'string'
              ? data.message
              : 'Error de validación',
          errors: data.errors,
        };
      }
    }

    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
      };
    }

    if (exception instanceof RpcException) {
      const error = exception.getError();

      return {
        statusCode: 500,
        message: typeof error === 'string' ? error : 'Error en microservicio',
        errors: error,
      };
    }

    return {
      statusCode: 500,
      message: 'Error interno del microservicio',
    };
  }
}
