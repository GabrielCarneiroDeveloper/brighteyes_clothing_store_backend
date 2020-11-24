import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('employee_title')
export class EmployeeTitle {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
