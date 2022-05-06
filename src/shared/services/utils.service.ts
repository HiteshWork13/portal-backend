import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as shortid from 'shortid';
import _ from 'lodash';
import { JwtService } from './jwt.service';
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { level, logger } from 'src/config';

@Injectable()
export class UtilsService {

    algorithm = "aes-256-cbc";
    enc_key = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";

    // ================================================
    // To generate new IV
    // ================================================
    // const initiate_vector = crypto.randomBytes(16);
    // IV = initiate_vector.toString('hex')

    IV = "366b6d5cae00e952bfe70e9260b93c0e"; // one kind of decryption key in a hex format (not utf8(string))

    constructor() { }

    encrypt(data) {
        if (data) {
            try {
                var cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.enc_key, 'utf8'), Buffer.from(this.IV, 'hex'));
                const encrypted = Buffer.concat([cipher.update(Buffer.from(data, "utf8")), cipher.final()]);
                return encrypted.toString('hex');
            } catch (error) {
                logger.log(level.error, `Encryption Error: ${error}`);
                return data
            }
        }
        return data
    };

    decrypt(hash) {
        if (hash) {
            try {
                const decipher = crypto.createDecipheriv(this.algorithm, this.enc_key, Buffer.from(this.IV, 'hex'));
                const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
                return decrypted.toString();
            } catch (error) {
                logger.log(level.error, `Decryption Error: ${error}`);
                return hash
            }
        }
        return hash;
    };

    sendStatus(res, statusCode) {
        res.status(statusCode);
    };

    sendResponse(res, statusCode, data) {
        res.status(statusCode).send(data);
    };

    sendJSONResponse(res, statusCode, data) {
        res.status(statusCode).json(data);
    };

    redirectRequest(res, url) {
        res.status(301).redirect(this.getValidUrl(url));
    };

    getValidUrl(url = '') {
        const pattern = /^((http|https|ftp):\/\/)/;

        if (!pattern.test(url)) {
            url = 'http://' + url;
        }

        return url;
    };

    createSuccessResponseJSON(code, data) {
        const response = {
            code: code,
            data: data,
        };
        return response;
    };

    createErrorResponseJSON(code, error) {
        const errorResponse = {
            code: code,
            error: error,
        };
        return errorResponse;
    };

    async wait(seconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    };

    encodeBase64(encode) {
        return Buffer.from(encode).toString('base64');
    };

    decodeBase64(decode) {
        return Buffer.from(decode, 'base64').toString('ascii');
    };

    generate() {
        return shortid.generate();
    };

    getDistanceFromLatLon(lat1, lon1, lat2, lon2, unit) {
        const RadiusInKM = 6371; // Radius of the earth in km
        const RadiusInMI = 3958.8; // Radius of the earth in mi

        const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
            Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d;
        if (unit == 'km') {
            d = RadiusInKM * c; // Distance in km
        } else {
            d = RadiusInMI * c; // Distance in mi
        }
        return d;
    };

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    };


    algorithm1 = 'aes256'; // or any other algorithm supported by OpenSSL
    key1 = 'password';

    decryptURL(text) {
        const decipher = crypto.createDecipher(this.algorithm1, this.key1);
        const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    }

    trimAndLowercase(text) {
        return text ? text.toLowerCase().trim() : text;
    }

    beautify(jsonObject) {
        // return JSON.stringify(jsonObject, null, 2)
        return JSON.stringify(jsonObject);
    }

    replace_Id(json) {
        if (Array.isArray(json)) {
            json = json.map(item => {
                return this.replace_Id(item)
            })
            return json;
        } else if (typeof json == 'object') {
            for (let key in json) {
                if (key in json) {
                    if (key == '_id')
                        json['id'] = this.replace_Id(json[key])
                    else
                        json[key] = this.replace_Id(json[key])
                }
            }
            return json
        } else {
            return json
        }
    }

    async validateDTO(DTO: ClassConstructor<any>, object: any) {
        const res = await validate(plainToClass(DTO, object)).then(errors => {
            if (errors.length > 0) {
                // Validation Failed Here
                let e = [];
                errors.forEach(element => {
                    e.push(...Object.values(element.constraints));
                })
                return e;
            } else {
                // Validation Success Here
                return [];
            }
        });
        return res;
    }
}
