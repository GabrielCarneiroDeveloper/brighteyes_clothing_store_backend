"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClothesController = void 0;
const abstract_controller_1 = require("../abstract.controller");
const Clothes_1 = require("./Clothes");
const storage_1 = require("./../../common/storage/storage");
const typeorm_1 = require("typeorm");
const upload = storage_1.storage('clothes');
class ClothesController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.create = async (request, response) => {
            try {
                const data = request.body;
                const repository = typeorm_1.getRepository(this.ModelClassName);
                const foundClothes = (await repository.findOne({ where: { name: data.name } }));
                if (foundClothes) {
                    throw new Error('Clothes already registered');
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
                const foundClothes = (await repository.findOne({ where: { name: data.name } }));
                console.log(data.name);
                if (foundClothes) {
                    throw new Error('Clothes already registered');
                }
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
        this.imagesUpload = async (req, res) => {
            try {
                if (!req.file) {
                    console.log('No file is available!');
                    return res.send({
                        filename: '',
                        success: false
                    });
                }
                else {
                    console.log('File is available!');
                    return res.send({
                        filename: req.file.filename,
                        success: true
                    });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(401).json(error.message);
            }
        };
        this.route = route;
        this.ModelClassName = Clothes_1.Clothes;
        this.findManyOptions = { relations: ['status'] };
        this.findOneOptions = { relations: ['status'] };
    }
    async init() {
        this.route.get('/clothes', this.list);
        this.route.post('/clothes', this.create);
        this.route.get('/clothes/:id', this.listOneById);
        this.route.put('/clothes/:id', this.update);
        this.route.delete('/clothes/:id', this.remove);
        this.route.post('/clothes/upload', upload.single('image'), this.imagesUpload);
    }
}
exports.ClothesController = ClothesController;
//# sourceMappingURL=ClothesController.js.map