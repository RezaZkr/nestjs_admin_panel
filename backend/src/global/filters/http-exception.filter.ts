import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get exception response (can be a string or an object)
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    let errorMessage: string;
    let errors;

    if (typeof message === 'string') {
      errorMessage = message;
    } else if (typeof message === 'object') {
      errors = message;
    } else {
      errorMessage = exception.message || 'Internal server error';
    }

    response.status(status).json({
      status: status,
      message: errorMessage,
      errors: errors,
      error: HttpStatus[status] || 'Unknown Error', // Convert status code to text
    });
  }
}
