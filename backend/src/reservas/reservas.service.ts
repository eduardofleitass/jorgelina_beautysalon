import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Reserva {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  message: string;
  createdAt: string;
}

@Injectable()
export class ReservasService {
  private readonly dataPath: string;

  constructor() {
    // CommonJS: __dirname esta disponible
    const dataDir = process.env.PORTAL_DATA_PATH
      ? process.env.PORTAL_DATA_PATH
      : path.join(__dirname, '..', '..', 'data');
    this.dataPath = path.join(dataDir, 'reservas.json');

    // Asegurar que exista el archivo
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, '[]', 'utf-8');
    }
  }

  findAll(): Reserva[] {
    try {
      const raw = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(raw) as Reserva[];
    } catch {
      return [];
    }
  }

  create(dto: Omit<Reserva, 'id' | 'createdAt'>): Reserva {
    const reservas = this.findAll();
    const nueva: Reserva = {
      id: reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1,
      name: dto.name,
      phone: dto.phone,
      service: dto.service,
      date: dto.date || '',
      message: dto.message || '',
      createdAt: new Date().toISOString(),
    };
    reservas.push(nueva);
    fs.writeFileSync(this.dataPath, JSON.stringify(reservas, null, 2), 'utf-8');
    return nueva;
  }

  count(): number {
    return this.findAll().length;
  }
}
