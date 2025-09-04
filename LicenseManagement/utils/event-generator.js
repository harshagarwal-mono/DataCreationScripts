import {
  EVENTS,
  EVENT_SOURCES,
  EVENT_SUBTYPE,
  MIN_EVENT_COUNT,
  MAX_EVENT_COUNT,
} from '../constants/index.js';

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

export const generateEvent = ({
  gcid,
  profileId,
  fontDetails,
  shouldUseSyncAndDownloadEvent,
}) => {
  const availableEvents = getAvailableEvents(shouldUseSyncAndDownloadEvent);
  const currentDate = new Date();

  // Get random font details
  const { font_style_id, family_id } = getRandomItem(fontDetails);

  return {
    font_style_id,
    family_id,
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
  return Array.from({ length: eventsCount }, () =>
    generateEvent({
      gcid,
      profileId,
      fontDetails,
      shouldUseSyncAndDownloadEvent,
    })
  );
};
