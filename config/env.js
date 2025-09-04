import { config } from 'dotenv';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file at root level
config({ path: join(__dirname, '../.env') });

// Environment variables validation schema
const envSchema = z.object({
  // Database Configuration
  CDL_DATABASE_HOST: z.string(),
  CDL_DATABASE_PORT: z.string().transform(Number),
  CDL_DATABASE_NAME: z.string(),
  CDL_DATABASE_USERNAME: z.string(),
  CDL_DATABASE_PASSWORD: z.string(),

  // Batch Processing Configuration
  BATCH_SIZE: z.string().transform(Number).default('1000'),
  PARALLEL_PROCESSING_UNITS: z.string().transform(Number).default('4'),
});

// Validate and transform environment variables
const env = envSchema.parse(process.env);

export default env;
