import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
    constructor(@InjectModel("Desafio") private readonly desafioModel: Model<Desafio>) {}

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<void> {

    }
}
