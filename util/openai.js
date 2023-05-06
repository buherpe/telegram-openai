require('dotenv').config();

const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({apiKey: process.env.OPEN_AI_TOKEN});
const openai = new OpenAIApi(configuration);

exports.openai = openai;
