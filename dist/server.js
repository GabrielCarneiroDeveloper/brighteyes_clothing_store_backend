"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = require("./app");
(async function () {
    const app = new app_1.App();
    await app.init();
    app.start();
})();
//# sourceMappingURL=server.js.map