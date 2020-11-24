import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ShoppingCartStatus {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
