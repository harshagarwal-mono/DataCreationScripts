# Data Creation Scripts

This repository contains a collection of scripts designed to generate test data for various system components. These scripts help in creating realistic test scenarios and data sets for development and testing purposes.

## Project Structure

- `/config` - Common configuration and environment setup
- `/db` - Database connection pool and shared database utilities
- `/inputs` - Input files for data generation scripts ([see inputs documentation](./inputs/README.md))
- `/LicenseManagement` - License management data generation module ([see documentation](./LicenseManagement/README.md))

## Available Modules

### 1. License Management
- Generates synthetic license events data for testing
- Supports various event types (sync, download, activation)
- Configurable batch processing with parallel execution
- [View License Management documentation](./LicenseManagement/README.md)

## Setup

1. Clone the repository
2. Copy `.env.sample` to `.env` and configure your environment variables
3. Install dependencies:
   ```bash
   npm install
   ```

## Adding New Scripts

The repository is structured to easily accommodate new data creation scripts:
1. Create a new directory for your module
2. Add your module-specific code and documentation
3. Use shared utilities from `/config` and `/db` as needed
4. Place input files in the `/inputs` directory
5. Update this README to include your new module

## Contributing

Feel free to add new data creation scripts or improve existing ones. Make sure to:
- Follow the established project structure
- Include comprehensive documentation
- Update relevant README files
- Maintain consistency with existing modules
