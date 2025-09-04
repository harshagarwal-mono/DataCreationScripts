import { readAndValidateInput } from './utils/input-handler.js';
import { getProfileIds, getFontDetails } from './db/index.js';
import { processEventsInParallel } from './utils/parallel-processor.js';

async function main() {
  try {
    console.log('Starting license management data generation...');

    // Read and validate input
    const input = await readAndValidateInput();
    console.log('Input validation successful:', input);

    // Get profile IDs based on input type
    const profileIds = await getProfileIds(input.gcid, {
      profileIds: input.profileIds,
      usersCount: input.usersCount
    }).catch((error) => {
      console.error('Error getting profile IDs:', error);
      return [];
    });
    console.log(`Using ${profileIds.length} profile IDs`);

    // Get font details based on input type
    const fontDetails = await getFontDetails({
      styleIds: input.styleIds,
      eventsCount: input.eventsCount
    }).catch((error) => {
      console.error('Error getting font details:', error);
      return [];
    });

    console.log(`Using ${fontDetails.length} font styles`);

    // Process events in parallel
    await processEventsInParallel({
      gcid: input.gcid,
      profileIds,
      fontDetails,
      eventsCount: input.eventsCount,
      eventsUsageMap: input.eventsUsageMap,
    });

    console.log('Data generation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
