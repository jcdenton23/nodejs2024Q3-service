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
        message: 'Unique constraint violation',
        status: HttpStatus.CONFLICT,
      },
      P2003: {
        message: 'Foreign key constraint violation',
        status: HttpStatus.BAD_REQUEST,
      },
      P2004: {
        message: 'A required field is missing or is NULL',
        status: HttpStatus.BAD_REQUEST,
      },
      P2025: {
        message: 'Record to update not found',
        status: HttpStatus.NOT_FOUND,
      },
    };

    const errorDetails = errorMap[error.code];
    if (errorDetails) {
      return new HttpException(errorDetails.message, errorDetails.status);
    }

    return new HttpException(
      'Internal Server Error',
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
