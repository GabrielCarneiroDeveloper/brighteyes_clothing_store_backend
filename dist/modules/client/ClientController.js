"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const Client_1 = require("./../../modules/client/Client");
const abstract_controller_1 = require("../abstract.controller");
const typeorm_1 = require("typeorm");
class ClientController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.create = async (request, response) => {
            try {
                const data = request.body;
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const clientFound = await repository.findOne({ where: { cpf: data.cpf } });
                if (clientFound) {
                    throw new Error('Client already exists');
                }
                const createdObject = await repository.save(data, this.saveOptions);
                return response.json({
                    message: 'Object created',
                    data: createdObject
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
                await repository.update(id, data);
                const updateObject = await repository.findOneOrFail(id, this.findOneOptions);
                return response.json({
                    message: 'Object updated',
                    data: updateObject
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
        this.route = route;
        this.ModelClassName = Client_1.Client;
        this.findManyOptions = { relations: ['status'] };
        this.findOneOptions = { relations: ['status'] };
    }
    async init() {
        this.route.get('/clients', this.list);
        this.route.post('/clients', this.create);
        this.route.get('/clients/:id', this.listOneById);
        this.route.put('/clients/:id', this.update);
        this.route.delete('/clients/:id', this.remove);
    }
}
exports.ClientController = ClientController;
//# sourceMappingURL=ClientController.js.map