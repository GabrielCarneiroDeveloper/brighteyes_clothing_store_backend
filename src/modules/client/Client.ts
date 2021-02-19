import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { EmployeeClientStatus } from './../../modules/employee_client_status/EmployeeClientStatus'

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  address: string

  @Column({ unique: true })
  cpf: string

  @Column()
  birthdate: string

  @ManyToOne(() => EmployeeClientStatus)
  @JoinColumn({ name: 'client_status_id' })
  status: EmployeeClientStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
