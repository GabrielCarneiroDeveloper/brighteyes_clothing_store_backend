import { getRepository } from 'typeorm'
import { EmployeeTitle } from '../employee_title/EmployeeTitle'
import { Employee } from './Employee'
import { EmployeeCreateDTO } from './EmployeeDTO'
import bcrypt from 'bcrypt'
import { EmployeeClientStatus } from '../employee_client_status/EmployeeClientStatus'

export class EmployeeFactory {
  buildWithCreateDTO = async (data: EmployeeCreateDTO): Promise<Employee> => {
    const employeeRepository = getRepository(Employee)
    const employeeTitleRepository = getRepository(EmployeeTitle)
    const employeeStatusRepository = getRepository(EmployeeClientStatus)
    const amountOfSaltRounds = 10

    const employee = new Employee()
    employee.name = data.name
    employee.email = data.email
    // employee.photo = data.photo

    employee.birthdate = data.birthdate
    employee.password = await bcrypt.hash(data.password, amountOfSaltRounds)
    employee.registeredBy = await employeeRepository.findOneOrFail(data.registeredBy)
    employee.status = await employeeStatusRepository.findOneOrFail(data.status)
    employee.title = await employeeTitleRepository.findOneOrFail(data.title)
    return employee
  }
}
