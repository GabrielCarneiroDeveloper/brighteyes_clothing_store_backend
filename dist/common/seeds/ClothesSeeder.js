"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClothesSeeder = void 0;
const typeorm_1 = require("typeorm");
const objectFactory_1 = require("./objectFactory");
const Clothes_1 = require("./../../modules/clothes/Clothes");
const ClothesStatus_1 = require("./../../modules/clothes_status/ClothesStatus");
const Employee_1 = require("./../../modules/employee/Employee");
const EmployeeTitle_1 = require("./../../modules/employee_title/EmployeeTitle");
const ClothesStatusEnum_1 = require("./../../modules/clothes_status/ClothesStatusEnum");
const logger_1 = __importDefault(require("../logger/logger"));
class ClothesSeeder {
    async data() {
        const clothesStatusInStock = await typeorm_1.getRepository(ClothesStatus_1.ClothesStatus).findOneOrFail({
            where: { name: ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK }
        });
        const employeeWarehouse = await typeorm_1.getRepository(Employee_1.Employee).findOneOrFail({
            where: {
                title: await typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle).findOneOrFail({ where: { name: 'Warehouse' } })
            }
        });
        return [
            {
                name: 'Dress',
                price: 2.9,
                quantityInStock: 2,
                status: clothesStatusInStock,
                photo: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
            },
            {
                name: 'Jeans',
                price: 14.78,
                quantityInStock: 5,
                status: clothesStatusInStock,
                photo: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
            }
        ];
    }
    async run() {
        const data = await this.data();
        const parsedObjects = objectFactory_1.objectFactory(data, Clothes_1.Clothes);
        this.objectList = [...parsedObjects];
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(Clothes_1.Clothes);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <Clothes data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.ClothesSeeder = ClothesSeeder;
//# sourceMappingURL=ClothesSeeder.js.map