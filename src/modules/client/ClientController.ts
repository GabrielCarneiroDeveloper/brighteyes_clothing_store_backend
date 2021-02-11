import { Request, Response, Router } from 'express'

import { Client } from './../../modules/client/Client'
import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'
import { getRepository } from 'typeorm'

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

  create = async (request: Request, response: Response): Promise<Response> => {
    try {
      const data = request.body
      const repository = getRepository(this.ModelClassName)

      const clientFound = await repository.findOne({ where: { cpf: data.cpf } })
      if (clientFound) {
        throw new Error('Client already exists')
      }

      const createdObject = await repository.save(data, this.saveOptions)
      return response.json({
        message: 'Object created',
        data: createdObject
      })
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        message: 'An error occurred',
        error_message: error.message
      })
    }
  }

  update = async (request: Request, response: Response): Promise<Response> => {
    try {
      const data = request.body
      const id = request.params.id
      const repository = getRepository(this.ModelClassName)

      const clientFound = (await repository.findOne({ where: { cpf: data.cpf } })) as Client
      if (clientFound && clientFound.name !== data.name) {
        throw new Error('Client already exists')
      }

      await repository.update(id, data)
      const updateObject = await repository.findOneOrFail(id, this.findOneOptions)
      return response.json({
        message: 'Object updated',
        data: updateObject
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
