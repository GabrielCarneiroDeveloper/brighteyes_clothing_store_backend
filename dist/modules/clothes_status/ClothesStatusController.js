"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClothesStatusController = void 0;
const abstract_controller_1 = require("../abstract.controller");
const ClothesStatus_1 = require("./ClothesStatus");
class ClothesStatusController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.route = route;
        this.ModelClassName = ClothesStatus_1.ClothesStatus;
    }
    async init() {
        this.route.get('/clothes-status', this.list);
        this.route.post('/clothes-status', this.create);
        this.route.get('/clothes-status/:id', this.listOneById);
        this.route.put('/clothes-status/:id', this.update);
        this.route.delete('/clothes-status/:id', this.remove);
    }
}
exports.ClothesStatusController = ClothesStatusController;
//# sourceMappingURL=ClothesStatusController.js.map