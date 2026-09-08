import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from '../../eventos/entities/evento.entity';

@Entity('asistentes')
export class Asistente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombreCompleto: string;

  @Column({ type: 'varchar', length: 100 })
  correo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  // TODO (Reto del estudiante): Agregar nuevo atributo solicitado en el examen (ej: codigoTicket, edad, etc.)

  @ManyToOne(() => Evento, (evento) => evento.asistentes, {
    onDelete: 'CASCADE',
  })
  evento: Evento;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
