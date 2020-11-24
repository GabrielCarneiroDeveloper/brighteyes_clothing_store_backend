import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { ClothesStatus } from '../clothes_status/ClothesStatus'
import { Employee } from '../employee/Employee'

@Entity()
export class Clothes {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ClothesStatus)
  @JoinColumn({ name: 'clothes_status_id' })
  status: ClothesStatus

  @Column()
  name: string

  @Column()
  price: number

  @Column()
  photo: string

  @Column({ default: 0, name: 'quantity_in_stock' })
  quantityInStock: number
}
