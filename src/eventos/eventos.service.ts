import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async create(createEventoDto: CreateEventoDto) {
    const existe = await this.eventoRepository.findOne({
      where: { titulo: createEventoDto.titulo },
    });

    if (existe) {
      throw new ConflictException(
        `El evento con el título "${createEventoDto.titulo}" ya existe`,
      );
    }

    const evento = this.eventoRepository.create(createEventoDto);
    const guardado = await this.eventoRepository.save(evento);

    return {
      message: 'Evento creado exitosamente',
      data: guardado,
    };
  }

  async findAll(): Promise<Evento[]> {
    return await this.eventoRepository.find({
      relations: { asistentes: true },
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: { asistentes: true },
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    const evento = await this.findOne(id);

    if (updateEventoDto.titulo && updateEventoDto.titulo !== evento.titulo) {
      const existe = await this.eventoRepository.findOne({
        where: { titulo: updateEventoDto.titulo },
      });

      if (existe) {
        throw new ConflictException(
          `El evento con el título "${updateEventoDto.titulo}" ya existe`,
        );
      }
    }

    this.eventoRepository.merge(evento, updateEventoDto);
    const guardado = await this.eventoRepository.save(evento);

    return {
      message: 'Evento actualizado exitosamente',
      data: guardado,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const evento = await this.findOne(id);
    await this.eventoRepository.remove(evento);

    return {
      message: `Evento "${evento.titulo}" con ID ${id} eliminado exitosamente`,
    };
  }
}
