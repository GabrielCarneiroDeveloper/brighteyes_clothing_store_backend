import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ClothesStatus {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
