import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, body, query } = req;

    const logRequestAndResponse = () => {
      const statusCode = res.statusCode;
      const logMessage = this.formatLogMessage(
        method,
        url,
        query,
        body,
        statusCode,
      );
      this.loggingService.log(logMessage);
    };

    res.on('finish', logRequestAndResponse);

    next();
  }

  private formatLogMessage(
    method: string,
    url: string,
    query: Record<string, any>,
    body: Record<string, any>,
    statusCode: number,
  ): string {
    return `Request: ${method} ${url}, Query: ${JSON.stringify(
      query,
    )}, Body: ${JSON.stringify(body)}; Response: ${statusCode}`;
  }
}
