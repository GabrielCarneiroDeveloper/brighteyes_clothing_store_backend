import { getRepository } from 'typeorm'

import { ISeeder } from './ISeeder'
import { objectFactory } from './objectFactory'
import { ShoppingCartStatus } from './../../modules/shopping_cart_status/ShoppingCartStatus'
import logger from '../logger/logger'

export class ShoppingCartStatusSeeder implements ISeeder<ShoppingCartStatus> {
  objectList: ShoppingCartStatus[]

  constructor() {
    const parsedObjects = objectFactory<ShoppingCartStatus>(this.data(), ShoppingCartStatus)
    this.objectList = [...parsedObjects]
  }

  data(): Omit<ShoppingCartStatus, 'id'>[] {
    return [
      {
        name: 'IN PROGRESS'
      },
      {
        name: 'CANCELED'
      },
      {
        name: 'FINISHED'
      }
    ]
  }

  async run(): Promise<void> {
    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(ShoppingCartStatus)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <ShoppingCartStatus data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
