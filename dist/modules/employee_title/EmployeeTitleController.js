"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeTitleController = void 0;
const EmployeeTitle_1 = require("./../../modules/employee_title/EmployeeTitle");
const abstract_controller_1 = require("../abstract.controller");
class EmployeeTitleController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.ModelClassName = EmployeeTitle_1.EmployeeTitle;
        this.route = route;
    }
    async init() {
        this.route.get('/employee-title', this.list);
        this.route.post('/employee-title', this.create);
        this.route.get('/employee-title/:id', this.listOneById);
        this.route.put('/employee-title/:id', this.update);
        this.route.delete('/employee-title/:id', this.remove);
    }
}
exports.EmployeeTitleController = EmployeeTitleController;
//# sourceMappingURL=EmployeeTitleController.js.map