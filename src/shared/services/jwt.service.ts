import { Injectable } from '@nestjs/common';
import { level, logger } from 'src/config';
import { JwtService as Jwt } from '@nestjs/jwt';

@Injectable()
export class JwtService {

    constructor(private readonly jwt: Jwt) {

    }

    async createToken(email) {
        return new Promise((resolve, reject) => {
            const exp = Math.floor(Date.now() / 1000) + 60 * 60 * (24 * Number(process.env.TOKEN_EXPIRES_IN_DAY)); // 1 day
            const payload = {
                email: email,
                exp
            };
            try {
                let secret = process.env.JWT_TOKEN_SECRET;
                const token = Promise.resolve(this.jwt.sign(payload, { secret }));
                resolve(token);
            } catch (err) {
                reject(err);
            }
        });
    }

    async createAdminToken(email) {
        return new Promise((resolve, reject) => {
            const exp = Math.floor(Date.now() / 1000) + 60 * 60 * (24 * Number(process.env.ADMIN_TOKEN_EXPIRES_IN_DAY)); // 1 day
            const payload = {
                email: email,
                exp
            };
            try {
                let secret = process.env.JWT_ADMIN_TOKEN_SECRET;
                const token = Promise.resolve(this.jwt.sign(payload, { secret }));
                resolve(token);
            } catch (err) {
                reject(err);
            }
        });
    }

    async verifyToken(accessToken) {
        return new Promise((resolve, reject) => {
            try {
                let secret = process.env.JWT_TOKEN_SECRET;
                const decoded = this.jwt.verify(accessToken, { secret });
                resolve(decoded);
            } catch (err) {
                reject(err);
            }
        });
    }

    async verifyAdminToken(accessToken) {
        logger.log(level.debug, `verifyAdminToken  decoded=${JSON.stringify(accessToken)}`);
        return new Promise((resolve, reject) => {
            try {
                let secret = process.env.JWT_ADMIN_TOKEN_SECRET;
                const decoded = this.jwt.verify(accessToken, { secret });
                logger.log(level.debug, `verifyAdminToken  decoded=${JSON.stringify(decoded)}`);
                resolve(decoded);
            } catch (err) {
                reject(err);
            }
        });
    }

    async parseAuthToken({ request, connection }) {
        const AUTHORIZATION_HEADER_NAME = 'authorization';
        let authorization;
        if (connection) {
            authorization = connection.context[AUTHORIZATION_HEADER_NAME];
        } else {
            authorization = request.headers[AUTHORIZATION_HEADER_NAME];
        }
        if (authorization) {
            const tokenSplitBy = ' ';
            let token = authorization.split(tokenSplitBy);
            let length = token.length;
            const tokenLength = 2;
            if (length == tokenLength) {
                let accessToken = token[1];
                try {
                    // const auth = new JWTAuth();
                    let decoded = await this.verifyToken(accessToken);
                    logger.log(level.silly, `utility parseAuthToken decoded=${JSON.stringify(decoded)}`
                    );
                    return decoded;
                } catch (err) {
                    // logger.log(level.error, `utility parseAuthToken err=${err}`);
                    return null;
                }
            }
        }
        return null;
    };

    async parseAdminAuthToken({ request, connection }) {
        // logger.log(level.debug, `utlity parseAdminAuthToken`);
        const AUTHORIZATION_HEADER_NAME = 'authorization';
        let authorization;
        if (connection) {
            authorization = connection.context[AUTHORIZATION_HEADER_NAME];
        } else {
            authorization = request.headers[AUTHORIZATION_HEADER_NAME];
        }
        if (authorization) {
            const tokenSplitBy = ' ';
            let token = authorization.split(tokenSplitBy);
            let length = token.length;
            const tokenLength = 2;
            if (length == tokenLength) {
                let accessToken = token[1];
                try {
                    // const auth = new JWTAuth();
                    let decoded = await this.verifyAdminToken(accessToken);
                    logger.log(
                        level.silly,
                        `utlity parseAuthToken decoded=${JSON.stringify(decoded)}`
                    );
                    return decoded;
                } catch (e) {
                    // logger.log(level.error, `utlity parseAdminAuthToken ${e}`);
                    return null;
                }
            }
        }
        return null;
    };
}
