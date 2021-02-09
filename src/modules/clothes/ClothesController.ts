import { Request, Response, Router } from 'express'

import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'
import { Clothes } from './Clothes'

import { storage } from './../../common/storage/storage'
import { getRepository } from 'typeorm'

const upload = storage('clothes')

export class ClothesController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.route = route
    this.ModelClassName = Clothes
    this.findManyOptions = { relations: ['status'] }
    this.findOneOptions = { relations: ['status'] }
  }

  async init(): Promise<void> {
    this.route.get('/clothes', this.list)
    this.route.post('/clothes', this.create)
    this.route.get('/clothes/:id', this.listOneById)
    this.route.put('/clothes/:id', this.update)
    this.route.delete('/clothes/:id', this.remove)
    this.route.post('/clothes/upload', upload.single('image'), this.imagesUpload)
  }

  create = async (request: Request, response: Response): Promise<Response> => {
    try {
      const data = request.body
      const repository = getRepository(this.ModelClassName)

      const foundClothes = (await repository.findOne({ where: { name: data.name } })) as Clothes
      if (foundClothes) {
        throw new Error('Clothes already registered')
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

      const foundClothes = (await repository.findOne({ where: { name: data.name } })) as Clothes
      console.log(data.name)
      if (foundClothes) {
        throw new Error('Clothes already registered')
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

  imagesUpload = async (
    req: Request,
    res: Response
  ): Promise<Response<{ filename: string; success: boolean }>> => {
    try {
      if (!req.file) {
        console.log('No file is available!')
        return res.send({
          filename: '',
          success: false
        })
      } else {
        console.log('File is available!')
        return res.send({
          filename: req.file.filename,
          success: true
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(401).json(error.message)
    }
  }
}
