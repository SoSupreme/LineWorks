var consumerKey = "LeFEtDXTHQBuN0fXaFcY";
var algorithm = 'aes-256-cbc';
var key = '열쇠'

module.exports = {

    getConsumerKey(){
        return consumerKey;
    },   
    getAlgorithm(){
        return algorithm;
    },
    getKey(){
        return key;
    }
}