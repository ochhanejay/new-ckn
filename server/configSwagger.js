const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("api.yaml");

const options = {
    customCss: `img {content:url(\'../logo.svg\'); height:auto;} `,
    // customfavIcon: "./public/logo192.png",
    customSiteTitle: "Chai Ke Nashedi",

};

// module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };

module.exports = { swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs) };