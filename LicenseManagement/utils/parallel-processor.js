import { from, mergeMap, of, tap } from 'rxjs';
import env from '../../config/env.js';
import { insertEvents } from '../db/index.js';
import { generateEventsForUser } from './event-generator.js';
import { writeCSVHeader, appendCSVRows } from '../../utils/index.js';

const processBatch = async (events) => {
  try {
    const insertedEvents = await insertEvents(events);
    console.log(`Successfully inserted ${events.length} events`);
    return insertedEvents;
  } catch (error) {
    console.error('Error inserting events:', error);
    throw error;
  }
};

const CSV_HEADERS = [
  'font_style_id',
  'family_id',
  'source',
  'subtype',
  'event_type',
  'profile_id',
  'gcid',
  'event_date',
  'event_count',
  'load_date'
];

export const processEventsInParallel = ({
  gcid,
  profileIds,
  fontDetails,
  eventsCount,
  shouldUseSyncAndDownloadEvent,
}) => {
  return new Promise(async (resolve, reject) => {
    let totalEventsProcessed = 0;
    const totalExpectedEvents = profileIds.length * eventsCount;

    try {
      // Initialize CSV file with headers
      await writeCSVHeader('license-events.csv', CSV_HEADERS);
      console.log('Created CSV report: license-events.csv');

      // Create an observable from profile IDs
      from(profileIds)
        .pipe(
          // Process multiple users in parallel based on PARALLEL_PROCESSING_UNITS
          mergeMap(
            (profileId) => {
              // Generate events for each user
              const events = generateEventsForUser({
                gcid,
                profileId,
                fontDetails,
                eventsCount,
                shouldUseSyncAndDownloadEvent,
              });

              // Process events in batches
              const batches = [];
              for (let i = 0; i < events.length; i += env.BATCH_SIZE) {
                batches.push(events.slice(i, i + env.BATCH_SIZE));
              }

              return from(batches);
            },
            env.PARALLEL_PROCESSING_UNITS // Concurrent processing limit
          ),
          // Process each batch and write to CSV
          mergeMap(async (batch) => {
            const insertedEvents = await processBatch(batch);
            await appendCSVRows('license-events.csv', insertedEvents);
            return batch.length;
          }),
          // Track progress
          tap({
            next: (batchSize) => {
              totalEventsProcessed += batchSize;
              const progress = ((totalEventsProcessed / totalExpectedEvents) * 100).toFixed(2);
              console.log(`Progress: ${progress}% (${totalEventsProcessed}/${totalExpectedEvents} events)`);
            },
            error: (error) => {
              console.error('Error in processing:', error);
              reject(error);
            },
            complete: () => {
              console.log('All events processed and written to CSV successfully');
              resolve();
            },
          })
        )
        .subscribe();
    } catch (error) {
      console.error('Error initializing CSV file:', error);
      reject(error);
    }
  });
}
