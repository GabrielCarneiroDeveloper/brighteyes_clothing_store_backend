import { getRepository } from 'typeorm'

import { EmployeeTitle } from '../../modules/employee_title/EmployeeTitle'
import { objectFactory } from './objectFactory'
import { ISeeder } from './ISeeder'
import logger from '../logger/logger'

export class EmployeeTitleSeeder implements ISeeder<EmployeeTitle> {
  objectList: EmployeeTitle[]

  constructor() {
    const parsedObjects = objectFactory<EmployeeTitle>(this.data(), EmployeeTitle)
    this.objectList = [...parsedObjects]
  }

  data(): Omit<EmployeeTitle, 'id'>[] {
    return [
      {
        name: 'Warehouse'
      },
      {
        name: 'Human Resource'
      },
      {
        name: 'Customer Service'
      },
      {
        name: 'Seller'
      },
      {
        name: 'Cashier'
      },
      {
        name: 'Admin'
      }
    ]
  }

  async run(): Promise<void> {
    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(EmployeeTitle)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <EmployeeTitle data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
