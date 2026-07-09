import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { RpcException } from '@nestjs/microservices';

type ErrorBody = {
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
  errors?: unknown;
};

type RpcErrorResponse = {
  statusCode: number;
  message: string;
  errors?: unknown;
};

function isRpcErrorResponse(error: unknown): error is RpcErrorResponse {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const data = error as Record<string, unknown>;

  return typeof data.statusCode === 'number' && typeof data.message === 'string';
}

function getRpcErrorResponse(error: unknown): RpcErrorResponse | undefined {
  if (isRpcErrorResponse(error)) {
    return error;
  }

  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const data = error as Record<string, unknown>;

  return isRpcErrorResponse(data.error) ? data.error : undefined;
}

@Catch()
export class HttpGlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpGlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.buildErrorResponse(exception, request);

    if (body.statusCode >= 500) {
      this.logger.error(exception);
    }

    response.status(body.statusCode).json(body);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const data = response as Record<string, unknown>;

        return {
          statusCode: status,
          message:
            typeof data.message === 'string'
              ? data.message
              : 'Error en la solicitud',
          path: request.url,
          timestamp: new Date().toISOString(),
          errors: data.errors,
        };
      }

      return {
        statusCode: status,
        message: String(response),
        path: request.url,
        timestamp: new Date().toISOString(),
      };
    }

    if (exception instanceof RpcException) {
      const error = exception.getError();
      const rpcError = getRpcErrorResponse(error);

      if (rpcError) {
        return {
          statusCode: rpcError.statusCode,
          message: rpcError.message,
          path: request.url,
          timestamp: new Date().toISOString(),
          errors: rpcError.errors,
        };
      }

      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: typeof error === 'string' ? error : 'Error en microservicio',
        path: request.url,
        timestamp: new Date().toISOString(),
        errors: error,
      };
    }

    const rpcError = getRpcErrorResponse(exception);

    if (rpcError) {
      return {
        statusCode: rpcError.statusCode,
        message: rpcError.message,
        path: request.url,
        timestamp: new Date().toISOString(),
        errors: rpcError.errors,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      path: request.url,
      timestamp: new Date().toISOString(),
    };
  }
}
