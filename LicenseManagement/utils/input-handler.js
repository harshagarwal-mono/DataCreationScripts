import fs from 'fs/promises';
import path from 'path';
import env from '../../config/env.js';
import { validateInput } from '../schemas/input.js';
import { validateCustomer } from '../db/index.js';

const __dirname = path.dirname(path.resolve());
const rootDir = path.resolve(__dirname, '../../');
const inputsDir = path.resolve(rootDir, 'inputs');

export const readAndValidateInput = async () => {
  const inputFilePath = path.resolve(inputsDir, 'license-management.json');
  try {
    // Read input file 
    const fileContent = await fs.readFile(inputFilePath, 'utf-8');
    const inputData = JSON.parse(fileContent);

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
      throw new Error(`Input file not found at ${inputFilePath}`);
    }
    throw error;
  }
};
