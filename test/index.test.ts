import assert from 'node:assert/strict';
import { suite, test } from 'node:test';
import { createFixture } from 'fs-fixture';

import { canLoad, load } from '../src/index.js';

suite('canLoad', () => {
  test('should return true for package.json file', async () => {
    const result = await canLoad('/some/path/package.json');
    assert.strictEqual(result, true);
  });

  test('should return false for non-package.json file', async () => {
    const result = await canLoad('/some/path/index.js');
    assert.strictEqual(result, false);
  });
});

suite('load', () => {
  const createPackageJson = (overrides = {}) => {
    const defaultPackageJson = {
      name: 'test',
      version: '1.0.0',
    };
    return JSON.stringify({ ...defaultPackageJson, ...overrides });
  };

  test('should return dependencies and devDependencies', async () => {
    const fixture = await createFixture({
      'package.json': createPackageJson({
        dependencies: { lodash: '^4.17.21' },
        devDependencies: { jest: '^29.0.0' },
      }),
    });
    const deps = await load(fixture.getPath('package.json'));
    assert.ok(deps.includes('lodash'));
    assert.ok(deps.includes('jest'));
  });

  test('should return empty array if no dependencies', async () => {
    const fixture = await createFixture({
      'package.json': createPackageJson(),
    });
    const deps = await load(fixture.getPath('package.json'));
    assert.deepEqual(deps, []);
  });
});
