"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const ClientController_1 = require("./modules/client/ClientController");
const Db_1 = require("./common/database/Db");
const EmployeeClientStatusController_1 = require("./modules/employee_client_status/EmployeeClientStatusController");
const EmployeeController_1 = require("./modules/employee/EmployeeController");
const EmployeeTitleController_1 = require("./modules/employee_title/EmployeeTitleController");
const ShoppingCartStatusController_1 = require("./modules/shopping_cart_status/ShoppingCartStatusController");
const ClothesStatusController_1 = require("./modules/clothes_status/ClothesStatusController");
const ClothesController_1 = require("./modules/clothes/ClothesController");
const ShoppingCartController_1 = require("./modules/shopping-cart/ShoppingCartController");
const runSeeders_1 = require("./common/seeds/runSeeders");
const AuthController_1 = require("./modules/auth/AuthController");
const logger_1 = __importDefault(require("./common/logger/logger"));
const app_config_1 = __importDefault(require("./config/app.config"));
const yamljs_1 = require("yamljs");
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const StatisticsController_1 = require("./modules/statistics/StatisticsController");
class App {
    constructor() {
        this.application = express_1.default();
    }
    async init() {
        this.initMiddlewares();
        await this.initDatabase();
        const route = express_1.Router();
        await this.initApiSummarize(route);
        await this.initSeeders(route);
        await this.initModule(ClientController_1.ClientController, route);
        await this.initModule(ClothesController_1.ClothesController, route);
        await this.initModule(ClothesStatusController_1.ClothesStatusController, route);
        await this.initModule(EmployeeController_1.EmployeeController, route);
        await this.initModule(EmployeeClientStatusController_1.EmployeeClientStatusController, route);
        await this.initModule(EmployeeTitleController_1.EmployeeTitleController, route);
        await this.initModule(ShoppingCartStatusController_1.ShoppingCartStatusController, route);
        await this.initModule(ShoppingCartController_1.ShoppingCartController, route);
        await this.initModule(AuthController_1.AuthController, route);
        await this.initModule(StatisticsController_1.StatisticsController, route);
    }
    async initSeeders(route) {
        route.get('/run-seeders', async (_, response) => {
            try {
                runSeeders_1.runSeeders();
                return response.json({ message: 'Database seeded successfully' });
            }
            catch (error) {
                console.error(error.message);
                return response.json({ message: error.message });
            }
        });
    }
    async initApiSummarize(route) {
        const swaggerDoc = yamljs_1.load(path_1.default.resolve(__dirname, 'doc', 'swagger.yml'));
        swaggerDoc.servers = swaggerDoc.servers.map((host) => {
            host.url = host.url.replace('HOST_ADDRESS_AND_PORT', `${app_config_1.default.serve.host}:${app_config_1.default.serve.port}`);
            return host;
        });
        route.use('/apidoc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
        route.get('/', (_, response) => {
            response.json({
                message: `Server is running on port ${app_config_1.default.serve.port}`
            });
        });
    }
    async initModule(ControllerClassName, route) {
        const controller = new ControllerClassName({
            route
        });
        await controller.init();
        this.application.use(route);
        logger_1.default.debug('Successfully loaded module ' + controller.constructor.name);
    }
    async initDatabase() {
        const db = new Db_1.Db();
        await db.init();
        logger_1.default.info('Successfully loaded Database');
    }
    initMiddlewares() {
        this.application.use(express_1.default.json());
        this.application.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.application.use(cors_1.default());
        this.application.use(helmet_1.default());
        logger_1.default.info('Successfully loaded Middlewares');
    }
    start() {
        this.application.listen(app_config_1.default.serve.port);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map