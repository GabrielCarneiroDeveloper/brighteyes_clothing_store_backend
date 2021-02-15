"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const typeorm_1 = require("typeorm");
const abstract_controller_1 = require("./../../modules/abstract.controller");
const Employee_1 = require("./../../modules/employee/Employee");
const EmployeeFactory_1 = require("./EmployeeFactory");
class EmployeeController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.create = async (request, response) => {
            try {
                const data = request.body;
                const repository = typeorm_1.getRepository(Employee_1.Employee);
                const employeeData = await this.factory.buildWithCreateDTO(data);
                const foundEmployee = await repository.findOne({ where: { email: data.email } });
                if (foundEmployee) {
                    throw new Error('Employee already exists');
                }
                const createdObject = await repository.save(employeeData, this.saveOptions);
                return response.json({
                    message: 'Employee created',
                    data: {
                        id: createdObject.id,
                        name: createdObject.name,
                        email: createdObject.email,
                        title: createdObject.title,
                        status: createdObject.status
                    }
                });
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'An error occurred',
                    error_message: error.message
                });
            }
        };
        this.update = async (request, response) => {
            try {
                const data = request.body;
                const id = request.params.id;
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const foundEmployee = (await repository.findOne({ where: { email: data.email } }));
                if (foundEmployee && foundEmployee.name !== data.name) {
                    throw new Error('Employee already exists');
                }
                await repository.update(id, data);
                const updatedObject = await repository.findOneOrFail(id, this.findOneOptions);
                return response.json({
                    message: 'Object updated',
                    data: updatedObject
                });
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'An error occurred',
                    error_message: error.message
                });
            }
        };
        this.ModelClassName = Employee_1.Employee;
        this.route = route;
        this.findManyOptions = { relations: ['title', 'status', 'registeredBy'] };
        this.findOneOptions = { relations: ['title', 'status', 'registeredBy'] };
        this.factory = new EmployeeFactory_1.EmployeeFactory();
    }
    async init() {
        this.route.get('/employees', this.list);
        this.route.post('/employees', this.create);
        this.route.get('/employees/:id', this.listOneById);
        this.route.put('/employees/:id', this.update);
        this.route.delete('/employees/:id', this.remove);
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=EmployeeController.js.map