// import { defineConfig } from 'cypress';
// export default defineConfig({

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.fixturesPath = 'cypress/fixtures';
      return config;
    },
     watchForFileChanges: false,
    supportFile: 'cypress/support/e2e.js',
    experimentalRunAllSpecs: true,
   

  },


});



