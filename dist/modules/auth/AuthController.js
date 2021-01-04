"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const abstract_controller_1 = require("../abstract.controller");
const Employee_1 = require("../employee/Employee");
const Auth_1 = require("./Auth");
const app_config_1 = __importDefault(require("./../../config/app.config"));
const logger_1 = __importDefault(require("./../../common/logger/logger"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const IEmployeeClientStatus_1 = require("./../employee_client_status/IEmployeeClientStatus");
class AuthController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.signIn = async (request, response) => {
            try {
                const { email, password } = request.body;
                if (!email || !password) {
                    throw new Error('Request invalid');
                }
                logger_1.default.debug('Sign in email ' + email);
                const foundEmployee = await this.employeeRepository.findOneOrFail({ where: { email } });
                const passwordsMatch = await bcrypt_1.default.compare(password, foundEmployee.password);
                if (!passwordsMatch) {
                    throw new Error('Password is invalid to email ' + email);
                }
                if (foundEmployee.status.name === IEmployeeClientStatus_1.EnumEmployeeClientStatus.DEACTIVATED) {
                    throw new Error('Employee is unauthorized to login');
                }
                logger_1.default.debug(`Successfully signed ${email} in`);
                const accessToken = this.createToken(foundEmployee);
                response.setHeader('Set-Cookie', [this.createCookie(accessToken)]);
                return response.json(accessToken);
            }
            catch (error) {
                logger_1.default.error(error.message);
                return response.status(401).json({ message: error.message });
            }
        };
        this.verify = async (request, response) => {
            try {
                const accessToken = request.headers.authorization;
                logger_1.default.debug(`Verifing access token= ${accessToken}`);
                if (!accessToken) {
                    throw new Error('Access token not provided');
                }
                const decodedToken = this.decodeToken(accessToken);
                this.checkIfTokenIsValid(decodedToken);
                return response.json({ message: 'The access is still valid' });
            }
            catch (error) {
                logger_1.default.error(error.message);
                return response.status(401).json({ message: error.message });
            }
        };
        this.signOut = async (request, response) => {
            try {
                const accessToken = this.getFromHeaders(request, 'authorization');
                const decodedToken = this.decodeToken(accessToken);
                this.checkIfTokenIsValid(decodedToken);
                decodedToken.isValid = false;
                decodedToken.email = '';
                decodedToken.username = '';
                return response.json({ message: 'User logged out successfully' });
            }
            catch (error) {
                logger_1.default.error(error.message);
                return response.status(401).json({ message: error.message });
            }
        };
        this.route = route;
        this.ModelClassName = Auth_1.Auth;
        this.employeeRepository = typeorm_1.getRepository(Employee_1.Employee);
    }
    async init() {
        this.route.post('/auth/sign-in', this.signIn);
        this.route.get('/auth/sign-out', this.signOut);
        this.route.get('/auth/verify', this.verify);
    }
    createToken(employee) {
        const expiresIn = 60 * 60;
        const dataStokenInToken = {
            username: employee.name,
            email: employee.email,
            isValid: true,
            title: employee.title.name,
            id: employee.id
        };
        return {
            expiresIn,
            token: jsonwebtoken_1.default.sign(dataStokenInToken, app_config_1.default.jwtSecretkey, { expiresIn })
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    checkIfTokenIsValid(decodedToken) {
        if (!decodedToken.isValid)
            throw new Error('Token is invalid');
        logger_1.default.debug('Token is valid');
        return decodedToken.isValid;
    }
    decodeToken(accessToken) {
        return jsonwebtoken_1.default.verify(accessToken, app_config_1.default.jwtSecretkey);
    }
    getFromHeaders(request, param) {
        const requestedParam = request.headers[param];
        if (!requestedParam)
            throw new Error('Parameter ' + requestedParam + ' not provided');
        return requestedParam;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map