"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const Client_1 = require("./../../modules/client/Client");
const abstract_controller_1 = require("../abstract.controller");
class ClientController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
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