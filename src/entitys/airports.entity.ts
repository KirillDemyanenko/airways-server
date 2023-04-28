import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Airports extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ICAO: string | null;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;
}
