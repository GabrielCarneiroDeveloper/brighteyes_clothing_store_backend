"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSeeder = void 0;
const objectFactory_1 = require("./objectFactory");
const typeorm_1 = require("typeorm");
const EmployeeClientStatus_1 = require("./../../modules/employee_client_status/EmployeeClientStatus");
const Employee_1 = require("./../../modules/employee/Employee");
const EmployeeTitle_1 = require("./../../modules/employee_title/EmployeeTitle");
const logger_1 = __importDefault(require("../logger/logger"));
const formatDate_1 = require("../formatDate");
const PASSWORD_DEFAULT = '$2b$10$1PeKVUoMMAKR.pKrQN046OxrAb.aSfZbYROl2NNY.ZbUKVZcjfmg6';
class EmployeeSeeder {
    async createHrEmployee() {
        const employeeTitleRepository = typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle);
        const statusRepository = typeorm_1.getRepository(EmployeeClientStatus_1.EmployeeClientStatus);
        const employeeRepository = typeorm_1.getRepository(Employee_1.Employee);
        const humanResourceTitle = await employeeTitleRepository.findOne({
            where: { name: 'Human Resource' }
        });
        const activatedStatus = await statusRepository.findOne({ where: { name: 'ACTIVATED' } });
        if (!humanResourceTitle || !activatedStatus) {
            throw new Error('Required data not found in database to the function "hrEmployee()"');
        }
        const hrEmployee = {
            name: 'Employee 1',
            birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
            password: PASSWORD_DEFAULT,
            title: humanResourceTitle,
            status: activatedStatus,
            email: 'hr@brighteyes.com'
        };
        try {
            const found = await employeeRepository.findOne({ where: { name: 'Employee 1' } });
            if (!found) {
                await employeeRepository.save(hrEmployee);
            }
            logger_1.default.debug('HR employee firstly created successfully');
            return hrEmployee;
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
    data() {
        return [
            {
                name: 'Employee 2',
                birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
                password: PASSWORD_DEFAULT,
                email: 'warehouse@brighteyes.com'
            },
            {
                name: 'Employee 3',
                birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
                password: PASSWORD_DEFAULT,
                email: 'customerservice@brighteyes.com'
            },
            {
                name: 'Employee 4',
                birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
                password: PASSWORD_DEFAULT,
                email: 'seller@brighteyes.com'
            },
            {
                name: 'Employee 5',
                birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
                password: PASSWORD_DEFAULT,
                email: 'cashier@brighteyes.com'
            },
            {
                name: 'Admin',
                birthdate: formatDate_1.dateFormatter(new Date('10/14/1987')),
                password: PASSWORD_DEFAULT,
                email: 'admin@brighteyes.com'
            }
        ];
    }
    async run() {
        await this.createHrEmployee();
        const statusRepository = typeorm_1.getRepository(EmployeeClientStatus_1.EmployeeClientStatus);
        const employeeTitleRepository = typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle);
        const employeeRepository = typeorm_1.getRepository(Employee_1.Employee);
        const activatedStatus = await statusRepository.findOne({ where: { name: 'ACTIVATED' } });
        const deactivatedStatus = await statusRepository.findOne({ where: { name: 'DEACTIVATED' } });
        const warehouseTitle = await employeeTitleRepository.findOne({ where: { name: 'Warehouse' } });
        const customerServiceTitle = await employeeTitleRepository.findOne({
            where: { name: 'Customer Service' }
        });
        const sellerTitle = await employeeTitleRepository.findOne({ where: { name: 'Seller' } });
        const cashierTitle = await employeeTitleRepository.findOne({ where: { name: 'Cashier' } });
        const adminTitle = await employeeTitleRepository.findOne({ where: { name: 'Admin' } });
        const hrEmployee = await employeeRepository.findOne({
            where: { name: 'Employee 1' }
        });
        if (!activatedStatus ||
            !deactivatedStatus ||
            !warehouseTitle ||
            !customerServiceTitle ||
            !sellerTitle ||
            !cashierTitle ||
            !adminTitle ||
            !hrEmployee) {
            throw new Error('Required data not found in database');
        }
        const data = this.data();
        const d1 = Object.assign(data[0], {
            ...data[0],
            registeredBy: hrEmployee,
            title: warehouseTitle,
            status: activatedStatus
        });
        const d2 = Object.assign(data[1], {
            ...data[1],
            registeredBy: hrEmployee,
            title: customerServiceTitle,
            status: activatedStatus
        });
        const d3 = Object.assign(data[2], {
            ...data[2],
            registeredBy: hrEmployee,
            title: sellerTitle,
            status: activatedStatus
        });
        const d4 = Object.assign(data[3], {
            ...data[3],
            registeredBy: hrEmployee,
            title: cashierTitle,
            status: activatedStatus
        });
        const d5 = Object.assign(data[4], {
            ...data[4],
            registeredBy: hrEmployee,
            title: adminTitle,
            status: activatedStatus
        });
        const listOfData = [d1, d2, d3, d4, d5];
        const parsedObjects = objectFactory_1.objectFactory(listOfData, Employee_1.Employee);
        this.objectList = [...parsedObjects];
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        this.objectList.forEach(async (o) => {
            const found = await employeeRepository.findOne({ where: { name: o.name } });
            if (!found) {
                await employeeRepository.save(o);
                logger_1.default.debug(`Saved model <Employee data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.EmployeeSeeder = EmployeeSeeder;
//# sourceMappingURL=EmployeeSeeder.js.map