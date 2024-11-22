import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDir: string;
  private readonly logFile: string;
  private readonly errorLogFile: string;
  private readonly logLevel: number;
  private readonly maxFileSize: number;

  constructor(private readonly configService: ConfigService) {
    this.logDir = this.configService.get<string>(
      'LOG_DIR',
      path.join(__dirname, '../../logs'),
    );
    this.logLevel = this.configService.get<number>('LOG_LEVEL', 2);
    this.maxFileSize = this.configService.get<number>(
      'LOG_FILE_MAX_SIZE',
      10 * 1024 * 1024,
    );

    this.logFile = path.join(this.logDir, 'app.log');
    this.errorLogFile = path.join(this.logDir, 'error.log');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(message: string) {
    if (this.shouldLog(1)) {
      this.writeLog('LOG', message, this.logFile);
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog(0)) {
      this.writeLog('ERROR', message, this.errorLogFile, trace);
    }
  }

  warn(message: string) {
    if (this.shouldLog(2)) {
      this.writeLog('WARN', message, this.logFile);
    }
  }

  debug(message: string) {
    if (this.shouldLog(3)) {
      this.writeLog('DEBUG', message, this.logFile);
    }
  }

  verbose(message: string) {
    if (this.shouldLog(4)) {
      this.writeLog('VERBOSE', message, this.logFile);
    }
  }

  private writeLog(
    level: string,
    message: string,
    filePath: string,
    trace?: string,
  ) {
    const logMessage = `${new Date().toISOString()} [${level}] ${message}${
      trace ? ` - ${trace}` : ''
    }\n`;

    this.rotateFileIfNeeded(filePath);
    fs.appendFileSync(filePath, logMessage, 'utf8');

    console.log(logMessage);
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  private rotateFileIfNeeded(filePath: string) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);

      if (stats.size >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${filePath}.${timestamp}.bak`;

        fs.renameSync(filePath, backupPath);
      }
    }
  }
}
