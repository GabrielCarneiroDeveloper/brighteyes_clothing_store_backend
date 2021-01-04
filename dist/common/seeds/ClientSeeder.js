"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSeeder = void 0;
const objectFactory_1 = require("./objectFactory");
const typeorm_1 = require("typeorm");
const Client_1 = require("./../../modules/client/Client");
const EmployeeClientStatus_1 = require("./../../modules/employee_client_status/EmployeeClientStatus");
const logger_1 = __importDefault(require("../logger/logger"));
class ClientSeeder {
    constructor() {
        const parsedObjects = objectFactory_1.objectFactory(this.data(), Client_1.Client);
        this.objectList = [...parsedObjects];
    }
    data() {
        return [
            {
                name: 'Client 1',
                address: 'Rua asdf, 123 - AEdasdfsd, asdfasdf',
                birthdate: '14/12/1987',
                cpf: '123.123.123-13',
                createdAt: new Date()
            }
        ];
    }
    async run() {
        const statusRepository = typeorm_1.getRepository(EmployeeClientStatus_1.EmployeeClientStatus);
        const status = await statusRepository.findOne({ where: { name: 'ACTIVATED' } });
        if (!status) {
            throw new Error('Status ACTIVATED not found in database');
        }
        const data = this.data().map((d) => ({ ...d, status: status }));
        const parsedObjects = objectFactory_1.objectFactory(data, Client_1.Client);
        this.objectList = [...parsedObjects];
        logger_1.default.debug(`Running seeder ${this.constructor.name}`);
        const repository = typeorm_1.getRepository(Client_1.Client);
        this.objectList.forEach(async (o) => {
            const found = await repository.findOne({ where: { name: o.name } });
            if (!found) {
                await repository.save(o);
                logger_1.default.debug(`Saved model <Client data=${JSON.stringify(o)}>`);
            }
        });
        logger_1.default.debug(`Ran succesfully the Seeder ${this.constructor.name}`);
    }
}
exports.ClientSeeder = ClientSeeder;
//# sourceMappingURL=ClientSeeder.js.map