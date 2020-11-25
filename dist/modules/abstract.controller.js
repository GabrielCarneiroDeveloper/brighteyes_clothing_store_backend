"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractController = void 0;
const typeorm_1 = require("typeorm");
class AbstractController {
    constructor() {
        this.list = async (_, response) => {
            try {
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const objectList = await repository.find(this.findManyOptions);
                return response.json(objectList);
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'an error occurred',
                    error_message: error.message
                });
            }
        };
        this.listOneById = async (request, response) => {
            try {
                const id = request.params.id;
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const foundObject = await repository.findOne(id, this.findOneOptions);
                if (!foundObject) {
                    throw new Error('Object not found');
                }
                return response.json(foundObject);
            }
            catch (error) {
                console.error(error);
                return response.status(401).json({
                    message: 'an error occurred',
                    error_message: error.message
                });
            }
        };
        this.create = async (request, response) => {
            try {
                const data = request.body;
                const repository = typeorm_1.getRepository(this.ModelClassName);
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
        this.remove = async (request, response) => {
            try {
                const id = request.params.id;
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const foundObject = await repository.findOneOrFail(id, this.findOneOptions);
                await repository.remove(foundObject, this.removeOptions);
                return response.json({
                    message: 'Object removed'
                });
            }
            catch (error) {
                console.error(error);
                return response.status(401).json(error);
            }
        };
    }
}
exports.AbstractController = AbstractController;
//# sourceMappingURL=abstract.controller.js.map