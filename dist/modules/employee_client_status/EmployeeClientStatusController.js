"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeClientStatusController = void 0;
const abstract_controller_1 = require("../abstract.controller");
const EmployeeClientStatus_1 = require("./EmployeeClientStatus");
class EmployeeClientStatusController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.ModelClassName = EmployeeClientStatus_1.EmployeeClientStatus;
        this.route = route;
    }
    async init() {
        this.route.get('/employee-client-status', this.list);
        this.route.post('/employee-client-status', this.create);
        this.route.get('/employee-client-status/:id', this.listOneById);
        this.route.put('/employee-client-status/:id', this.update);
        this.route.delete('/employee-client-status/:id', this.remove);
    }
}
exports.EmployeeClientStatusController = EmployeeClientStatusController;
//# sourceMappingURL=EmployeeClientStatusController.js.map