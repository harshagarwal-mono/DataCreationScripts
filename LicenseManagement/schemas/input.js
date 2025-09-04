import { z } from 'zod';
import { EVENTS } from '../constants/index.js';

// Schema for array of IDs
const idArraySchema = z.array(z.string().min(1)).min(1, 'At least one ID must be provided');

// Create default events usage map where all events are enabled
const defaultEventsUsageMap = Object.values(EVENTS).reduce((acc, event) => {
  acc[event] = true;
  return acc;
}, {});

export const inputSchema = z.object({
  gcid: z.string({
    required_error: 'GCID is required',
    invalid_type_error: 'GCID must be a string',
  }),
  // User selection options (profileIds takes priority)
  profileIds: idArraySchema.optional(),
  usersCount: z.number().int().positive().optional(),
  
  // Event/Style selection options (styleIds takes priority)
  styleIds: idArraySchema.optional(),
  eventsCount: z.number().int().positive().optional(),
  
  // Events usage configuration
  eventsUsageMap: z.record(z.string(), z.boolean())
    .default(defaultEventsUsageMap)
    .refine(
      (map) => Object.keys(map).every(key => Object.values(EVENTS).includes(key)),
      {
        message: `Event keys must be one of: ${Object.values(EVENTS).join(', ')}`,
      }
    ),
})
.refine(
  (data) => data.profileIds || data.usersCount,
  {
    message: 'Either profileIds or usersCount must be provided',
    path: ['profileIds', 'usersCount'],
  }
)
.refine(
  (data) => data.styleIds || data.eventsCount,
  {
    message: 'Either styleIds or eventsCount must be provided',
    path: ['styleIds', 'eventsCount'],
  }
);

export const validateInput = (input) => {
  try {
    return { data: inputSchema.parse(input), error: null };
  } catch (error) {
    return { data: null, error: error.errors };
  }
};
