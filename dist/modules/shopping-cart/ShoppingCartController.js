"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCartController = void 0;
const abstract_controller_1 = require("../abstract.controller");
const ShoppingCart_1 = require("./ShoppingCart");
const typeorm_1 = require("typeorm");
const Clothes_1 = require("../clothes/Clothes");
const ClothesStatusEnum_1 = require("../clothes_status/ClothesStatusEnum");
const ClothesStatus_1 = require("../clothes_status/ClothesStatus");
class ShoppingCartController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.addClothes = async (request, response) => {
            try {
                const id = request.params.id;
                const clothesId = request.params.clothes_id;
                const repository = typeorm_1.getRepository(ShoppingCart_1.ShoppingCart);
                const clothesRepository = typeorm_1.getRepository(Clothes_1.Clothes);
                const foundObject = await repository.findOne(id, this.findOneOptions);
                if (!foundObject) {
                    throw new Error('Object not found');
                }
                const foundClothes = await clothesRepository.findOneOrFail(clothesId, {
                    relations: ['status']
                });
                const alreadyAdded = foundObject.clothes.some((c) => c.id === foundClothes.id);
                const clothesIsAvailable = foundClothes.quantityInStock > 0 && foundClothes.status.name === ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK;
                if (alreadyAdded)
                    throw new Error('Clothes already included');
                if (!clothesIsAvailable)
                    throw new Error('Clothes not available in stock');
                foundObject.clothes.push(foundClothes);
                foundClothes.quantityInStock = --foundClothes.quantityInStock;
                await clothesRepository.save(foundClothes);
                const updatedObject = await repository.save(foundObject);
                return response.json(updatedObject);
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'an error occurred',
                    error_message: error.message
                });
            }
        };
        this.removeClothes = async (request, response) => {
            try {
                const id = request.params.id;
                const clothesId = parseInt(request.params.clothes_id);
                const repository = typeorm_1.getRepository(ShoppingCart_1.ShoppingCart);
                const clothesRepository = typeorm_1.getRepository(Clothes_1.Clothes);
                const clothesStatusRepository = typeorm_1.getRepository(ClothesStatus_1.ClothesStatus);
                const foundObject = await repository.findOne(id, this.findOneOptions);
                if (!foundObject) {
                    throw new Error('Object not found');
                }
                const foundClothes = await clothesRepository.findOneOrFail(clothesId, {
                    relations: ['status']
                });
                const inStockClothesStatus = await clothesStatusRepository.findOneOrFail({
                    where: { name: ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK }
                });
                const clothesIndexToBeRemoved = foundObject.clothes.findIndex((clothes) => clothes.id === clothesId);
                if (clothesIndexToBeRemoved === -1) {
                    throw new Error('Not found');
                }
                foundObject.clothes.splice(clothesIndexToBeRemoved, 1);
                foundClothes.quantityInStock = ++foundClothes.quantityInStock;
                foundClothes.status = inStockClothesStatus;
                await clothesRepository.save(foundClothes);
                const updatedObject = await repository.save(foundObject);
                return response.json(updatedObject);
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'an error occurred',
                    error_message: error.message
                });
            }
        };
        this.route = route;
        this.ModelClassName = ShoppingCart_1.ShoppingCart;
        this.findManyOptions = { relations: ['status', 'client', 'cashier', 'seller', 'clothes'] };
        this.findOneOptions = { relations: ['status', 'client', 'cashier', 'seller', 'clothes'] };
    }
    async init() {
        this.route.get('/shopping-cart', this.list);
        this.route.post('/shopping-cart', this.create);
        this.route.get('/shopping-cart/:id', this.listOneById);
        this.route.put('/shopping-cart/:id', this.update);
        this.route.delete('/shopping-cart/:id', this.remove);
        this.route.put('/shopping-cart/:id/add-clothes/:clothes_id', this.addClothes);
        this.route.put('/shopping-cart/:id/remove-clothes/:clothes_id', this.removeClothes);
    }
}
exports.ShoppingCartController = ShoppingCartController;
//# sourceMappingURL=ShoppingCartController.js.map