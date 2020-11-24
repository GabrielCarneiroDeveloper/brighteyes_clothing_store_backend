import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'
import { getRepository } from 'typeorm'

import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'
import logger from '../logger/logger'

export class EmployeeClientStatusSeeder implements ISeeder<EmployeeClientStatus> {
  objectList: EmployeeClientStatus[]

  constructor() {
    const parsedObjects = objectFactory<EmployeeClientStatus>(this.data(), EmployeeClientStatus)
    this.objectList = [...parsedObjects]
  }

  data(): Omit<EmployeeClientStatus, 'id'>[] {
    return [
      {
        name: 'ACTIVATED'
      },
      {
        name: 'DEACTIVATED'
      }
    ]
  }

  async run(): Promise<void> {
    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(EmployeeClientStatus)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <EmployeeClientStatus data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
