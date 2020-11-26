"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeders = void 0;
const SeedRunner_1 = require("./SeedRunner");
const ClothesStatusSeeder_1 = require("./ClothesStatusSeeder");
const EmployeeClientStatusSeeder_1 = require("./EmployeeClientStatusSeeder");
const ShoppingCartStatusSeeder_1 = require("./ShoppingCartStatusSeeder");
const EmployeeTitleSeeder_1 = require("./EmployeeTitleSeeder");
const ClientSeeder_1 = require("./ClientSeeder");
const EmployeeSeeder_1 = require("./EmployeeSeeder");
const ClothesSeeder_1 = require("./ClothesSeeder");
const ShoppingCartSeeder_1 = require("./ShoppingCartSeeder");
async function runSeeders() {
    const seedRunner = new SeedRunner_1.SeedRunner();
    const clothesStatusSeeder = new ClothesStatusSeeder_1.ClothesStatusSeeder();
    const employeeClientStatusSeeder = new EmployeeClientStatusSeeder_1.EmployeeClientStatusSeeder();
    const shoppingCartStatusSeeder = new ShoppingCartStatusSeeder_1.ShoppingCartStatusSeeder();
    const employeeTitleSeeder = new EmployeeTitleSeeder_1.EmployeeTitleSeeder();
    const clientSeeder = new ClientSeeder_1.ClientSeeder();
    const employeeSeeder = new EmployeeSeeder_1.EmployeeSeeder();
    const clothesSeeder = new ClothesSeeder_1.ClothesSeeder();
    const shoppingCartSeeder = new ShoppingCartSeeder_1.ShoppingCartSeeder();
    seedRunner.addSedder(clothesStatusSeeder);
    seedRunner.addSedder(employeeClientStatusSeeder);
    seedRunner.addSedder(shoppingCartStatusSeeder);
    seedRunner.addSedder(employeeTitleSeeder);
    seedRunner.addSedder(clientSeeder);
    seedRunner.addSedder(employeeSeeder);
    seedRunner.addSedder(clothesSeeder);
    seedRunner.addSedder(shoppingCartSeeder);
    let count = 0;
    while (count < 5) {
        const p = new Promise((resolve) => {
            setTimeout(() => {
                resolve(seedRunner.start());
            }, 2000);
        });
        await p;
        count++;
    }
}
exports.runSeeders = runSeeders;
//# sourceMappingURL=runSeeders.js.map