import { defineConfig } from 'cypress';
export default defineConfig({
  experimentalRunAllSpecs: true,
  watchForFileChanges: true,
  e2e: {


    setupNodeEvents(on, config) {
      config.env.fixturesPath = 'cypress/fixtures';
      return config;
    },
        supportFile: 'cypress/support/e2e.js',

  },

});



