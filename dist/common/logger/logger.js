"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const app_config_1 = __importDefault(require("../../config/app.config"));
const logger_enum_1 = require("./logger.enum");
const { combine, splat, timestamp, printf, colorize, uncolorize } = winston_1.format;
const loggerConfigs = {
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    serviceName: 'auth-service',
    errorLogFilename: 'logs/error.log',
    generalLogFilename: 'logs/combined.log'
};
const myFormat = printf(({ level, message, timestamp }) => {
    let msg = `${timestamp} | ${level} | `;
    if (typeof message !== 'string' && typeof message !== 'number') {
        msg += JSON.stringify(message);
    }
    else {
        msg += message;
    }
    return msg;
});
const logger = winston_1.default.createLogger({
    level: app_config_1.default.serve.logLevel,
    format: combine(colorize(), splat(), timestamp({ format: loggerConfigs.timestampFormat })),
    transports: [
        new winston_1.transports.Console({
            format: myFormat
        }),
        new winston_1.transports.File({
            filename: loggerConfigs.errorLogFilename,
            format: combine(uncolorize(), myFormat),
            level: logger_enum_1.LOG_LEVEL.ERROR
        }),
        new winston_1.transports.File({
            filename: loggerConfigs.generalLogFilename,
            format: combine(uncolorize(), myFormat),
            level: logger_enum_1.LOG_LEVEL.INFO
        })
    ]
});
exports.default = logger;
//# sourceMappingURL=logger.js.map