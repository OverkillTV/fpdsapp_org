'use strict';
//Khandokar M. 10-29-2020
var request = require('request');
var xml2js = require('xml2js');

var FEED = {
    baseUrl: 'https://www.fpds.gov/ezsearch/FEEDS/ATOM',
    feedQuery: '?FEEDNAME=PUBLIC&templateName=1.5.2&q=',
    queryParams: {
        VENDOR_NAME: 'VENDOR_NAME',
        CONTRACT_ID: 'PIID',
    },

    getAwards: function (params, callback) {

        var url = this.baseUrl + this.feedQuery + params;
        var options = {
            'url': url,
            'json': true,
            'start': 0
        };
        var allEntries = [];
        var self = this;
        var entriesCollectorFn = function(error, entries) {
            if (error) {
                return callback(error);
            }
            allEntries = allEntries.concat(entries);
            if (entries && entries.length < 10) {
                return callback(null, allEntries);
            } else {
                options.start = allEntries.length;
                self.makeApiCall(options, entriesCollectorFn);
            }
        };
        this.makeApiCall(options, entriesCollectorFn);
    },

    getAwardsByVendor: function (vendor, callback) {
        return this.getAwards(this.queryParams.VENDOR_NAME + ':"' + vendor + '"',
            callback);
    },

    getAwardsByContractID: function (contractID, callback) {
        this.getAwards(this.queryParams.CONTRACT_ID + ':"' + contractID + '"', callback);
    },
	getObject(parentObj, xmlTagName) {
		return parentObj['ns1:'+xmlTagName];
	},
    makeApiCall: function (options, callback, type) {
        // console.log(options)
        /* istanbul ignore next */
        callback = callback || function () {};
        request.get(options.url+'&start='+options.start, function (err, resp, body) {
            if (err) {
                throw callback(err);
            }
            if (resp.statusCode !== 200) {
                throw callback('Request failed with code ' + resp.statusCode);
            }
            var parser = new xml2js.Parser({
                explicitArray: false,
                stripPrefix: true,
            });
            // var total;
            var entries = [];
            parser.parseString(body, function (err, result) {
                //console.log(body)
                /* total = result.feed.entry.length;
                result.feed.link.forEach(function(link) {
                if(link.$.rel === 'last') {
                total = parseInt(link.$.href.split('start=')[1], 10);
                }
                });*/

                var temArray = []
                if (!Array.isArray(result.feed.entry)) {
                    temArray.push(result.feed.entry)
                    result.feed.entry = temArray
                }
                // callback(undefined, result.feed.entry);
                result.feed.entry.forEach(function (entry) {
                    var award = entry.content['ns1:award'];
					// var toReturn = {};
                    // if (award) {
                    //     toReturn.NAICSCode = award['ns1:productOrServiceInformation']['ns1:principalNAICSCode']._;
					// 	toReturn.ContractType = award['ns1:contractData']['ns1:typeOfContractPricing'].$.description;
					// 	toReturn.Description = award['ns1:contractData']['ns1:descriptionOfContractRequirement'];
					// 	toReturn.DUNSNumber = award['ns1:vendor']['ns1:vendorSiteDetails']['ns1:vendorDUNSInformation']['ns1:DUNSNumber'];
					// 	toReturn.PSC = award['ns1:productOrServiceInformation']['ns1:productOrServiceCode']._;
					// 	toReturn.ContractingOffice = award['ns1:purchaserInformation']['ns1:contractingOfficeAgencyID'].$.name;
					// 	toReturn.LocationOfWork = {
					// 		City: award['ns1:placeOfPerformance']['ns1:placeOfPerformanceZIPCode'].$.city,
					// 		State: award['ns1:placeOfPerformance']['ns1:principalPlaceOfPerformance']['ns1:stateCode'].$.name,
					// 		ZipCode: award['ns1:placeOfPerformance']['ns1:placeOfPerformanceZIPCode']._
					// 	}
					// 	toReturn.AwardDate = award['ns1:relevantContractDates']['ns1:signedDate'];
					// 	toReturn.EffectiveDate = award['ns1:relevantContractDates']['ns1:effectiveDate'];
					// 	toReturn.CompletionDate = award['ns1:relevantContractDates']['ns1:currentCompletionDate'];
					// 	toReturn.UltimateCompletionDate = award['ns1:relevantContractDates']['ns1:ultimateCompletionDate'];
					// 	toReturn.CompetitionType = award['ns1:competition']['ns1:extentCompeted'].$.description;
                    // }
                    entries.push(award);
                });

                callback(undefined, entries);
            });
        });
    },
};

module.exports = FEED;
