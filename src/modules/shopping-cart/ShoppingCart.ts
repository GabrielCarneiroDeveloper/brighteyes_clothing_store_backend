import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import { Employee } from '../employee/Employee'
import { Client } from '../client/Client'
import { ShoppingCartStatus } from '../shopping_cart_status/ShoppingCartStatus'
import { Clothes } from '../clothes/Clothes'

@Entity()
export class ShoppingCart {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'cashier_id' })
  cashier: Employee

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'seller_id' })
  seller: Employee

  @ManyToOne(() => ShoppingCartStatus)
  @JoinColumn({ name: 'shopping_cart_status_id' })
  status: ShoppingCartStatus

  @ManyToMany(() => Clothes)
  @JoinTable({ name: 'shopping_cart_clothes' })
  clothes: Clothes[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
