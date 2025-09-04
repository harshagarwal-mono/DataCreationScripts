import { z } from 'zod';
import { MAX_TOTAL_EVENTS } from '../constants/index.js';

export const inputSchema = z.object({
  gcid: z.string({
    required_error: 'GCID is required',
    invalid_type_error: 'GCID must be a string',
  }),
  usersCount: z.number().int().positive().default(1),
  eventsCount: z.number().int().positive().default(50),
  shouldUseSyncAndDownloadEvent: z.boolean().default(true),
}).refine(
  (data) => {
    const totalEvents = data.usersCount * data.eventsCount;
    return totalEvents <= MAX_TOTAL_EVENTS;
  },
  {
    message: `Total events (usersCount * eventsCount) cannot exceed ${MAX_TOTAL_EVENTS}`,
    path: ['usersCount', 'eventsCount'],
  }
);

export const validateInput = (input) => {
  try {
    return { data: inputSchema.parse(input), error: null };
  } catch (error) {
    return { data: null, error: error.errors };
  }
};
