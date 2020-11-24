import path from 'path'
import { Connection, createConnection } from 'typeorm'

import { IDb } from './../../common/database/IDb'
import logger from '../logger/logger'
import { Employee } from './../../modules/employee/Employee'
import { Client } from './../../modules/client/Client'
import { Clothes } from './../../modules/clothes/Clothes'
import { ClothesStatus } from './../../modules/clothes_status/ClothesStatus'
import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'
import { EmployeeTitle } from './../../modules/employee_title/EmployeeTitle'
import { ShoppingCart } from './../../modules/shopping-cart/ShoppingCart'
import { ShoppingCartStatus } from './../../modules/shopping_cart_status/ShoppingCartStatus'

export class Db implements IDb {
  private instance: Connection

  async init(): Promise<void> {
    try {
      this.instance = await createConnection({
        synchronize: true,
        logging: false,
        type: 'sqlite',
        database: path.join(__dirname, '..', '..', '..', 'data', 'data.db'),
        entities: [
          Employee,
          Client,
          Clothes,
          ClothesStatus,
          Employee,
          EmployeeClientStatus,
          EmployeeTitle,
          ShoppingCart,
          ShoppingCartStatus
        ]
      })
    } catch (error) {
      logger.error('Error at try to connect in database...')
      throw error
    }
  }

  getInstance(): Connection {
    return this.instance
  }
}
