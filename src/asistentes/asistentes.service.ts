import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistente } from './entities/asistente.entity';
import { CreateAsistenteDto } from './dto/create-asistente.dto';
import { UpdateAsistenteDto } from './dto/update-asistente.dto';
import { EventosService } from '../eventos/eventos.service';

@Injectable()
export class AsistentesService {
  constructor(
    @InjectRepository(Asistente)
    private readonly asistenteRepository: Repository<Asistente>,
    private readonly eventosService: EventosService,
  ) {}

  async create(createAsistenteDto: CreateAsistenteDto) {
    const { eventoId, ...asistenteData } = createAsistenteDto;

    const evento = await this.eventosService.findOne(eventoId);

    const asistente = this.asistenteRepository.create({
      ...asistenteData,
      evento,
    });

    const guardado = await this.asistenteRepository.save(asistente);

    return {
      message: 'Asistente registrado exitosamente',
      data: guardado,
    };
  }

  async findAll(): Promise<Asistente[]> {
    return await this.asistenteRepository.find({
      relations: { evento: true },
    });
  }

  async findOne(id: number): Promise<Asistente> {
    const asistente = await this.asistenteRepository.findOne({
      where: { id },
      relations: { evento: true },
    });

    if (!asistente) {
      throw new NotFoundException(`Asistente con ID ${id} no encontrado`);
    }

    return asistente;
  }

  async update(id: number, updateAsistenteDto: UpdateAsistenteDto) {
    const asistente = await this.findOne(id);
    const { eventoId, ...asistenteData } = updateAsistenteDto;

    if (eventoId) {
      const evento = await this.eventosService.findOne(eventoId);
      asistente.evento = evento;
    }

    this.asistenteRepository.merge(asistente, asistenteData);
    const guardado = await this.asistenteRepository.save(asistente);

    return {
      message: 'Asistente actualizado exitosamente',
      data: guardado,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const asistente = await this.findOne(id);
    await this.asistenteRepository.remove(asistente);

    return {
      message: `Asistente "${asistente.nombreCompleto}" con ID ${id} eliminado exitosamente`,
    };
  }
}
