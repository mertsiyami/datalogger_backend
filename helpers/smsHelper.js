const axios = require('axios');
const url = require('url');
require('dotenv').config();

const fixieUrl = url.parse(process.env.FIXIE_URL);
const fixieAuth = fixieUrl.auth.split(':');


const sendWarningSMS = (temperature, humidity, phoneNumber) => {

    const message = `Measured values out of range! \nTemperature: ${temperature} Degree Celcius, \nHumidity: %${humidity} `

    axios.post(process.env.NETGSM_SMS_URL,
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

const sendVoiceMessage = (temperature, humidity, phoneNumber, username, deviceName) => {

  const message = `${username}, ${deviceName} cihazınızın ölçtüğü değerler, Sıcaklık ${temperature} derece, nem yüzde ${humidity} `

  axios.post(process.env.NETGSM_VOICE_URL,
    {
      "header":{
        "username": process.env.NETGSM_USERNAME,
        "password": process.env.NETGSM_PASSWORD,
        "key":"0"
      },
      "body":{
        "scenario":{
          "series":[
              {
                "seri":"1",
                "text": message
              }
          ],
          "numbers":[
              {
                "no": phoneNumber
              }
          ]
        }
      }
    }, 
    {
    proxy: {
      protocol: 'http',
      host: fixieUrl.hostname,
      port: fixieUrl.port,
      auth: { username: fixieAuth[0], password: fixieAuth[1] }
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response.status, response.data);
  }).catch(error => {
    console.error(error);
  });

}
module.exports = { sendWarningSMS, sendVoiceMessage };