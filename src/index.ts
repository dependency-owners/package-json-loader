import type { DependencyLoader } from 'dependency-owners/loader';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Check if the loader can handle the specified file.
 * @param {string} filePath The path of the file to check.
 * @returns {Promise<boolean>} True if the file can be loaded, false otherwise.
 */
export const canLoad = async function (filePath: string): Promise<boolean> {
  return path.basename(filePath) === 'package.json';
} satisfies DependencyLoader['canLoad'];

/**
 * Loads the package.json file and returns its dependencies.
 * @param {string} filePath The path of the package.json file to load.
 * @returns {Promise<string[]>} An array of dependencies.
 */
export const load = async function (filePath: string): Promise<string[]> {
  const pkg = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
} satisfies DependencyLoader['load'];
