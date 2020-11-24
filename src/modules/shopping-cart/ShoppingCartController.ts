import { Request, Response, Router } from 'express'

import { IController } from './../../interfaces/IControllers'
import { DTOController } from './../../common/dto/DTOController'
import { AbstractController } from '../abstract.controller'
import { ShoppingCart } from './ShoppingCart'
import { getRepository } from 'typeorm'
import { Clothes } from '../clothes/Clothes'
import { ClothesStatusEnum } from '../clothes_status/ClothesStatusEnum'
import { ClothesStatus } from '../clothes_status/ClothesStatus'

export class ShoppingCartController extends AbstractController implements IController {
  route: Router

  constructor({ route }: DTOController) {
    super()
    this.route = route
    this.ModelClassName = ShoppingCart
    this.findManyOptions = { relations: ['status', 'client', 'cashier', 'seller', 'clothes'] }
    this.findOneOptions = { relations: ['status', 'client', 'cashier', 'seller', 'clothes'] }
  }

  async init(): Promise<void> {
    this.route.get('/shopping-cart', this.list)
    this.route.post('/shopping-cart', this.create)
    this.route.get('/shopping-cart/:id', this.listOneById)
    this.route.put('/shopping-cart/:id', this.update)
    this.route.delete('/shopping-cart/:id', this.remove)

    this.route.put('/shopping-cart/:id/add-clothes/:clothes_id', this.addClothes)
    this.route.put('/shopping-cart/:id/remove-clothes/:clothes_id', this.removeClothes)
  }

  addClothes = async (request: Request, response: Response): Promise<Response<any>> => {
    try {
      const id = request.params.id
      const clothesId = request.params.clothes_id
      const repository = getRepository(ShoppingCart)
      const clothesRepository = getRepository(Clothes)

      const foundObject = await repository.findOne(id, this.findOneOptions)
      if (!foundObject) {
        throw new Error('Object not found')
      }

      const foundClothes = await clothesRepository.findOneOrFail(clothesId, {
        relations: ['status']
      })
      const alreadyAdded = foundObject.clothes.some((c) => c.id === foundClothes.id)
      const clothesIsAvailable =
        foundClothes.quantityInStock > 0 && foundClothes.status.name === ClothesStatusEnum.IN_STOCK

      if (alreadyAdded) throw new Error('Clothes already included')
      if (!clothesIsAvailable) throw new Error('Clothes not available in stock')

      foundObject.clothes.push(foundClothes)
      foundClothes.quantityInStock = --foundClothes.quantityInStock
      await clothesRepository.save(foundClothes)
      const updatedObject = await repository.save(foundObject)
      return response.json(updatedObject)
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        message: 'an error occurred',
        error_message: error.message
      })
    }
  }

  removeClothes = async (request: Request, response: Response): Promise<Response<any>> => {
    try {
      const id = request.params.id
      const clothesId = parseInt(request.params.clothes_id)
      const repository = getRepository(ShoppingCart)
      const clothesRepository = getRepository(Clothes)
      const clothesStatusRepository = getRepository(ClothesStatus)

      const foundObject = await repository.findOne(id, this.findOneOptions)
      if (!foundObject) {
        throw new Error('Object not found')
      }

      const foundClothes = await clothesRepository.findOneOrFail(clothesId, {
        relations: ['status']
      })

      const inStockClothesStatus = await clothesStatusRepository.findOneOrFail({
        where: { name: ClothesStatusEnum.IN_STOCK }
      })

      const clothesIndexToBeRemoved = foundObject.clothes.findIndex(
        (clothes) => clothes.id === clothesId
      )

      if (clothesIndexToBeRemoved === -1) {
        throw new Error('Not found')
      }

      foundObject.clothes.splice(clothesIndexToBeRemoved, 1)
      foundClothes.quantityInStock = ++foundClothes.quantityInStock
      foundClothes.status = inStockClothesStatus

      await clothesRepository.save(foundClothes)
      const updatedObject = await repository.save(foundObject)
      return response.json(updatedObject)
    } catch (error) {
      console.error(error)
      return response.status(401).json({
        message: 'an error occurred',
        error_message: error.message
      })
    }
  }
}
