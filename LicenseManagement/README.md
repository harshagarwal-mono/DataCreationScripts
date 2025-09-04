# License Management Data Generation Script

This script generates synthetic license management events data for testing and development purposes. It supports parallel processing and batch operations for efficient data generation.

## Features

- Configurable number of users and events per user
- Parallel processing with RxJS
- Batch processing for database operations
- Input validation with Zod
- Environment-based configuration
- Progress tracking and error handling
- Real-time CSV report generation

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
CDL_DATABASE_HOST=localhost
CDL_DATABASE_PORT=3306
CDL_DATABASE_NAME=your_database_name
CDL_DATABASE_USERNAME=your_username
CDL_DATABASE_PASSWORD=your_password

# Batch Processing Configuration
BATCH_SIZE=1000
PARALLEL_PROCESSING_UNITS=4
```

2. Create an `license-management.json` file with the following structure inside inputs folder:

```json
{
  "gcid": "your_gcid",
  "usersCount": 1,
  "eventsCount": 50,
  "shouldUseSyncAndDownloadEvent": true
}
```

### Input Parameters

- `gcid` (required): The GCID to generate events for
- `usersCount` (optional, default: 1): Number of users to generate events for
- `eventsCount` (optional, default: 50): Number of events to generate per user
- `shouldUseSyncAndDownloadEvent` (optional, default: true): Whether to include sync and download events

## Usage

Run the script:

```bash
npm start
```

The script will:
1. Validate the input and environment configuration
2. Check if the GCID exists in the database
3. Fetch required user profiles and font details
4. Generate and insert events in parallel batches
5. Create CSV report with inserted events
6. Display progress and completion status

## Output

The script generates a CSV report of all inserted events in the `outputs` directory. The report is generated in real-time as events are inserted, ensuring efficient memory usage and immediate feedback.

### Output File
- **File Name**: `license-events.csv`
- **Location**: `/outputs` directory
- **Format**: CSV with headers
- **Generated**: Real-time as events are inserted
- **Fields**:
  - font_style_id
  - family_id
  - source
  - subtype
  - event_type
  - profile_id
  - gcid
  - event_date
  - event_count
  - load_date

## Event Types

The following event types are supported:
- sync
- download
- temporaryActivation
- autoActivation
- permanentActivation

## Event Sources

Events can be generated from the following sources:
- web
- desktop
- extensis

## Limitations

- Maximum total events (usersCount * eventsCount) cannot exceed 10,000
- Events are generated with current date
- Font details must exist in the database for the given GCID

## Error Handling

The script includes comprehensive error handling for:
- Invalid input parameters
- Database connection issues
- Missing or invalid GCID
- Insufficient user profiles or font details
- Database insertion failures

## Contributing

Feel free to submit issues and enhancement requests.
