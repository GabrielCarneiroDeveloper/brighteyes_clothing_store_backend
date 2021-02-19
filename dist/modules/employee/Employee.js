"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Employee_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const EmployeeClientStatus_1 = require("./../../modules/employee_client_status/EmployeeClientStatus");
const EmployeeTitle_1 = require("../employee_title/EmployeeTitle");
let Employee = Employee_1 = class Employee {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => EmployeeTitle_1.EmployeeTitle, (employeeTitle) => employeeTitle.id, {
        eager: true
    }),
    typeorm_1.JoinColumn({ name: 'employee_title_id' }),
    __metadata("design:type", EmployeeTitle_1.EmployeeTitle)
], Employee.prototype, "title", void 0);
__decorate([
    typeorm_1.ManyToOne(() => EmployeeClientStatus_1.EmployeeClientStatus, (employeeClientStatus) => employeeClientStatus.name, {
        eager: true
    }),
    typeorm_1.JoinColumn({ name: 'employee_status_id' }),
    __metadata("design:type", EmployeeClientStatus_1.EmployeeClientStatus)
], Employee.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Employee_1, (employee) => employee.id),
    typeorm_1.JoinColumn({ name: 'employee_hr_id' }),
    __metadata("design:type", Employee)
], Employee.prototype, "registeredBy", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Employee.prototype, "birthdate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Employee.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
Employee = Employee_1 = __decorate([
    typeorm_1.Entity()
], Employee);
exports.Employee = Employee;
//# sourceMappingURL=Employee.js.map