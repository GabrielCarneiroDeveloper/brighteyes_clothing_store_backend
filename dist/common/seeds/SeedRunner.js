"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRunner = void 0;
class SeedRunner {
    constructor() {
        this.seeders = [];
    }
    addSedder(seeder) {
        this.seeders.push(seeder);
    }
    start() {
        try {
            this.seeders.forEach(async (seeder) => await seeder.run());
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }
}
exports.SeedRunner = SeedRunner;
//# sourceMappingURL=SeedRunner.js.map