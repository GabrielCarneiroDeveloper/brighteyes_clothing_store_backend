import { Request, Response, Router } from 'express'

import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'
import { Clothes } from './Clothes'

import { storage } from './../../common/storage/storage'

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
