export class QueueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnknownQueueError extends QueueError {
  constructor() {
    super("An unexpected error occurred. Please try again later.");
  }
}
