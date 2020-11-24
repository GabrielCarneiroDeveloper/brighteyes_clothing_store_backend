import { Router } from 'express'

import { DTOController } from './../../common/dto/DTOController'

import { IController } from './../../interfaces/IControllers'

import { EmployeeTitle } from './../../modules/employee_title/EmployeeTitle'
import { AbstractController } from '../abstract.controller'

export class EmployeeTitleController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.ModelClassName = EmployeeTitle
    this.route = route
  }

  async init(): Promise<void> {
    this.route.get('/employee-title', this.list)
    this.route.post('/employee-title', this.create)
    this.route.get('/employee-title/:id', this.listOneById)
    this.route.put('/employee-title/:id', this.update)
    this.route.delete('/employee-title/:id', this.remove)
  }
}
