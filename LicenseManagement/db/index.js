import { cdlDbPool } from '../../db/index.js';

// Validate customer exists and GCID is valid
export const validateCustomer = async (gcid) => {
  const [rows] = await cdlDbPool.execute(
    'SELECT COUNT(*) as count FROM user WHERE gcid = ?',
    [gcid]
  );
  return rows[0].count > 0;
};

// Get profile IDs for a given GCID
export const getProfileIds = async (gcid, limit) => {
  const [rows] = await cdlDbPool.query(
    'SELECT DISTINCT profile_id FROM user WHERE gcid = ? LIMIT ' + Number(limit),
    [gcid]
  );
  return rows.map(row => row.profile_id);
};

// Get font details for a given GCID
export const getFontDetails = async (gcid, eventsPerUser) => {
  // First, get the count of available unique styles
  const [countResult] = await cdlDbPool.execute(
    'SELECT COUNT(DISTINCT font_style_id) as uniqueCount FROM sync_download WHERE gcid = ?',
    [gcid]
  );
  const availableUniqueStyles = countResult[0].uniqueCount;

  // Fetch all unique styles
  const [rows] = await cdlDbPool.execute(
    `SELECT DISTINCT sd.font_style_id, sd.family_id, fs.name
     FROM sync_download sd JOIN font_style fs ON sd.font_style_id = fs.font_style_id
     WHERE gcid = ?`,
    [gcid]
  );

  return {
    styles: rows,
    availableUniqueStyles,
    message: availableUniqueStyles < eventsPerUser
      ? `Warning: Only ${availableUniqueStyles} unique styles available for ${eventsPerUser} events per user. Some styles will be reused.`
      : null
  };
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
