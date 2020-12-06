import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

@Injectable()
export class JogadoresService {
    constructor(@InjectModel("Jogador") private readonly jogadorModule: Model<Jogador>) {}

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const { email, telefoneCelular } = criarJogadorDto;
        const jogadorComMesmoEmailEncontrado = await this.jogadorModule.findOne({email}).exec();
        const jogadorComMesmoTelefoneEncontrado = await this.jogadorModule.findOne({telefoneCelular}).exec();

        let erros = "";
        if (jogadorComMesmoEmailEncontrado) {
            erros = `Jogador com email ${email} já cadastrado `;
        }
        if (jogadorComMesmoTelefoneEncontrado) {
            erros += `Jogador com telefone ${telefoneCelular} já cadastrado`;
        }
        if (erros !== "") {
            throw new BadRequestException(erros);
        }

        const jogadorCriado = new this.jogadorModule(criarJogadorDto);
        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        this.verificarSeExiste(_id);
        return await this.jogadorModule.findOneAndUpdate({ 
            _id: _id
        }, { 
            $set: criarJogadorDto 
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
