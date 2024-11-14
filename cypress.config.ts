// import { defineConfig } from "cypress";

// export default defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });



const { defineConfig } = require('cypress');
const { devServer } = require('@cypress/vite-dev-server');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
  component: {
    devServer(cypressConfig) {
      return devServer({
        ...cypressConfig,
        framework: 'react',
        viteConfig: require('./vite.config.js'),
      });
    },
  },
});

