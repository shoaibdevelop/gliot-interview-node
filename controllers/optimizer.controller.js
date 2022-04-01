var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var User = mongoose.model('User');
var config = require('../config');
const axios = require('axios').default;
var util = require('../Util/util.message.js');
const { sqrt, variance, mean, matrix, transpose, multiply } = require('mathjs')
var cov = require( 'compute-covariance' );
var PortfolioAllocation = require('portfolio-allocation');

const rf = 1.255;

exports.maxSharpe = async function (req, res, next) {
    let symbols = req.body.symbols;
    let adjustedPrices = [];
    let simpleReturns = [];
    let annualVariances = [];
    let averageReturns = [];
    let annualAverageReturns = [];

    for (const symbol of symbols) {
        adjustedPrices.push(await getAdjustedPrices(symbol));
    };

    for (const adjustedPrice of adjustedPrices) { 
        var simpleReturn = getSimpleReturns(adjustedPrice['Time Series (Daily)']);
        simpleReturns.push(simpleReturn);

        var weeklyAvg = mean(getSimpleReturns(adjustedPrice['Time Series (Daily)']));
        var weeklyVar = variance(getSimpleReturns(adjustedPrice['Time Series (Daily)']));
        
        averageReturns.push(weeklyAvg);
        annualAverageReturns.push(weeklyAvg * 12);
        annualVariances.push(weeklyVar * 12);
    }

    let covarMatrix = [];
    for (let i=0; i < simpleReturns.length; i ++) {
        var covarRow = [];

        for (let j=0; j < simpleReturns.length; j++) {
            var x = simpleReturns[i];
            var y = simpleReturns[j];
            var covariance = cov(simpleReturns[i], simpleReturns[j]);
            covarRow.push(mean(flatten(covariance)) * 12);
        }

        covarMatrix.push(covarRow);
    }

    // Maximum Retun Optimizer
    var ercWeights = PortfolioAllocation.equalRiskContributionWeights(covarMatrix);
    wTranspose = transpose(matrix(ercWeights));
    let ER =  multiply(wTranspose,matrix(annualAverageReturns))* 10;
    let sdArr =  multiply(wTranspose,matrix(covarMatrix));
    let SD = (sqrt(multiply(sdArr,wTranspose)))*100;
    let sharpeRatio = (ER-rf) / SD;

    let weights = []
    for (let i=0 ; i< ercWeights.length; i++) {
        weights.push({
            "percentage": ercWeights[i]*100,
            "symbol": symbols[i],
        })
    }

    let maxOptimizer = {
        "expected_annual_return": ER,
        "weights": weights,
        "sharpeRatio": sharpeRatio,
    };

    //// Minimum Return Optimizer
    var maxWeightMinOpt = [];
    var minWeightMinOpt = [];

    var opt = { }

    if (symbols.length > 3) {
        for (const symbol of symbols) {
            maxWeightMinOpt.push(0.45);
            minWeightMinOpt.push(0.05);
        };

        opt = {
            "constraints": {
                "maxWeights": maxWeightMinOpt,
                "minWeights": minWeightMinOpt,
            }
        }
    }
    

    var ercWeightsMin = PortfolioAllocation.mostDiversifiedWeights(covarMatrix,opt);
    wTransposeMin = transpose(matrix(ercWeightsMin));
    let ERmin =  multiply(wTransposeMin,matrix(annualAverageReturns)) * 10;
    let sdArrMin =  multiply(wTransposeMin,matrix(covarMatrix));
    let SDmin = (sqrt(multiply(sdArrMin,wTransposeMin)))*100;
    let sharpeRatioMin = (ERmin-rf) / SDmin;

    let weightsMin = []
    for (let i=0 ; i< ercWeightsMin.length; i++) {
        weightsMin.push({
            "percentage": ercWeightsMin[i]*100,
            "symbol": symbols[i],
        })
    }

    let minOptimizer = {
        "expected_annual_return": ERmin,
        "weights": weightsMin,
        "sharpeRatio": sharpeRatioMin,
    };

    if (minOptimizer.expected_annual_return > maxOptimizer.expected_annual_return) {
        res.json(util.success({
            "maxOptimized": minOptimizer,
            "minOptimized": maxOptimizer
        }));
    } else {
        res.json(util.success({
            "maxOptimized":maxOptimizer,
            "minOptimized": minOptimizer
        }));
    }
};

var getAdjustedPrices = async function (symbol) {
    const resp = await axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ symbol +'&apikey=T8E1139XWHK9MWH5');
   return resp.data;
}

var getSimpleReturns = function(adjustedPrices) {
    let simpleReturns = [];
    let prevValue;
    for (const [key, value] of Object.entries(adjustedPrices)) {
        if (!prevValue) {
            prevValue = value['5. adjusted close'];
            continue;
        }
        var curValue = value['5. adjusted close'];
        simpleReturns.push( (prevValue - curValue) / curValue );
    }

    return simpleReturns;
}

var flatten = function (array){
    var flat = [];
    for (var i = 0, l = array.length; i < l; i++){
        var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
        if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]); }
    }
    return flat;
}