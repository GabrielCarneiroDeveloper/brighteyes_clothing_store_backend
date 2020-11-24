import { Router } from 'express'

import { ShoppingCartStatus } from './../../modules/shopping_cart_status/ShoppingCartStatus'
import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'

export class ShoppingCartStatusController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.route = route
    this.ModelClassName = ShoppingCartStatus
  }

  async init(): Promise<void> {
    this.route.get('/shopping-cart-status', this.list)
    this.route.post('/shopping-cart-status', this.create)
    this.route.get('/shopping-cart-status/:id', this.listOneById)
    this.route.put('/shopping-cart-status/:id', this.update)
    this.route.delete('/shopping-cart-status/:id', this.remove)
  }
}
