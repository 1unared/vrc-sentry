import { JobType, type JobHandlers } from './registry';



export const handlers: JobHandlers = {
  [JobType.GET_CURRENT_USER]: async() => { throw new Error("To be implemented!") },
  }
