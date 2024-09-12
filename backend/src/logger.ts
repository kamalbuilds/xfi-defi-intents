export class Logger {
  public where: string;

  constructor(page: string) {
    this.where = page;
  }

  public log(message: string): void {
    console.log(`[${new Date().toISOString()}] - [${this.where}] - ${message}`);
  }

  public error(message: string): void {
    console.error(
      `[${new Date().toISOString()}] - [${this.where}] - ${message}`
    );
  }

  public warn(message: string): void {
    console.warn(
      `[${new Date().toISOString()}] - [${this.where}] - ${message}`
    );
  }

  public info(message: string): void {
    console.info(
      `[${new Date().toISOString()}] - [${this.where}] - ${message}`
    );
  }

  public debug(message: string): void {
    console.debug(
      `[${new Date().toISOString()}] - [${this.where}] - ${message}`
    );
  }
}
