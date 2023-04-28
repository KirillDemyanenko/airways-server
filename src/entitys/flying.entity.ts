import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { TypeOfFlight } from '../constants';

@Entity()
export class Flying extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: TypeOfFlight;

  @Column()
  destinationFrom: string;

  @Column()
  destinationTo: string;

  @Column()
  departureDate: Date;

  @Column()
  returnDate?: Date | null;

  @Column()
  costUSD: number;

  @Column({ nullable: true })
  freePlace: number;
}
