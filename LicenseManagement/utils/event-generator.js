import {
  EVENTS,
  EVENT_SOURCES,
  EVENT_SUBTYPE,
  MIN_EVENT_COUNT,
  MAX_EVENT_COUNT,
} from '../constants/index.js';
import { fontDetailsSchema } from '../schemas/font.js';

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random number between min and max (inclusive)
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Get available events based on configuration
const getAvailableEvents = (shouldUseSyncAndDownloadEvent) => {
  const events = Object.values(EVENTS);
  if (!shouldUseSyncAndDownloadEvent) {
    return events.filter(event => event !== EVENTS.SYNC && event !== EVENTS.DOWNLOAD);
  }
  return events;
};


const validateFontDetails = (fontDetails) => {
  try {
    fontDetailsSchema.parse(fontDetails);
  } catch (error) {
    throw new Error(`Invalid font details: ${error.errors[0].message}`);
  }
};

export const generateEvent = ({
  gcid,
  profileId,
  fontDetails,  // This is now a single font detail object, not an array
  shouldUseSyncAndDownloadEvent,
}) => {
  console.log('fontDetails', fontDetails);
  // Validate font details before using them
  validateFontDetails(fontDetails);

  const availableEvents = getAvailableEvents(shouldUseSyncAndDownloadEvent);
  const currentDate = new Date();

  return {
    font_style_id: fontDetails.font_style_id,
    family_id: fontDetails.family_id,
    style_name: fontDetails.font_name,
    source: getRandomItem(Object.values(EVENT_SOURCES)),
    subtype: EVENT_SUBTYPE,
    event_type: getRandomItem(availableEvents),
    profile_id: profileId,
    gcid,
    event_date: currentDate,
    event_count: getRandomNumber(MIN_EVENT_COUNT, MAX_EVENT_COUNT),
    load_date: currentDate,
  };
};

export const generateEventsForUser = ({
  gcid,
  profileId,
  fontDetails,
  eventsCount,
  shouldUseSyncAndDownloadEvent,
}) => {
  const { styles } = fontDetails;
  const events = [];
  
  // Shuffle the complete styles array to get random unique styles for this user
  const shuffledStyles = [...styles]
    .sort(() => Math.random() - 0.5);
  
  // For each event, use a unique style if available, otherwise reuse from the beginning
  for (let i = 0; i < eventsCount; i++) {
    // Use modulo to wrap around to the beginning if we need more styles than available
    const styleIndex = i % styles.length;
    
    // If we're starting to reuse styles, log a warning
    if (i >= styles.length) {
      console.log(`Warning: User ${profileId} is reusing styles after ${styles.length} events`);
    }
    
    const fontStyle = shuffledStyles[styleIndex];
    
    events.push(
      generateEvent({
        gcid,
        profileId,
        fontDetails: {
          font_style_id: fontStyle.font_style_id,
          family_id: fontStyle.family_id,
          font_name: fontStyle.name
        },
        shouldUseSyncAndDownloadEvent,
      })
    );
  }

  return events;
};
