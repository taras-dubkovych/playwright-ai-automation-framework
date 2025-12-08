export class Logger {
  constructor(private context: string) {}

  info(message: string) {
    console.log(`[INFO] [${this.context}] ${message}`);
  }

  warn(message: string) {
    console.warn(`[WARN] [${this.context}] ${message}`);
  }

  error(message: string, error?: unknown) {
    console.error(`[ERROR] [${this.context}] ${message}`);
    if (error) {
      console.error(error);
    }
  }
}
