import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
    private jogadores: Jogador[] = [];  

    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const { email } = criarJogadorDto;

        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);

        if (jogadorEncontrado) {
            await this.atualizar(jogadorEncontrado, criarJogadorDto);
        } else { 
            await this.criar(criarJogadorDto);
        }
    }

    async consultarTodosJogadores(): Promise<Array<Jogador>> {
        return await this.jogadores;
    }

    async consultarJogadorPorEmail(email: string): Promise<Jogador> {
        const jogador = await this.jogadores.find(jogador => jogador.email === email);

        if (!jogador) 
            throw new NotFoundException(`Jogador com email ${email} não encontrado`);
        
        return jogador;
    }

    async deletarJogador(email: string): Promise<void> {
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email);
        this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email);
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const { nome } = criarJogadorDto;
        jogadorEncontrado.nome = nome;
    }

    private criar(criarJogadorDto: CriarJogadorDto): void {
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
    }
}
