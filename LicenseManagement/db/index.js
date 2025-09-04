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
  const [rows] = await cdlDbPool.execute(
    'SELECT DISTINCT profileId FROM user WHERE gcid = ? LIMIT ?',
    [gcid, limit]
  );
  return rows.map(row => row.profileId);
};

// Get font details for a given GCID
export const getFontDetails = async (gcid, limit) => {
  const [rows] = await cdlDbPool.execute(
    'SELECT DISTINCT font_style_id, family_id FROM sync_download WHERE gcid = ? LIMIT ?',
    [gcid, limit]
  );
  return rows;
};

// Insert events in batches
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
  return result;
};
