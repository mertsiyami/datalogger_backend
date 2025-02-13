require('dotenv').config();


const checkTemperature = (temp, maxTemp, minTemp) => {
    if(maxTemp == null && minTemp == null)
    {
        return true // true means no problem with checking
    }

    if(temp < maxTemp && temp > minTemp)
    {
        return true
    }

    return false

};

const checkHumidity = (hum, maxHum, minHum) => {

    if(maxHum == null && minHum == null)
    {
        return true // true means no problem with checking
    }
    
    if(hum < maxHum && hum > minHum)
    {
        return true
    }
    
    return false

};


module.exports = { checkTemperature, checkHumidity };
