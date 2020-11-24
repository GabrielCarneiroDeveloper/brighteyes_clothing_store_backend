import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('employee_client_status')
export class EmployeeClientStatus {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
