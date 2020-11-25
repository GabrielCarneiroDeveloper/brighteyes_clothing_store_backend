"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeTitleSeeder = void 0;
const typeorm_1 = require("typeorm");
const EmployeeTitle_1 = require("../../modules/employee_title/EmployeeTitle");
const objectFactory_1 = require("./objectFactory");
const logger_1 = __importDefault(require("../logger/logger"));
class EmployeeTitleSeeder {
    constructor() {
        const parsedObjects = objectFactory_1.objectFactory(this.data(), EmployeeTitle_1.EmployeeTitle);
        this.objectList = [...parsedObjects];
    }
    data() {
        return [
            {
                name: 'Warehouse'
            },
            {
                name: 'Human Resource'
            },
            {
                name: 'Customer Service'
            },
            {
                name: 'Seller'
            },
            {
                name: 'Cashier'
            },
            {
                name: 'Admin'
            }
        ];
    }
    async run() {
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <EmployeeTitle data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.EmployeeTitleSeeder = EmployeeTitleSeeder;
//# sourceMappingURL=EmployeeTitleSeeder.js.map