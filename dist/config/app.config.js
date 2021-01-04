"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.config();
const logger_1 = __importDefault(require("./../common/logger/logger"));
function readVersionFile() {
    const versionFilePath = path_1.default.resolve(__dirname, '..', '..', '.version');
    let versionFile = '';
    fs_1.default.readFile(versionFilePath, 'utf8', (error, vf) => {
        if (error) {
            logger_1.default.error(error.message);
        }
        versionFile = vf;
    });
    return versionFile;
}
const b = process.env.NODE_ENV !== 'production' ? 'src' : 'dist';
const APP_CONFIG = {
    jwtSecretkey: process.env.JWT_SECRET_KEY,
    version: readVersionFile(),
    serve: {
        host: process.env.HOST_ADDRESS || '0.0.0.0',
        port: process.env.PORT || '3333',
        logLevel: process.env.LOG_LEVEL || 'info'
    },
    images: path_1.default.join(path_1.default.basename(__filename), '..', b, 'public', 'images')
};
exports.default = APP_CONFIG;
//# sourceMappingURL=app.config.js.map