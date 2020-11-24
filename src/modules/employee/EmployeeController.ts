import { getRepository } from 'typeorm'
import { Request, Response, Router } from 'express'

import { DTOController } from './../../common/dto/DTOController'
import { IController } from './../../interfaces/IControllers'
import { AbstractController } from './../../modules/abstract.controller'
import { Employee } from './../../modules/employee/Employee'
import { EmployeeCreateDTO } from './EmployeeDTO'
import { EmployeeFactory } from './EmployeeFactory'

export class EmployeeController extends AbstractController implements IController {
  route: Router
  factory: EmployeeFactory

  constructor({ route }: DTOController) {
    super()
    this.ModelClassName = Employee
    this.route = route
    this.findManyOptions = { relations: ['title', 'status', 'registeredBy'] }
    this.findOneOptions = { relations: ['title', 'status', 'registeredBy'] }
    this.factory = new EmployeeFactory()
  }

  async init(): Promise<void> {
    this.route.get('/employees', this.list)
    this.route.post('/employees', this.create)
    this.route.get('/employees/:id', this.listOneById)
    this.route.put('/employees/:id', this.update)
    this.route.delete('/employees/:id', this.remove)
  }

  create = async (request: Request, response: Response): Promise<Response> => {
    try {
      const data = request.body as EmployeeCreateDTO
      const repository = getRepository(Employee)
      const employeeData = await this.factory.buildWithCreateDTO(data)
      const foundEmployee = await repository.findOne({ where: { email: data.email } })
      if (foundEmployee) {
        throw new Error('Employee already exists')
      }

      const createdObject = await repository.save(employeeData, this.saveOptions)
      return response.json({
        message: 'Employee created',
        data: {
          id: createdObject.id,
          name: createdObject.name,
          email: createdObject.email,
          title: createdObject.title,
          status: createdObject.status
        }
      })
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        message: 'An error occurred',
        error_message: error.message
      })
    }
  }
}
