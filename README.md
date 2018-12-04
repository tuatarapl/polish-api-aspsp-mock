# polish-api-aspsp-mock
Mock implementation of ASPSP exposing Polish API interface. Used to test TPP integration.

Implemented as [Node.js](https://nodejs.org/en/) server application with [Vue.js](https://vuejs.org/) based interface.

# Functionality
* User management and authentication
* Implementation of XS2A session
    * Exposing Polish API AS methods
    * Internal token and consent management - in memory storage
    * Web UI for PSU authentication and consent approval
    * Option to obtain approval without UI - for use in automated testing
* Implementation of Polish API
    * AIS Methods
    * PIS Methods
    * CAF Methods
* Sample data generation - using [polish-api-generator](https://github.com/tuatarapl/polish-api-generator)
* UI for browsing PSU consents
* Service exposing internal data - for use in automated testing


[Polish API](https://polishapi.org) Specification is licensed under [CC BY 3.0 PL](https://creativecommons.org/licenses/by/3.0/pl/)