"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClothesStatusSeeder = void 0;
const objectFactory_1 = require("./objectFactory");
const ClothesStatus_1 = require("./../../modules/clothes_status/ClothesStatus");
const typeorm_1 = require("typeorm");
const ClothesStatusEnum_1 = require("./../../modules/clothes_status/ClothesStatusEnum");
const logger_1 = __importDefault(require("../logger/logger"));
class ClothesStatusSeeder {
    constructor() {
        const parsedObjects = objectFactory_1.objectFactory(this.data(), ClothesStatus_1.ClothesStatus);
        this.objectList = [...parsedObjects];
    }
    data() {
        return [
            {
                name: ClothesStatusEnum_1.ClothesStatusEnum.OUT_OF_STOCK
            },
            {
                name: ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK
            }
        ];
    }
    async run() {
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(ClothesStatus_1.ClothesStatus);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <ClothesStatus data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.ClothesStatusSeeder = ClothesStatusSeeder;
//# sourceMappingURL=ClothesStatusSeeder.js.map