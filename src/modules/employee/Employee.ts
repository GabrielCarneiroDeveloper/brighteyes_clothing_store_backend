import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'
import { EmployeeTitle } from '../employee_title/EmployeeTitle'

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => EmployeeTitle, (employeeTitle) => employeeTitle.id, {
    eager: true
  })
  @JoinColumn({ name: 'employee_title_id' })
  title: EmployeeTitle

  @ManyToOne(() => EmployeeClientStatus, (employeeClientStatus) => employeeClientStatus.name, {
    eager: true
  })
  @JoinColumn({ name: 'employee_status_id' })
  status: EmployeeClientStatus

  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_hr_id' })
  registeredBy: Employee

  @Column()
  name: string

  @Column()
  birthdate: string

  @Column()
  password: string

  @Column()
  email: string
}
