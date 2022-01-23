const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { PORT, DIGITAL_GROWTH_CHART_SERVER_API_KEY } = require('./config');
// NB The .env file should use these keys and should not be committed to git
// the .env.example file contains example values to remind on key names

/*
App declaration
*/
const app = express();
app.use(express.json());
app.use(cors());
/*
Variables and API call promise
*/
const digitalGrowthChartsServerBaseURL = "https://api.rcpch.ac.uk/growth";

const corsOptions = {
    origin: 'http://c015-217-42-180-67.ngrok.io',
  };

const sendPostRequest = async(url, postData) => {
        const headers = DIGITAL_GROWTH_CHART_SERVER_API_KEY
        ? {
            'Content-Type': 'application/json',
            'Subscription-Key': DIGITAL_GROWTH_CHART_SERVER_API_KEY,
        }
        : { 'Content-Type': 'application/json' };
        const dgcAPIResponse = await axios({
            url: digitalGrowthChartsServerBaseURL + url,
            data: postData,
            method: 'POST',
            headers,
        });
        return dgcAPIResponse;
}

/*
Routes
*/
app.get('/rcpchgrowth', cors(corsOptions), (req,res)=>{
    res.send(`
        <html><div style="text-align: center; padding: 70px;">
        <h1>Node server for RCPCH digital growth charts Demo client</h1>
        <h2>Functioning as expected</h2>
        <h2>For more information please see the <a href="https://growth.rcpch.ac.uk">documentation</a></h2>
        </div>
        </html>
    `);
});

app.post('/rcpchgrowth', cors(corsOptions), (req, res) => {

    const mode = req.body.mode; // one of calculation, utilities 
    const reference = req.body.reference; // one of uk-who, turner or trisomy-21
    const formdata = req.body.formdata;
    const url = `/${reference}/${mode}`

    sendPostRequest(url, formdata).then(apiResponse => {
        res.send(apiResponse.data);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500)
    });

});


// Listener
app.listen(PORT, () => {
    const RCPCH = "RCPCH Digital Growth Charts"
    const portText = `Accepting requests on port ${PORT}`;
    console.log(`\x1b[36m${RCPCH}`, `\x1b[37mproxy server`, '\n',`\x1b[32m${portText}\x1b[30m`);
});
