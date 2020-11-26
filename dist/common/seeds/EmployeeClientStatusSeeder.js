"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeClientStatusSeeder = void 0;
const objectFactory_1 = require("./objectFactory");
const typeorm_1 = require("typeorm");
const EmployeeClientStatus_1 = require("./../../modules/employee_client_status/EmployeeClientStatus");
const logger_1 = __importDefault(require("../logger/logger"));
class EmployeeClientStatusSeeder {
    constructor() {
        const parsedObjects = objectFactory_1.objectFactory(this.data(), EmployeeClientStatus_1.EmployeeClientStatus);
        this.objectList = [...parsedObjects];
    }
    data() {
        return [
            {
                name: 'ACTIVATED'
            },
            {
                name: 'DEACTIVATED'
            }
        ];
    }
    async run() {
        const data = this.data();
        const parsedObjects = objectFactory_1.objectFactory(data, EmployeeClientStatus_1.EmployeeClientStatus);
        this.objectList = [...parsedObjects];
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(EmployeeClientStatus_1.EmployeeClientStatus);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <EmployeeClientStatus data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.EmployeeClientStatusSeeder = EmployeeClientStatusSeeder;
//# sourceMappingURL=EmployeeClientStatusSeeder.js.map