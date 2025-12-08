import { Logger } from './Logger';

export abstract class BaseService {
  protected logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }
}
