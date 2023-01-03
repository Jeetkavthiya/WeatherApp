const express = require('express')
const fs = require('fs');
const requests = require('requests');

const app = express();

const homeFile = fs.readFileSync('home.html', 'utf-8');
//console.log(homeFile);
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
};

app.get('/home', (req, res) => {
    let city = req.query.city;
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3f96c2f3752f7c792bde85bd01809208&units=metric`)
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData[0]);
            const realTimeData = arrData
                .map((val) => replaceVal(homeFile, val))
                .join("");
            res.write(realTimeData)
        })
        .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            console.log('end');
            res.end();
        });
})

app.listen(3000, () => {
    console.log('listening to port no 3000');
})
