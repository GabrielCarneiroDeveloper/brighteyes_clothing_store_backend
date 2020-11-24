import { Router } from 'express'

import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'
import { ClothesStatus } from './ClothesStatus'

export class ClothesStatusController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.route = route
    this.ModelClassName = ClothesStatus
  }

  async init(): Promise<void> {
    this.route.get('/clothes-status', this.list)
    this.route.post('/clothes-status', this.create)
    this.route.get('/clothes-status/:id', this.listOneById)
    this.route.put('/clothes-status/:id', this.update)
    this.route.delete('/clothes-status/:id', this.remove)
  }
}
