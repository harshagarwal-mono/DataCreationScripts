import { cdlDbPool } from '../../db/index.js';

// Validate customer exists and GCID is valid
export const validateCustomer = async (gcid) => {
  const [rows] = await cdlDbPool.execute(
    'SELECT COUNT(*) as count FROM user WHERE gcid = ?',
    [gcid]
  );
  return rows[0].count > 0;
};

// Get profile IDs based on specific profile IDs
const getProfileIdsBasedOnGivenProfileIds = async (gcid, profileIds) => {
  const placeholders = profileIds.map(() => '?').join(',');
  const [rows] = await cdlDbPool.execute(
    `SELECT DISTINCT profile_id 
     FROM user 
     WHERE gcid = ? 
     AND profile_id IN (${placeholders})`,
    [gcid, ...profileIds]
  );

  const foundIds = rows.map(row => row.profile_id);
  const missingIds = profileIds.filter(id => !foundIds.includes(id));
  
  if (missingIds.length > 0) {
    throw new Error(`Some profile IDs were not found for GCID ${gcid}: ${missingIds.join(', ')}`);
  }
  
  return foundIds;
};

// Get profile IDs based on count
const getProfileIdsBasedOnCount = async (gcid, count) => {
  const [rows] = await cdlDbPool.query(
    'SELECT DISTINCT profile_id FROM user WHERE gcid = ? LIMIT ' + Number(count),
    [gcid]
  );
  return rows.map(row => row.profile_id);
};

// Main function to get profile IDs
export const getProfileIds = async (gcid, options) => {
  return options.profileIds
    ? getProfileIdsBasedOnGivenProfileIds(gcid, options.profileIds)
    : getProfileIdsBasedOnCount(gcid, options.usersCount);
};

// Get font details based on specific style IDs
const getFontDetailsBasedOnGivenStyleIds = async (styleIds) => {
  const placeholders = styleIds.map(() => '?').join(',');
  const [rows] = await cdlDbPool.execute(
    `SELECT DISTINCT fs.font_style_id, fs.family_id, fs.name
     FROM font_style fs
     WHERE fs.font_style_id IN (${placeholders})`,
    [...styleIds]
  );

  const foundIds = rows.map(row => row.font_style_id);
  const missingIds = styleIds.filter(id => !foundIds.includes(id));
  
  if (missingIds.length > 0) {
    throw new Error(`Some style IDs were not found: ${missingIds.join(', ')}`);
  }

  return rows;
};

// Get font details based on count
const getFontDetailsBasedOnCount = async (count) => {
  // Fetch all unique styles
  const [rows] = await cdlDbPool.query(
    `SELECT DISTINCT sd.font_style_id, sd.family_id, fs.name
     FROM sync_download sd JOIN font_style fs ON sd.font_style_id = fs.font_style_id
     LIMIT ${count}`,
  );

  if (rows.length < count) {
    throw new Error(`Only ${rows.length} unique styles available. Some styles will be reused.`);
  }

  return rows;
};

// Main function to get font details
export const getFontDetails = async (options) => {
  return options.styleIds
    ? getFontDetailsBasedOnGivenStyleIds(options.styleIds)
    : getFontDetailsBasedOnCount(options.eventsCount);
};

// Insert events in batches and return inserted rows
export const insertEvents = async (events) => {
  const query = `
    INSERT INTO sync_download 
    (font_style_id, family_id, source, subtype, event_type, profile_id, gcid, event_date, event_count, load_date)
    VALUES ?
  `;
  
  const values = events.map(event => [
    event.font_style_id,
    event.family_id,
    event.source,
    event.subtype,
    event.event_type,
    event.profile_id,
    event.gcid,
    event.event_date,
    event.event_count,
    event.load_date
  ]);

  const [result] = await cdlDbPool.query(query, [values]);
  
  // Return the inserted events for CSV output
  return events.map(event => ({
    font_style_id: event.font_style_id,
    family_id: event.family_id,
    style_name: event.style_name,
    source: event.source,
    subtype: event.subtype,
    event_type: event.event_type,
    profile_id: event.profile_id,
    gcid: event.gcid,
    event_date: event.event_date.toISOString(),
    event_count: event.event_count,
    load_date: event.load_date.toISOString()
  }));
};
