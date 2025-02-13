const axios = require('axios');
const url = require('url');
require('dotenv').config();

const fixieUrl = url.parse(process.env.FIXIE_URL);
const fixieAuth = fixieUrl.auth.split(':');


const sendWarningSMS = (temperature, humidity, phoneNumber) => {

    const message = `Measured values out of range! \n Temperature: ${temperature}, Humidity: ${humidity} `

    axios.post(process.env.NETGSM_URL,
      {
        "messages": [{"no": phoneNumber, "msg": message}],
        "msgheader": process.env.NETGSM_MSGHEADER,
        "encodeing": "TR"
      }, 
      {
      proxy: {
        protocol: 'http',
        host: fixieUrl.hostname,
        port: fixieUrl.port,
        auth: { username: fixieAuth[0], password: fixieAuth[1] }
      },
      auth: {
        username: process.env.NETGSM_USERNAME,
        password: process.env.NETGSM_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response.status, response.data);
    }).catch(error => {
      console.error(error);
    });

};

module.exports = { sendWarningSMS };