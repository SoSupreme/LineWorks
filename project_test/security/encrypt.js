const crypto = require('crypto');     // 암호

module.exports = {
    getEncrypt(data,algorithm,key){
        const cipher = crypto.createCipher(algorithm,key);
        let result = cipher.update(data, 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
        result += cipher.final('base64'); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='

        return result;
    },   
    getDecrypt(data,algorithm,key){
        const decipher = crypto.createDecipher(algorithm,key);
        let result2 = decipher.update(data, 'base64', 'utf8'); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서)
        result2 += decipher.final('utf8'); // 암호화할문장 (여기도 base64대신 utf8)
        
        return result2;
    },
}