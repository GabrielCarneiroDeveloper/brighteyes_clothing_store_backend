import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'
import { ClothesStatus } from './../../modules/clothes_status/ClothesStatus'
import { getRepository } from 'typeorm'
import { ClothesStatusEnum } from './../../modules/clothes_status/ClothesStatusEnum'
import logger from '../logger/logger'

export class ClothesStatusSeeder implements ISeeder<ClothesStatus> {
  objectList: ClothesStatus[]

  constructor() {
    const parsedObjects = objectFactory<ClothesStatus>(this.data(), ClothesStatus)
    this.objectList = [...parsedObjects]
  }

  data(): Omit<ClothesStatus, 'id'>[] {
    return [
      {
        name: ClothesStatusEnum.OUT_OF_STOCK
      },
      {
        name: ClothesStatusEnum.IN_STOCK
      }
    ]
  }

  async run(): Promise<void> {
    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(ClothesStatus)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <ClothesStatus data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
