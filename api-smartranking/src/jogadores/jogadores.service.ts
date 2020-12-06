import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
    constructor(@InjectModel("Jogador") private readonly jogadorModule: Model<Jogador>) {}

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const { email } = criarJogadorDto;
        const jogadorEncontrado = await this.jogadorModule.findOne({email}).exec();

        if (jogadorEncontrado) {
            throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
        }

        const jogadorCriado = new this.jogadorModule(criarJogadorDto);
        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<Jogador> {
        this.verificarSeExiste(_id);
        return await this.jogadorModule.findOneAndUpdate({ 
            _id: _id
        }, { 
            $set: atualizarJogadorDto 
        })
        .exec();
    }

    async consultarTodosJogadores(): Promise<Array<Jogador>> {
        return await this.jogadorModule.find().exec();
    }

    async consultarJogadorPorId(_id: string): Promise<Jogador> {
        return this.verificarSeExiste(_id);
    }

    async deletarJogador(_id: string): Promise<any> {
        this.verificarSeExiste(_id);
        return await this.jogadorModule.deleteOne({_id}).exec();
    }

    private async verificarSeExiste(_id: string): Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModule.findOne({_id}).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }

        return jogadorEncontrado;
    }
}
