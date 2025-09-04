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

2. Create a `license-management.json` file with the following structure inside inputs folder:

```json
{
  "gcid": "your_gcid",
  // User selection (either profileIds or usersCount)
  "profileIds": ["profile1", "profile2"],  // Optional: specific profile IDs to use
  "usersCount": 1,                         // Optional: number of random users to select
  // Event/Style selection (either styleIds or eventsCount)
  "styleIds": ["style1", "style2"],        // Optional: specific style IDs to use
  "eventsCount": 50,                       // Optional: number of random styles to select
  "eventsUsageMap": {                      // Optional: control which events to generate
    "sync": true,
    "download": true,
    "temporaryActivation": true,
    "autoActivation": true,
    "permanentActivation": true
  }
}
```

### Input Parameters

- `gcid` (required): The GCID to generate events for

User Selection (one of the following is required):
- `profileIds`: Array of specific profile IDs to use (takes priority if both are provided)
- `usersCount`: Number of random users to select

Style Selection (one of the following is required):
- `styleIds`: Array of specific font style IDs to use (takes priority if both are provided)
- `eventsCount`: Number of random styles to select

Event Type Control:
- `eventsUsageMap` (optional): Object controlling which event types to generate
  - Keys: Event type names (sync, download, temporaryActivation, etc.)
  - Values: Boolean indicating whether to include that event type
  - Default: All event types enabled (true)
  - Example: Set `{"sync": false, "download": false}` to exclude sync and download events

### Priority and Behavior

1. User Selection:
   - If `profileIds` is provided:
     - Those specific users will be used
     - `usersCount` will be automatically set to the number of provided profileIds
     - Any manually provided `usersCount` will be overridden
   - If only `usersCount` is provided:
     - Random users will be selected up to the specified count
   - `profileIds` takes priority if both are provided

2. Style Selection:
   - If `styleIds` is provided:
     - Those specific styles will be used
     - `eventsCount` will be automatically set to the number of provided styleIds
     - Any manually provided `eventsCount` will be overridden
   - If only `eventsCount` is provided:
     - Random styles will be selected up to the specified count
   - `styleIds` takes priority if both are provided

This flexibility allows for both targeted testing with specific IDs and random generation with counts.

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
  - style_name
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
