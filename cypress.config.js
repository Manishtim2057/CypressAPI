import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile :'',
    experimentalRunAllSpecs: true,
watchForFileChanges: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
