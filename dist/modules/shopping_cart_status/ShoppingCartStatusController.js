"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartStatusController = void 0;
const ShoppingCartStatus_1 = require("./../../modules/shopping_cart_status/ShoppingCartStatus");
const abstract_controller_1 = require("../abstract.controller");
class ShoppingCartStatusController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.route = route;
        this.ModelClassName = ShoppingCartStatus_1.ShoppingCartStatus;
    }
    async init() {
        this.route.get('/shopping-cart-status', this.list);
        this.route.post('/shopping-cart-status', this.create);
        this.route.get('/shopping-cart-status/:id', this.listOneById);
        this.route.put('/shopping-cart-status/:id', this.update);
        this.route.delete('/shopping-cart-status/:id', this.remove);
    }
}
exports.ShoppingCartStatusController = ShoppingCartStatusController;
//# sourceMappingURL=ShoppingCartStatusController.js.map