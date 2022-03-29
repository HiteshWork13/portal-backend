import { createLogger, format, transports } from 'winston';

export default class winston {

    constructor() {

    }

    private combine = format.combine;
    private timestamp = format.timestamp;
    private label = format.label;
    private printf = format.printf;
    private colorize = format.colorize;

    LOG_LABEL: string = 'POR_LOGS';
    LOG_TIMEZONE = 'Asia/Calcutta';
    LOCALE = 'en-US';

    private timezoned = () => {
        return new Date().toLocaleString(this.LOCALE, {
            timeZone: this.LOG_TIMEZONE,
        });
    };

    private customFormat = this.printf(({
        level,
        message,
        label,
        timestamp
    }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    private combineFormat = this.combine(
        this.label({
            label: this.LOG_LABEL
        }),
        this.timestamp({
            format: this.timezoned
        }),
        this.colorize({ level: true }),
        this.customFormat
    );



    initLogger() {
        const transportsDetails = [];

        if (process.env.IS_CONSOLE == 'true') {
            transportsDetails.push(
                new transports.Console({
                    level: process.env.LOG_LEVEL,
                    format: this.combineFormat,
                    /* timestamp: function () {
                        return new Date().toLocaleTimeString();
                    } */
                })
            );
        } else {
            transportsDetails.push(
                new transports.Console({
                    level: process.env.LOG_LEVEL,
                    format: this.combineFormat,
                    /* timestamp: () => {
                        return new Date().toLocaleTimeString();
                    }, */
                })
            );
        }
        return createLogger({
            transports: transportsDetails,
        });
    }

}