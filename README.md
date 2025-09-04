# Data Creation Scripts

This repository contains a collection of scripts designed to generate test data for various system components. These scripts help in creating realistic test scenarios and data sets for development and testing purposes.

## Project Structure

- `/config` - Common configuration and environment setup
- `/db` - Database connection pool and shared database utilities
- `/inputs` - Input files for data generation scripts ([see inputs documentation](./inputs/README.md))
- `/outputs` - Generated output files and reports ([see outputs documentation](./outputs/README.md))
- `/utils` - Shared utility functions for input/output handling
- `/LicenseManagement` - License management data generation module ([see documentation](./LicenseManagement/README.md))

## Available Modules

### 1. License Management
- Generates synthetic license events data for testing
- Supports various event types (sync, download, activation)
- Configurable batch processing with parallel execution
- Outputs CSV report of generated events
- [View License Management documentation](./LicenseManagement/README.md)

## Setup

1. Clone the repository
2. Copy `.env.sample` to `.env` and configure your environment variables
3. Install dependencies:
   ```bash
   npm install
   ```

## Input/Output Handling

The repository provides standardized utilities for handling inputs and outputs:

### Inputs
- Place input files in the `/inputs` directory
- JSON format for configuration files
- See [inputs documentation](./inputs/README.md) for other information

### Outputs
- Generated files are stored in the `/outputs` directory
- CSV reports for detailed event data
- JSON outputs for structured data
- See [outputs documentation](./outputs/README.md) for other information

## Adding New Scripts

The repository is structured to easily accommodate new data creation scripts:
1. Create a new directory for your module
2. Add your module-specific code and documentation
3. Use shared utilities from `/config`, `/db`, and `/utils`
4. Place input files in the `/inputs` directory
5. Configure outputs to use the `/outputs` directory
6. Update this README to include your new module

## Contributing

Feel free to add new data creation scripts or improve existing ones. Make sure to:
- Follow the established project structure
- Include comprehensive documentation
- Update relevant README files
- Maintain consistency with existing modules
- Use shared utilities for input/output handling
