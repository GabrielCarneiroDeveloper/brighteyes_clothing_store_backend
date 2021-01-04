"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFactory = void 0;
function objectFactory(dataList, DestinationConstructor) {
    return dataList.map((data) => Object.assign(new DestinationConstructor(), data));
}
exports.objectFactory = objectFactory;
//# sourceMappingURL=objectFactory.js.map