import { Router } from 'express'

import { DTOController } from './../../common/dto/DTOController'
import { IController } from './../../interfaces/IControllers'
import { AbstractController } from '../abstract.controller'
import { EmployeeClientStatus } from './EmployeeClientStatus'

export class EmployeeClientStatusController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.ModelClassName = EmployeeClientStatus
    this.route = route
  }

  async init(): Promise<void> {
    this.route.get('/employee-client-status', this.list)
    this.route.post('/employee-client-status', this.create)
    this.route.get('/employee-client-status/:id', this.listOneById)
    this.route.put('/employee-client-status/:id', this.update)
    this.route.delete('/employee-client-status/:id', this.remove)
  }
}
