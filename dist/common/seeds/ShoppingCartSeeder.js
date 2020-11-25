"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartSeeder = void 0;
const typeorm_1 = require("typeorm");
const objectFactory_1 = require("./objectFactory");
const ShoppingCart_1 = require("./../../modules/shopping-cart/ShoppingCart");
const Employee_1 = require("../../modules/employee/Employee");
const EmployeeTitle_1 = require("../../modules/employee_title/EmployeeTitle");
const EmployeeTitleEnum_1 = require("./../../modules/employee_title/EmployeeTitleEnum");
const Client_1 = require("./../../modules/client/Client");
const ShoppingCartStatus_1 = require("./../../modules/shopping_cart_status/ShoppingCartStatus");
const ShoppingCartEnum_1 = require("./../../modules/shopping_cart_status/ShoppingCartEnum");
const Clothes_1 = require("./../../modules/clothes/Clothes");
const logger_1 = __importDefault(require("../logger/logger"));
class ShoppingCartSeeder {
    async data() {
        const seller = await typeorm_1.getRepository(Employee_1.Employee).findOneOrFail({
            where: {
                title: await typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle).findOneOrFail({
                    where: { name: EmployeeTitleEnum_1.EmployeeTitleEnum.WAREHOUSE }
                })
            }
        });
        const cashier = await typeorm_1.getRepository(Employee_1.Employee).findOneOrFail({
            where: {
                title: await typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle).findOneOrFail({
                    where: { name: EmployeeTitleEnum_1.EmployeeTitleEnum.CASHIER }
                })
            }
        });
        const status = await typeorm_1.getRepository(ShoppingCartStatus_1.ShoppingCartStatus).findOneOrFail({
            where: {
                name: ShoppingCartEnum_1.ShoppingCartEnum.IN_PROGRESS
            }
        });
        const clothes = await typeorm_1.getRepository(Clothes_1.Clothes).findOneOrFail();
        const client = await typeorm_1.getRepository(Client_1.Client).findOneOrFail();
        return [
            {
                id: 1,
                clothes: [clothes],
                status,
                client,
                cashier,
                seller,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }
    async run() {
        const data = await this.data();
        const parsedObjects = objectFactory_1.objectFactory(data, ShoppingCart_1.ShoppingCart);
        this.objectList = [...parsedObjects];
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(ShoppingCart_1.ShoppingCart);
        this.objectList.forEach(async (o) => {
            if (!(await typeorm_1.getRepository(ShoppingCart_1.ShoppingCart).findOne(o.id))) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <ShoppingCart data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.ShoppingCartSeeder = ShoppingCartSeeder;
//# sourceMappingURL=ShoppingCartSeeder.js.map