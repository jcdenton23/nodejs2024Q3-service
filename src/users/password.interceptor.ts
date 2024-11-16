import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.filterSensitiveData(data)));
  }

  private filterSensitiveData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.omitPassword(item));
    }
    return this.omitPassword(data);
  }

  private omitPassword(data: any): any {
    if (this.isPlainObject(data)) {
      const { password, ...rest } = data;
      return rest;
    }
    return data;
  }

  private isPlainObject(value: any): value is Record<string, any> {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
}
