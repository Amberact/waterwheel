var ursa = require('ursa')
var fs = require('fs')
var encoding = require('encoding');

class endecrypt{

    constructor(){
        this.path = ""

        this.server_public=fs.readFileSync(this.path+'public.pub').toString()

        this.server_private=fs.readFileSync(this.path+'private.pem').toString()

        this.client_public=""

        this.client_private=""

        this.server = {
            pem :ursa.createPrivateKey(this.server_private),
            pub :ursa.createPublicKey(this.server_public)
        }

        this.serverPublic = this.server.pub;

        this.serverPrivate = this.server.pem;

        this.clientPublic = ""

        this.clientPrivate = ""

        this.serverModulusBit = 512;

        this.serverMaxBit = this.serverModulusBit/8;

        this.serverRealBit = this.serverMaxBit - 11;

        this.clientModulusBit = 512;

        this.clientMaxBit = this.clientModulusBit/8;

        this.clientRealBit = this.clientMaxBit - 11;

        this.padding = ursa.RSA_PKCS1_PADDING;
    }

    bytes(text, coding) {
        if (typeof text === 'undefined') {
            throw new Error("must have a arg.");
        }

        coding = coding || 'utf8';
        return Buffer.byteLength(text.toString(), coding);
    }

    encrypt(plain, publicKey, realBit, padding){
        var start1 = 0;
        var end1   = realBit;
        var result1 = '';
        var originBuff = new Buffer(plain);
        var originByte = this.bytes(plain, 'utf8');
        while(start1 < originByte){
            var originTmp  = originBuff.slice(start1, end1);
            result1 += publicKey.encrypt(originTmp, 'binary', 'binary', padding);
            start1 += realBit;
            end1 += realBit;
        }

        var encrypted =  encoding.convert(result1, 'binary', 'base64');

        return encrypted.toString();
    }

    decrypt(cipher, privateKey, maxBit, padding){
            var start2 = 0;
            var end2   = maxBit;
            var result2 = '';
            var cipherBuff = encoding.convert(cipher, 'base64', 'binary');
            var cipherByte = this.bytes(cipher, 'base64');
            while(start2 < cipherByte){
                var cipherTmp  = cipherBuff.slice(start2, end2);
                result2 += privateKey.decrypt(cipherTmp, 'binary', 'binary', padding);
                start2 += maxBit;
                end2 += maxBit;
            }

            var decrypted =  encoding.convert(result2, 'binary', 'utf8');
            return decrypted.toString();
    }

    initClient(){
        this.clientPublic=ursa.createPublicKey(this.client_public)
    }

    setClientPublic(data){
        if(this.client_public===""){
            this.client_public=data
            this.initClient()
            return true
        }
        return false
    }

    clientEncrypt(plain){
        plain = plain || "";
        return this.encrypt(plain, this.clientPublic, this.clientRealBit, this.padding);
    };

    clientDecrypt(cipher){
        cipher = cipher || "";
        return this.decrypt(cipher, this.clientPublic, this.clientMaxBit, this.padding);
    };

    serverEncrypt(plain){
        plain = plain || "";
        return this.encrypt(plain, this.serverPublic, this.serverRealBit, this.padding);
    };

    serverDecrypt(cipher){
        cipher = cipher || "";
        return this.decrypt(cipher, this.serverPrivate, this.serverMaxBit, this.padding);
    };

}

module.exports= new endecrypt()
