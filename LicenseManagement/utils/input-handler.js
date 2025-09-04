import { readJsonInput } from '../../utils/index.js';
import { validateInput } from '../schemas/input.js';
import { validateCustomer } from '../db/index.js';

export const readAndValidateInput = async () => {
  try {
    // Read input file
    const inputData = await readJsonInput('license-management.json');

    // Validate input schema
    const { data, error } = validateInput(inputData);
    if (error) {
      throw new Error(`Invalid input: ${JSON.stringify(error, null, 2)}`);
    }

    // Validate GCID exists in database
    const isValidUser = await validateCustomer(data.gcid);
    if (!isValidUser) {
      throw new Error(`Invalid GCID: ${data.gcid} not found in database`);
    }

    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Input file license-management.json not found in inputs directory');
    }
    throw error;
  }
};
