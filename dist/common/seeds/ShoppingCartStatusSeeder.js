"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartStatusSeeder = void 0;
const typeorm_1 = require("typeorm");
const objectFactory_1 = require("./objectFactory");
const ShoppingCartStatus_1 = require("./../../modules/shopping_cart_status/ShoppingCartStatus");
const logger_1 = __importDefault(require("../logger/logger"));
class ShoppingCartStatusSeeder {
    constructor() {
        const parsedObjects = objectFactory_1.objectFactory(this.data(), ShoppingCartStatus_1.ShoppingCartStatus);
        this.objectList = [...parsedObjects];
    }
    data() {
        return [
            {
                name: 'IN PROGRESS'
            },
            {
                name: 'CANCELED'
            },
            {
                name: 'FINISHED'
            }
        ];
    }
    async run() {
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(ShoppingCartStatus_1.ShoppingCartStatus);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <ShoppingCartStatus data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.ShoppingCartStatusSeeder = ShoppingCartStatusSeeder;
//# sourceMappingURL=ShoppingCartStatusSeeder.js.map