import { getRepository } from 'typeorm'

import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'

import { Clothes } from './../../modules/clothes/Clothes'
import { ClothesStatus } from './../../modules/clothes_status/ClothesStatus'

import { Employee } from './../../modules/employee/Employee'
import { EmployeeTitle } from './../../modules/employee_title/EmployeeTitle'
import { ClothesStatusEnum } from './../../modules/clothes_status/ClothesStatusEnum'
import logger from '../logger/logger'

export class ClothesSeeder implements ISeeder<Clothes> {
  objectList: Clothes[]

  async data(): Promise<Omit<Clothes, 'id'>[]> {
    const clothesStatusInStock = await getRepository(ClothesStatus).findOneOrFail({
      where: { name: ClothesStatusEnum.IN_STOCK }
    })
    const employeeWarehouse = await getRepository(Employee).findOneOrFail({
      where: {
        title: await getRepository(EmployeeTitle).findOneOrFail({ where: { name: 'Warehouse' } })
      }
    })
    return [
      {
        name: 'Dress',
        price: 2.9,
        quantityInStock: 2,
        status: clothesStatusInStock,
        photo:
          'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
      },
      {
        name: 'Jeans',
        price: 14.78,
        quantityInStock: 5,
        status: clothesStatusInStock,
        photo:
          'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  }

  async run(): Promise<void> {
    const data = await this.data()

    const parsedObjects = objectFactory<Clothes>(data, Clothes)
    this.objectList = [...parsedObjects]

    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(Clothes)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <Clothes data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
