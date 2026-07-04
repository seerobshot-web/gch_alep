import { defineConfig } from 'vitest/config';
import path from 'path';

// Test-only module aliases:
// - 'server-only' throws outside a React server environment; Vitest is one,
//   so it is stubbed out.
// - '@gch/*' subpaths point at TypeScript source so cross-package imports
//   run through Vite (native require of built dist would bypass the
//   'server-only' stub above).
const repoRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  resolve: {
    alias: [
      { find: 'server-only', replacement: path.join(repoRoot, 'test-utils/server-only-stub.js') },
      { find: '@gch/config/env', replacement: path.join(repoRoot, 'packages/config/src/env.ts') },
      { find: '@gch/config/rate-limit', replacement: path.join(repoRoot, 'packages/config/src/rate-limit.ts') },
      { find: '@gch/config', replacement: path.join(repoRoot, 'packages/config/src/index.ts') },
      { find: '@gch/provisioning/kv-factory', replacement: path.join(repoRoot, 'packages/provisioning/src/kv-factory.ts') },
      { find: '@gch/provisioning/kv', replacement: path.join(repoRoot, 'packages/provisioning/src/kv.ts') },
      { find: '@gch/provisioning', replacement: path.join(repoRoot, 'packages/provisioning/src/index.ts') },
      { find: '@gch/fossbilling-client/schemas', replacement: path.join(repoRoot, 'packages/fossbilling-client/src/schemas.ts') },
      { find: '@gch/fossbilling-client', replacement: path.join(repoRoot, 'packages/fossbilling-client/src/index.ts') }
    ]
  }
});
