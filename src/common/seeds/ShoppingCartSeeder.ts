import { getRepository } from 'typeorm'

import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'

import { ShoppingCart } from './../../modules/shopping-cart/ShoppingCart'

import { Employee } from '../../modules/employee/Employee'
import { EmployeeTitle } from '../../modules/employee_title/EmployeeTitle'
import { EmployeeTitleEnum } from './../../modules/employee_title/EmployeeTitleEnum'
import { Client } from './../../modules/client/Client'
import { ShoppingCartStatus } from './../../modules/shopping_cart_status/ShoppingCartStatus'
import { ShoppingCartEnum } from './../../modules/shopping_cart_status/ShoppingCartEnum'
import { Clothes } from './../../modules/clothes/Clothes'
import logger from '../logger/logger'

// TODO: NAO ESTÁ RODANDO!!!!
export class ShoppingCartSeeder implements ISeeder<ShoppingCart> {
  objectList: ShoppingCart[]

  async data(): Promise<ShoppingCart[]> {
    const seller = await getRepository(Employee).findOneOrFail({
      where: {
        title: await getRepository(EmployeeTitle).findOneOrFail({
          where: { name: EmployeeTitleEnum.WAREHOUSE }
        })
      }
    })
    const cashier = await getRepository(Employee).findOneOrFail({
      where: {
        title: await getRepository(EmployeeTitle).findOneOrFail({
          where: { name: EmployeeTitleEnum.CASHIER }
        })
      }
    })
    const status = await getRepository(ShoppingCartStatus).findOneOrFail({
      where: {
        name: ShoppingCartEnum.IN_PROGRESS
      }
    })
    const clothes = await getRepository(Clothes).findOneOrFail()
    const client = await getRepository(Client).findOneOrFail()
    return [
      {
        id: 1,
        clothes: [clothes],
        status,
        client,
        cashier,
        seller,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  async run(): Promise<void> {
    const data = await this.data()

    const parsedObjects = objectFactory<ShoppingCart>(data, ShoppingCart)
    this.objectList = [...parsedObjects]

    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(ShoppingCart)
    this.objectList.forEach(async (o) => {
      if (!(await getRepository(ShoppingCart).findOne(o.id))) {
        await repository.save(o)
        logger.debug(`Saved model <ShoppingCart data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
