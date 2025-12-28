const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Purchase Service API',
        description: 'API for Purchase Service',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './src/generated/swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger file generated successfully');
});
