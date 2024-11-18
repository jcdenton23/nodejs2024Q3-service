import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  private handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
  ): HttpException {
    const errorMap: Record<string, { message: string; status: HttpStatus }> = {
      P2002: {
        message:
          'A unique constraint has been violated. Ensure that the provided value is unique.',
        status: HttpStatus.CONFLICT,
      },
      P2003: {
        message:
          'Invalid foreign key reference. Check if the related resource exists.',
        status: HttpStatus.BAD_REQUEST,
      },
      P2004: {
        message:
          'A required field is either missing or set to NULL. Please provide all mandatory fields.',
        status: HttpStatus.BAD_REQUEST,
      },
      P2025: {
        message: 'The requested record for update or deletion does not exist.',
        status: HttpStatus.NOT_FOUND,
      },
    };

    const errorDetails = errorMap[error.code];
    if (errorDetails) {
      return new HttpException(errorDetails.message, errorDetails.status);
    }

    return new HttpException(
      'An unexpected database error occurred. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return throwError(() => this.handlePrismaError(error));
        }
        return throwError(() => error);
      }),
    );
  }
}
