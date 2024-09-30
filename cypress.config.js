const { defineConfig } = require("cypress");
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  env:{
    baseUrl:"http://jsonplaceholder.typicode.com"
  },
  e2e: {
    setupNodeEvents(on, config) {
    on('file:preprocessor',cucumber())
    },
    specPattern: 'cypress/e2e/*.feature'
  },
  "reporter":"mochawesome",
  "videosFolder":"cypress/reports/mochawesome/videos",
  "screenshotsFolder":"cypress/reports/mochawesome/screenshots",  
  "reporterOptions":{
    "reportDir": "cypress/reports/mochawesome/logs",
    "overwrite":false,
    "html":false,
    "json":true
  }
});
