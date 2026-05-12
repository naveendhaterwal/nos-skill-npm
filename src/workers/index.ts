export class AsyncQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: (() => Promise<void>)[] = [];

  constructor(concurrency: number = 10) {
    this.concurrency = concurrency;
  }

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.next();
        }
      });
      this.next();
    });
  }

  private next() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }
    this.running++;
    const task = this.queue.shift();
    if (task) task();
  }
}

export const globalQueue = new AsyncQueue(20); // 20 concurrent file reads
