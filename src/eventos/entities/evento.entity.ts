import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asistente } from '../../asistentes/entities/asistente.entity';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  cupoMaximo: number;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVO' })
  estado: string;

  @OneToMany(() => Asistente, (asistente) => asistente.evento)
  asistentes: Asistente[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
