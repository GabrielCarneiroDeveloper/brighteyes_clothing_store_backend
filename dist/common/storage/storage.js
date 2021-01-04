"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app_config_1 = __importDefault(require("./../../config/app.config"));
function storage(module) {
    const storage = multer_1.default.diskStorage({
        destination: (_, __, cb) => {
            const dest = path_1.default.join(app_config_1.default.images, module);
            console.log(dest);
            cb(null, dest);
        },
        filename: (_, file, cb) => {
            const splitted = file.originalname.split('.');
            const fileExtension = splitted[splitted.length - 1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
        }
    });
    const upload = multer_1.default({
        storage: storage
    });
    return upload;
}
exports.storage = storage;
//# sourceMappingURL=storage.js.map