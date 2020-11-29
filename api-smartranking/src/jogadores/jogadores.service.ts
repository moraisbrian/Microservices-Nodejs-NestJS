import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
    constructor(@InjectModel("Jogador") private readonly jogadorModule: Model<Jogador>) {}

    //private jogadores: Jogador[] = [];  

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criarJogadorDto;

        //const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);
        const jogadorEncontrado = await this.jogadorModule.findOne({email}).exec();

        if (jogadorEncontrado) {
            await this.atualizar(criarJogadorDto);
        } else { 
            await this.criar(criarJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Array<Jogador>> {
        return await this.jogadorModule.find().exec();
        //return await this.jogadores;
    }

    async consultarJogadorPorEmail(email: string): Promise<Jogador> {
        //const jogador = await this.jogadores.find(jogador => jogador.email === email);
        const jogador = await this.jogadorModule.findOne({email}).exec();

        if (!jogador) 
            throw new NotFoundException(`Jogador com email ${email} não encontrado`);
        
        return jogador;
    }

    async deletarJogador(email: string): Promise<any> {
        return await this.jogadorModule.remove({email}).exec();

        /*
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email);
        */
    }

    private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadorModule.findOneAndUpdate({ 
            email: criarJogadorDto.email 
        }, { 
            $set: criarJogadorDto 
        })
        .exec();

        /*
        const { nome } = criarJogadorDto;
        jogadorEncontrado.nome = nome;
        */
    }

    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModule(criarJogadorDto);
        return await jogadorCriado.save();

        /*
        const { nome, telefoneCelular, email } = criarJogadorDto;
        const jogador: Jogador = {
            _id: uuidv4(),
            telefoneCelular: telefoneCelular,
            email: email,
            nome: nome,
            ranking: "A",
            posicaoRanking: 1,
            urlFotoJogador: "https://www.google.com.br/fotos/foto1.jpg"
        };
        
        this.jogadores.push(jogador);
        */
    }
}
