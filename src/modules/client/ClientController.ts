import { Router } from 'express'

import { Client } from './../../modules/client/Client'
import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'

export class ClientController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.route = route
    this.ModelClassName = Client
    this.findManyOptions = { relations: ['status'] }
    this.findOneOptions = { relations: ['status'] }
  }

  async init(): Promise<void> {
    this.route.get('/clients', this.list)
    this.route.post('/clients', this.create)
    this.route.get('/clients/:id', this.listOneById)
    this.route.put('/clients/:id', this.update)
    this.route.delete('/clients/:id', this.remove)
  }
}
