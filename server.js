const express = require('express');
const axios = require('axios');

const port = 8080;

const app = express();

const RATES_URL = 'https://api.exchangeratesapi.io/latest';

function get_rates(base, currency) {
    base = remove_whitespace(base);
    currency = remove_whitespace(currency);

    let url = RATES_URL+'?base='+base+'&symbols='+currency;
    return axios.get(url);
}

function remove_whitespace(str) {
    return str.split(',').map(x => x.trim()).join(',').toUpperCase();
}

app.get('/api/rates', function(req, res, next) {
    let base = req.query.base;
    let currency = req.query.currency;

    if (!base || !currency) {
        res.status(400).json({error: "Pass base and currency params"});
    }else{
        get_rates(base, currency)
            .then(resp => {
                res.status(200).json({results: resp.data});
            })
            .catch(err => {
                next(err);
            })
        
    }
})

app.use(function(err, req, res, next){
    if (err.response) {
        res.status(err.response.status).json(err.response.data)
      } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({error: "Server error!"});
      }
})
//TO-DO:
//1. Convert query param values to uppercase
//2. Remove whitespaces in currency query param


app.listen(port, function() {
    console.log('Server is listening on port 8080')
})