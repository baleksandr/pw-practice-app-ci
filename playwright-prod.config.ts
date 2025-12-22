import { defineConfig, devices } from '@playwright/test';
import { on } from 'events';
import type { TestOptions } from './test-option';

//  запустити окремий конфіг фаіл в терміналі прописати => npx playwright terst --confif=playwright-prod.config.ts
require('dotenv').config();

export default defineConfig<TestOptions>({

  use: {
    baseURL: 'http://localhost:4201/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
   
  },

  projects: [
    {
      name: 'chromium',
    },
  ],
});
