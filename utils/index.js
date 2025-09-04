import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.resolve(__dirname, '../');
const inputsDir = path.resolve(rootDir, 'inputs');
const outputsDir = path.resolve(rootDir, 'outputs');

export const readJsonInput = async (inputFileName) => {
    const inputFilePath = path.resolve(inputsDir, inputFileName);
    console.log('Reading input file:', inputFilePath);
    const fileContent = await fs.readFile(inputFilePath, 'utf-8');
    return JSON.parse(fileContent);
};

export const writeJsonOutput = async (outputFileName, data) => {
    const outputFilePath = path.resolve(outputsDir, outputFileName);
    await fs.writeFile(outputFilePath, JSON.stringify(data, null, 2));
};

const ensureFileDeleted = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted existing file: ${filePath}`);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

export const writeCSVHeader = async (outputFileName, headers) => {
    const outputFilePath = path.resolve(outputsDir, outputFileName);
    await ensureFileDeleted(outputFilePath);
    const headerContent = headers.join(',') + '\n';
    await fs.writeFile(outputFilePath, headerContent);
};

export const appendCSVRows = async (outputFileName, data, columnOrder) => {
    if (!columnOrder || !Array.isArray(columnOrder)) {
        throw new Error('Column order must be provided as an array');
    }

    const outputFilePath = path.resolve(outputsDir, outputFileName);
    const csvContent = data.map(row => {
        // Ensure data is in the same order as headers
        const orderedValues = columnOrder.map(column => {
            const value = row[column];
            // Handle undefined/null values
            return value === undefined || value === null ? '' : value;
        });
        return orderedValues.join(',');
    }).join('\n') + '\n';
    
    await fs.appendFile(outputFilePath, csvContent);
};
