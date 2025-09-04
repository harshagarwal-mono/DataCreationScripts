import { readAndValidateInput } from './utils/input-handler.js';
import { getProfileIds, getFontDetails } from './db/index.js';
import { processEventsInParallel } from './utils/parallel-processor.js';

async function main() {
  try {
    console.log('Starting license management data generation...');

    // Read and validate input
    const input = await readAndValidateInput();
    console.log('Input validation successful:', input);

    // Get profile IDs for the given GCID
    const profileIds = await getProfileIds(input.gcid, input.usersCount).catch((error) => {
      console.error('Error getting profile IDs:', error);
      return [];
    });
    if (profileIds.length < input.usersCount) {
      throw new Error(`Not enough users found for GCID ${input.gcid}. Required: ${input.usersCount}, Found: ${profileIds.length}`);
    }
    console.log(`Found ${profileIds.length} profile IDs`);

    // Get font details for the given GCID
    const fontDetailsResult = await getFontDetails(input.gcid, input.eventsCount);
    
    if (fontDetailsResult.styles.length === 0) {
      throw new Error(`No font details found for GCID ${input.gcid}`);
    }

    if (fontDetailsResult.message) {
      console.warn(fontDetailsResult.message);
    }

    console.log(`Found ${fontDetailsResult.availableUniqueStyles} unique font styles available`);

    // Process events in parallel
    await processEventsInParallel({
      gcid: input.gcid,
      profileIds,
      fontDetails: fontDetailsResult,
      eventsCount: input.eventsCount,
      shouldUseSyncAndDownloadEvent: input.shouldUseSyncAndDownloadEvent,
    });

    console.log('Data generation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
