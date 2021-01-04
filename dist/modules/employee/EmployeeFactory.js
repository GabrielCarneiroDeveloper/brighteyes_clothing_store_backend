"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeFactory = void 0;
const typeorm_1 = require("typeorm");
const EmployeeTitle_1 = require("../employee_title/EmployeeTitle");
const Employee_1 = require("./Employee");
const bcrypt_1 = __importDefault(require("bcrypt"));
const EmployeeClientStatus_1 = require("../employee_client_status/EmployeeClientStatus");
class EmployeeFactory {
    constructor() {
        this.buildWithCreateDTO = async (data) => {
            const employeeRepository = typeorm_1.getRepository(Employee_1.Employee);
            const employeeTitleRepository = typeorm_1.getRepository(EmployeeTitle_1.EmployeeTitle);
            const employeeStatusRepository = typeorm_1.getRepository(EmployeeClientStatus_1.EmployeeClientStatus);
            const amountOfSaltRounds = 10;
            const employee = new Employee_1.Employee();
            employee.name = data.name;
            employee.email = data.email;
            employee.birthdate = data.birthdate;
            employee.password = await bcrypt_1.default.hash(data.password, amountOfSaltRounds);
            employee.registeredBy = await employeeRepository.findOneOrFail(data.registeredBy);
            employee.status = await employeeStatusRepository.findOneOrFail(data.status);
            employee.title = await employeeTitleRepository.findOneOrFail(data.title);
            return employee;
        };
    }
}
exports.EmployeeFactory = EmployeeFactory;
//# sourceMappingURL=EmployeeFactory.js.map