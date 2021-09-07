const express = require('express');
const bodyParser = require('body-parser')
const FBD = require('./lib/fpds');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000
const crypt = require('./encryption/encrypt-decrypt')
const config = require('config');
const cache = {
    licenseKey: 'encryptedLicense'
};
app.use(cors()); // <---- use cors middleware



app.get('/SeventhSenseFPDS', (req, res) => {
    var contractID = req.query.contractID;
    FBD.getAwardsByContractID(contractID, function (error, awards) {
        if (!error && awards.length > 0) {
            res.json(awards)
        } else {
            console.log(error);
        }
    });
});

app.get('/generateKeys', function(req, res, next) {
    res.json(crypt.generateKeys());
});

app.get('/getConfig', function(req, res, next) {
    res.json(crypt.getConfig());
});

app.get('/getEncryptedLicense', function(req, res, next) {
    res.json(crypt.getEncryptedLicense());
});

app.get('/getDecryptedLicense', function(req, res, next) {
    res.json(crypt.getDecryptedLicense());
});

app.get('/getLicense', function(req, res, next) {
    res.json({license: config[cache.licenseKey]});
});

app.get('/setLicenseKey/:licenseKey', function(req, res, next) {
    cache.licenseKey = req.params.licenseKey;
    res.json(cache);
});




app.use(bodyParser.json)
app.listen(port, () => {
    console.log(`FPDS server is running on:${port}`)
})
