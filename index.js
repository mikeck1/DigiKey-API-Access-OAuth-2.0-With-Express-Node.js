//
//
// LOG INTO DIGIKEY AND GET PRODUCT DESCRIPTIONS
// This code is intended to search digikey for products which match a product ID to be searched for.
//
//

const express = require('express');

const app = express();

//Credentials
const clientId = 'uB5mEu2s2Bl2EvBwruSXnzG1Gr5hYT0T';
const clientSecret = '6ZTYDgdHU3OFhFUt';
const redirectUri = 'http://localhost:8080/oauthcallback';
//To Login to DigiKey
app.get('/', (req, res) => {
    res.redirect(`https://sandbox-api.digikey.com/v1/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
});


// For Callback
const axios = require('axios');
let token = null;

app.get('/oauthcallback', (req, res) => {
    var qs = require('qs');
    var data = qs.stringify({
        'client_id': 'uB5mEu2s2Bl2EvBwruSXnzG1Gr5hYT0T',
        'client_secret': '6ZTYDgdHU3OFhFUt',
        'redirect_uri': 'http://localhost:8080/oauthcallback',
        'code': req.query.code,
        'grant_type': 'authorization_code'
    });

    // Get Access Token
    var config = {
        method: 'post',
        url: 'https://sandbox-api.digikey.com/v1/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'bm_sz=8FC72399616014F9F4D37DB28B2423EF~YAAQxPs/F2G4CCVzAQAAoMMPMAjwiUqva0kbSQzDc+pv1EAcCpN1JnPvKICTglDqTpNzaWhCy0TC5eIiqL9yZX004tJfKT4LLaeQTKhXnFYb2hL3eZkQnB1h8C9QJETdHrBt3wch/ka45ZAkQnpHMkPuQ4cZSjWrxYtqdDUt3bFp4hZwssyU+EHvgFB1Z/3Y0A==; _abck=21FE5F7E06BB16696E2B91B012396F25~-1~YAAQxPs/F2K4CCVzAQAAoMMPMAQBaKRfNHz0l7vHNLOHuBaCJi+XfbB0XulCGgUFiE1JomH7t9RlFRsIyvtvBZt0Izq/0wR+NE9DmMOs0PRCN399vj0xCb2aga2S2pQZaTo7VKlR4NlDKeVZ8piLeqfblaSoejjky27aZ6BDCcoCRfLfw4bR3JlOqI7EzgcuXldOc1PNwdYco7frzJoIrQtd+9CY0Mi+arrHr99HVDFEiotJMjF4tD8BK/EYh/EEx+WJ9B2dPjsrbeB1HLIOYhdt8TDLNS8FEi9G/si/w3x3xLatm9PoybhsKQ==~-1~-1~-1; TS01841c41=01460246b6029dc9fadc19d8580a2caaab16943092e2bd68f4d7208ee30eac4c11f87a46e98b6b5557fb2ea262bd1fe12a11616e23'
        },
        data: data
    };
    var auth_token = null;
    axios(config)
        .then(function (response) { // Valid Request
            auth_token = response.data['access_token']; // save token for  future
            console.log(auth_token); // show token works, print it

            // Make Authorized API Requests
            var array1 = ['600L0R9AT200T']; // temp dummy data
            (auth_token != null) ? ( //if we have a token
                array1.forEach(element => {
                    console.log(element)
                    data = qs.stringify({

                    });
                    // Make authorized GET requests for each product
                    var config = {
                        method: 'get',
                        url: `https://sandbox-api.digikey.com/Search/v3/Products/${element}`,
                        headers: {
                            'X-DIGIKEY-Client-Id': 'uB5mEu2s2Bl2EvBwruSXnzG1Gr5hYT0T',
                            'Authorization': 'Bearer ' + auth_token
                        },
                        data: data
                    };

                    axios(config)
                        .then(function (response) {

                            // Demonstrate how to read DigiKey
                            console.log(JSON.stringify(response.data['Parameters'][2]['ValueId']));
                            console.log(response.data['RoHSStatus'])
                            console.log(JSON.stringify(response.data['Parameters'][3]['Value']));
                            console.log(JSON.stringify(response.data['Parameters'][4]['Value']));
                            console.log(JSON.stringify(response.data['Parameters'][7]['Value']));
                            console.log(response.data['PrimaryDatasheet'])
                            console.log(response.data['DetailedDescription'])
                            console.log(response.data['ProductDescription'])
                            console.log(response.data['Manufacturer']['Value'])

                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
            ) : (null);
        })

        .catch(function (error) { // Invalid Request/ Error
            console.log(error);
        });


});

// Starting Server
app.listen(8080);
console.log('App listening on port 8080');