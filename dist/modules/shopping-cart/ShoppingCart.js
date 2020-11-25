"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingCart = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("../employee/Employee");
const Client_1 = require("../client/Client");
const ShoppingCartStatus_1 = require("../shopping_cart_status/ShoppingCartStatus");
const Clothes_1 = require("../clothes/Clothes");
let ShoppingCart = class ShoppingCart {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ShoppingCart.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Client_1.Client),
    typeorm_1.JoinColumn({ name: 'client_id' }),
    __metadata("design:type", Client_1.Client)
], ShoppingCart.prototype, "client", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Employee_1.Employee),
    typeorm_1.JoinColumn({ name: 'cashier_id' }),
    __metadata("design:type", Employee_1.Employee)
], ShoppingCart.prototype, "cashier", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Employee_1.Employee),
    typeorm_1.JoinColumn({ name: 'seller_id' }),
    __metadata("design:type", Employee_1.Employee)
], ShoppingCart.prototype, "seller", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ShoppingCartStatus_1.ShoppingCartStatus),
    typeorm_1.JoinColumn({ name: 'shopping_cart_status_id' }),
    __metadata("design:type", ShoppingCartStatus_1.ShoppingCartStatus)
], ShoppingCart.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Clothes_1.Clothes),
    typeorm_1.JoinTable({ name: 'shopping_cart_clothes' }),
    __metadata("design:type", Array)
], ShoppingCart.prototype, "clothes", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ShoppingCart.prototype, "updatedAt", void 0);
ShoppingCart = __decorate([
    typeorm_1.Entity()
], ShoppingCart);
exports.ShoppingCart = ShoppingCart;
//# sourceMappingURL=ShoppingCart.js.map