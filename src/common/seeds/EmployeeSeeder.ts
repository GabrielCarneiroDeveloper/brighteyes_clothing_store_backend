import { ISeeder } from './ISeeder'

import { objectFactory } from './objectFactory'
import { getRepository } from 'typeorm'
import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'
import { Employee } from './../../modules/employee/Employee'
import { EmployeeTitle } from './../../modules/employee_title/EmployeeTitle'
import logger from '../logger/logger'
import { dateFormatter } from '../formatDate'

const PASSWORD_DEFAULT = '$2b$10$1PeKVUoMMAKR.pKrQN046OxrAb.aSfZbYROl2NNY.ZbUKVZcjfmg6' // senha123

type HrReturn = Pick<Employee, 'title' | 'status' | 'name' | 'birthdate' | 'password' | 'email'>

export class EmployeeSeeder implements ISeeder<Employee> {
  objectList: Employee[]

  async createHrEmployee(): Promise<HrReturn> {
    const employeeTitleRepository = getRepository(EmployeeTitle)
    const statusRepository = getRepository(EmployeeClientStatus)
    const employeeRepository = getRepository(Employee)
    const humanResourceTitle = await employeeTitleRepository.findOne({
      where: { name: 'Human Resource' }
    })
    const activatedStatus = await statusRepository.findOne({ where: { name: 'ACTIVATED' } })

    if (!humanResourceTitle || !activatedStatus) {
      throw new Error('Required data not found in database to the function "hrEmployee()"')
    }

    const hrEmployee: Omit<Employee, 'id' | 'registeredBy'> = {
      name: 'Employee 1',
      birthdate: dateFormatter(new Date('10/14/1987')),
      password: PASSWORD_DEFAULT,
      title: humanResourceTitle,
      status: activatedStatus,
      email: 'hr@brighteyes.com'
    }

    try {
      const found = await employeeRepository.findOne({ where: { name: 'Employee 1' } })
      if (!found) {
        await employeeRepository.save(hrEmployee)
      }
      logger.debug('HR employee firstly created successfully')
      return hrEmployee
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  data(): Omit<Employee, 'id' | 'status' | 'registeredBy' | 'title'>[] {
    return [
      {
        name: 'Employee 2',
        birthdate: dateFormatter(new Date('10/14/1987')),
        password: PASSWORD_DEFAULT,
        email: 'warehouse@brighteyes.com'
      },
      {
        name: 'Employee 3',
        birthdate: dateFormatter(new Date('10/14/1987')),
        password: PASSWORD_DEFAULT,
        email: 'customerservice@brighteyes.com'
      },
      {
        name: 'Employee 4',
        birthdate: dateFormatter(new Date('10/14/1987')),
        password: PASSWORD_DEFAULT,
        email: 'seller@brighteyes.com'
      },
      {
        name: 'Employee 5',
        birthdate: dateFormatter(new Date('10/14/1987')),
        password: PASSWORD_DEFAULT,
        email: 'cashier@brighteyes.com'
      },
      {
        name: 'Admin',
        birthdate: dateFormatter(new Date('10/14/1987')),
        password: PASSWORD_DEFAULT,
        email: 'admin@brighteyes.com'
      }
    ]
  }

  async run(): Promise<void> {
    await this.createHrEmployee()

    const statusRepository = getRepository(EmployeeClientStatus)
    const employeeTitleRepository = getRepository(EmployeeTitle)
    const employeeRepository = getRepository(Employee)

    const activatedStatus = await statusRepository.findOne({ where: { name: 'ACTIVATED' } })
    const deactivatedStatus = await statusRepository.findOne({ where: { name: 'DEACTIVATED' } })

    const warehouseTitle = await employeeTitleRepository.findOne({ where: { name: 'Warehouse' } })
    const customerServiceTitle = await employeeTitleRepository.findOne({
      where: { name: 'Customer Service' }
    })
    const sellerTitle = await employeeTitleRepository.findOne({ where: { name: 'Seller' } })
    const cashierTitle = await employeeTitleRepository.findOne({ where: { name: 'Cashier' } })
    const adminTitle = await employeeTitleRepository.findOne({ where: { name: 'Admin' } })

    const hrEmployee = await employeeRepository.findOne({
      where: { name: 'Employee 1' }
    })

    if (
      !activatedStatus ||
      !deactivatedStatus ||
      !warehouseTitle ||
      !customerServiceTitle ||
      !sellerTitle ||
      !cashierTitle ||
      !adminTitle ||
      !hrEmployee
    ) {
      throw new Error('Required data not found in database')
    }

    const data = this.data()
    const d1 = Object.assign(data[0], {
      ...data[0],
      registeredBy: hrEmployee,
      title: warehouseTitle,
      status: activatedStatus
    })
    const d2 = Object.assign(data[1], {
      ...data[1],
      registeredBy: hrEmployee,
      title: customerServiceTitle,
      status: activatedStatus
    })
    const d3 = Object.assign(data[2], {
      ...data[2],
      registeredBy: hrEmployee,
      title: sellerTitle,
      status: activatedStatus
    })
    const d4 = Object.assign(data[3], {
      ...data[3],
      registeredBy: hrEmployee,
      title: cashierTitle,
      status: activatedStatus
    })

    const d5 = Object.assign(data[4], {
      ...data[4],
      registeredBy: hrEmployee,
      title: adminTitle,
      status: activatedStatus
    })

    const listOfData = [d1, d2, d3, d4, d5]

    const parsedObjects = objectFactory<Employee>(listOfData, Employee)
    this.objectList = [...parsedObjects]

    logger.debug(`Running seeder ${this.constructor.name}`)

    this.objectList.forEach(async (o) => {
      const found = await employeeRepository.findOne({ where: { name: o.name } })
      if (!found) {
        await employeeRepository.save(o)
        logger.debug(`Saved model <Employee data=${JSON.stringify(o)}>`)
      }
    })
    logger.debug(`Ran succesfully the Seeder ${this.constructor.name}`)
  }
}
