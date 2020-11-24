import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'
import { getRepository } from 'typeorm'
import { Client } from './../../modules/client/Client'
import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'
import logger from '../logger/logger'

export class ClientSeeder implements ISeeder<Client> {
  objectList: Client[]

  data(): Omit<Client, 'id' | 'status'>[] {
    return [
      {
        name: 'Client 1',
        address: 'Rua asdf, 123 - AEdasdfsd, asdfasdf',
        birthdate: new Date('10/14/1987').toISOString(),
        cpf: '123.123.123-13',
        createdAt: new Date()
      }
    ]
  }

  async run(): Promise<void> {
    const statusRepository = getRepository(EmployeeClientStatus)

    const status = await statusRepository.findOne({ where: { name: 'ACTIVATED' } })
    if (!status) {
      throw new Error('Status ACTIVATED not found in database')
    }
    const data = this.data().map((d) => ({ ...d, status: status }))

    const parsedObjects = objectFactory<Client>(data, Client)
    this.objectList = [...parsedObjects]

    logger.debug(`Running seeder ${this.constructor.name}`)
    const repository = getRepository(Client)
    this.objectList.forEach(async (o) => {
      const found = await repository.findOne({ where: { name: o.name } })
      if (!found) {
        await repository.save(o)
        logger.debug(`Saved model <Client data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
