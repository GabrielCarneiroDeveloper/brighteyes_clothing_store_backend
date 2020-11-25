"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const abstract_controller_1 = require("./../../modules/abstract.controller");
const typeorm_1 = require("typeorm");
const Client_1 = require("../client/Client");
const Clothes_1 = require("../clothes/Clothes");
const ClothesStatus_1 = require("../clothes_status/ClothesStatus");
const ClothesStatusEnum_1 = require("../clothes_status/ClothesStatusEnum");
const IEmployeeClientStatus_1 = require("../employee_client_status/IEmployeeClientStatus");
const ShoppingCart_1 = require("../shopping-cart/ShoppingCart");
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
var MonthEnum;
(function (MonthEnum) {
    MonthEnum["JAN"] = "Jan";
    MonthEnum["FEV"] = "Fev";
    MonthEnum["MAR"] = "Mar";
    MonthEnum["APR"] = "Apr";
    MonthEnum["MAY"] = "May";
    MonthEnum["JUN"] = "Jun";
    MonthEnum["JUL"] = "Jul";
    MonthEnum["AUG"] = "Aug";
    MonthEnum["SEP"] = "Sep";
    MonthEnum["OCT"] = "Oct";
    MonthEnum["NOV"] = "Nov";
    MonthEnum["DEC"] = "Dec";
})(MonthEnum || (MonthEnum = {}));
function getMonthEnumByMonthName(monthName) {
    switch (monthName) {
        case 'Jan':
            return MonthEnum.JAN;
        case 'Fev':
            return MonthEnum.FEV;
        case 'Mar':
            return MonthEnum.MAR;
        case 'Apr':
            return MonthEnum.APR;
        case 'May':
            return MonthEnum.MAY;
        case 'Jun':
            return MonthEnum.JUN;
        case 'Jul':
            return MonthEnum.JUL;
        case 'Aug':
            return MonthEnum.AUG;
        case 'Sep':
            return MonthEnum.SEP;
        case 'Oct':
            return MonthEnum.OCT;
        case 'Nov':
            return MonthEnum.NOV;
        case 'Dec':
            return MonthEnum.DEC;
    }
}
const getMonthNameByNumber = [
    'Jan',
    'Fev',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
async function worksheetFactory(worksheetName, data, fileName) {
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);
    const capitalize = (s) => {
        if (typeof s !== 'string')
            return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    const keys = Object.keys(data[0]);
    worksheet.columns = keys.map((k) => ({
        header: capitalize(k),
        key: k,
        width: k.length * 2
    }));
    data.forEach((d) => worksheet.addRow(d));
    const fullFileName = fileName + `${new Date().getMonth()}${new Date().getFullYear()}` + '.xlsx';
    const dest = path_1.default.resolve(__dirname, '..', '..', 'public', 'files', 'excel', fullFileName);
    await workbook.xlsx.writeFile(dest);
    console.log('File is written.');
    return dest;
}
class StatisticsController extends abstract_controller_1.AbstractController {
    constructor({ route }) {
        super();
        this.getClientListAsExcel = async (_, res) => {
            try {
                const clientRepo = typeorm_1.getRepository(Client_1.Client);
                const clientList = await clientRepo.find();
                const filePath = await worksheetFactory('Client list', clientList, 'clientList');
                return res.sendFile(filePath);
            }
            catch (error) {
                console.error(error.message);
                return res.status(401).json({ error_message: error.message });
            }
        };
        this.getStatistics = async (_, res) => {
            const clothes_availability_quantity = await this.getQuantityInStockAndOutOfStockClothes();
            const number_of_shopping_carts_created_current_month = await this.getHowManyShoppingCartWhereCreatedInCurrentMonth();
            const quantity_of_clients_registered_in_current_month = await this.getQuantityOfClientsRegisteredInCurrentMonth();
            const shopping_cart_rank = await this.getShoppingCartRanking();
            const client_registered_current_year_by_month = await this.getQuantityOfClientRegisteredByMonth();
            const client_availability_quantity = await this.getQuantityActivatedDeactivatedClients();
            const response = {
                data: {
                    number_of_shopping_carts_created_current_month,
                    clothes_availability_quantity,
                    quantity_of_clients_registered_in_current_month,
                    shopping_cart_rank,
                    client_registered_current_year_by_month,
                    client_availability_quantity
                }
            };
            return res.json(response);
        };
        this.filterCurrentYearClients = (client) => {
            const currentYear = new Date().getFullYear();
            return client.createdAt.getFullYear() === currentYear;
        };
        this.route = route;
    }
    async init() {
        this.route.get('/statistics', this.getStatistics);
        this.route.get('/statistics/clients-as-excel', this.getClientListAsExcel);
    }
    async getShoppingCartRanking() {
        return [
            {
                shoppingCartId: 1,
                value: 18
            },
            {
                shoppingCartId: 2,
                value: 17
            },
            {
                shoppingCartId: 3,
                value: 16
            }
        ];
    }
    async getQuantityOfClientsRegisteredInCurrentMonth() {
        const clientRepo = typeorm_1.getRepository(Client_1.Client);
        const clientList = await clientRepo.find();
        const currentDate = new Date();
        const currentMonthName = getMonthNameByNumber[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        let clientRegisteredCurrentMonth = 0;
        clientList.forEach((o) => {
            const monthName = getMonthNameByNumber[o.createdAt.getMonth()];
            if (monthName === currentMonthName && o.createdAt.getFullYear() === currentYear) {
                ++clientRegisteredCurrentMonth;
            }
        });
        return clientRegisteredCurrentMonth;
    }
    async getQuantityInStockAndOutOfStockClothes() {
        const clothesRepo = typeorm_1.getRepository(Clothes_1.Clothes);
        const clothesStatusRepo = typeorm_1.getRepository(ClothesStatus_1.ClothesStatus);
        const inStockStatus = await clothesStatusRepo.findOne({
            where: { name: ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK }
        });
        const outOfStockStatus = await clothesStatusRepo.findOne({
            where: { name: ClothesStatusEnum_1.ClothesStatusEnum.OUT_OF_STOCK }
        });
        const inStockCount = await clothesRepo.findAndCount({
            where: { status: inStockStatus },
            relations: ['status']
        });
        const outOfStockCount = await clothesRepo.findAndCount({
            where: { status: outOfStockStatus },
            relations: ['status']
        });
        return [
            {
                status: ClothesStatusEnum_1.ClothesStatusEnum.IN_STOCK,
                quantity: inStockCount[1]
            },
            {
                status: ClothesStatusEnum_1.ClothesStatusEnum.OUT_OF_STOCK,
                quantity: outOfStockCount[1]
            }
        ];
    }
    async getHowManyShoppingCartWhereCreatedInCurrentMonth() {
        const shoppingCartRepo = typeorm_1.getRepository(ShoppingCart_1.ShoppingCart);
        const shoppingCartList = await shoppingCartRepo.find();
        const currentDate = new Date();
        const currentMonthName = getMonthNameByNumber[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();
        let shoppingCartCreatedCurrentMonth = 0;
        shoppingCartList.forEach((o) => {
            const monthName = getMonthNameByNumber[o.createdAt.getMonth()];
            if (monthName === currentMonthName && o.createdAt.getFullYear() === currentYear) {
                ++shoppingCartCreatedCurrentMonth;
            }
        });
        return shoppingCartCreatedCurrentMonth;
    }
    async getQuantityOfClientRegisteredByMonth() {
        const QuantityClientsByMonth = [
            { name: MonthEnum.JAN, value: 0 },
            { name: MonthEnum.FEV, value: 0 },
            { name: MonthEnum.MAR, value: 0 },
            { name: MonthEnum.APR, value: 0 },
            { name: MonthEnum.MAY, value: 0 },
            { name: MonthEnum.JUN, value: 0 },
            { name: MonthEnum.JUL, value: 0 },
            { name: MonthEnum.AUG, value: 0 },
            { name: MonthEnum.SEP, value: 0 },
            { name: MonthEnum.OCT, value: 0 },
            { name: MonthEnum.NOV, value: 0 },
            { name: MonthEnum.DEC, value: 0 }
        ];
        const clientRepo = typeorm_1.getRepository(Client_1.Client);
        const currentYear = new Date().getFullYear();
        const currentYearClientList = (await clientRepo.find()).filter((i) => i.createdAt.getFullYear() === currentYear);
        currentYearClientList.map((client) => {
            const monthName = getMonthNameByNumber[client.createdAt.getMonth()];
            this.increaseClientNumberInMonth(QuantityClientsByMonth, monthName);
        });
        return {
            label: 'Quantity of clients',
            data: QuantityClientsByMonth
        };
    }
    async getQuantityActivatedDeactivatedClients() {
        const clientAvailabilityQuantity = [
            { status: IEmployeeClientStatus_1.EnumEmployeeClientStatus.ACTIVATED, quantity: 0 },
            { status: IEmployeeClientStatus_1.EnumEmployeeClientStatus.DEACTIVATED, quantity: 0 }
        ];
        const clientRepo = typeorm_1.getRepository(Client_1.Client);
        const currentYearClientList = (await clientRepo.find({ relations: ['status'] })).filter(this.filterCurrentYearClients);
        currentYearClientList.forEach((client) => this.increaseClientAvailabilityNumber(clientAvailabilityQuantity, client));
        return clientAvailabilityQuantity;
    }
    increaseClientAvailabilityNumber(quantityClientAvailability, client) {
        quantityClientAvailability.forEach((metrics) => {
            if (client.status.name === metrics.status.valueOf()) {
                ++metrics.quantity;
            }
        });
    }
    increaseClientNumberInMonth(QuantityClientsByMonth, month) {
        const monthEnum = getMonthEnumByMonthName(month);
        QuantityClientsByMonth.forEach((o) => {
            if (o.name === monthEnum)
                ++o.value;
        });
    }
}
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map