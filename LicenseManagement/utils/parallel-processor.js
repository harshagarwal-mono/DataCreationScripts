import { from, mergeMap, of, tap } from 'rxjs';
import env from '../../config/env.js';
import { insertEvents } from '../db/index.js';
import { generateEventsForUser } from './event-generator.js';

const processBatch = async (events) => {
  try {
    await insertEvents(events);
    console.log(`Successfully inserted ${events.length} events`);
  } catch (error) {
    console.error('Error inserting events:', error);
    throw error;
  }
};

export const processEventsInParallel = ({
  gcid,
  profileIds,
  fontDetails,
  eventsCount,
  shouldUseSyncAndDownloadEvent,
}) => {
  return new Promise((resolve, reject) => {
    let totalEventsProcessed = 0;
    const totalExpectedEvents = profileIds.length * eventsCount;

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
        // Process each batch
        mergeMap(async (batch) => {
          await processBatch(batch);
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
            console.log('All events processed successfully');
            resolve();
          },
        })
      )
      .subscribe();
  });
};
