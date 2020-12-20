import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio } from './interfaces/desafio.interface';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class DesafiosService {
    constructor(
        @InjectModel("Desafio") private readonly desafioModel: Model<Desafio>,
        @InjectModel("Partida") private readonly partidaModel: Model<Partida>,
        private readonly jogadoresService: JogadoresService,
        private readonly categoriasService: CategoriasService
    ) {}

    async consultarDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find()
            .populate("jogadores")
            .populate("solicitante")
            .populate("partida")
            .exec();
    }

    async consultarDesafiosPorJogador(idJogador: any): Promise<Array<Desafio>> {
        const jogadores = await this.jogadoresService.consultarTodosJogadores();

        const jogadoresFilter = jogadores.filter(jogador => jogador._id == idJogador);

        if (jogadoresFilter.length == 0) {
            throw new BadRequestException(`O id ${idJogador} não é um jogador`);
        }

        return await this.desafioModel.find()
            .where("jogadores")
            .in(idJogador)
            .populate("jogadores")
            .populate("solicitante")
            .populate("partida")
            .exec();
    }

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const jogadores = await this.jogadoresService.consultarTodosJogadores();

        criarDesafioDto.jogadores.map(jogadorDto => {
            const jogadorFilter = jogadores.filter(jogador => jogador._id == jogadorDto._id);

            if (jogadorFilter.length == 0) {
                throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`);
            }
        });

        const solicitanteEJogadorDaPartida = criarDesafioDto.jogadores.filter(jogador => jogador._id == criarDesafioDto.solicitante);
        
        if (solicitanteEJogadorDaPartida.length == 0) {
            throw new BadRequestException("O solicitante deve ser jogador da partida");
        }

        const categoriaDoJogador = await this.categoriasService.consultarCategoriaPorJogador(criarDesafioDto.solicitante);

        if (!categoriaDoJogador) {
            throw new BadRequestException("O solicitante precisa estar registrado em uma categoria");
        }

        const desafioCriado = new this.desafioModel(criarDesafioDto);
        desafioCriado.categoria = categoriaDoJogador.categoria;
        desafioCriado.dataHoraSolicitacao = new Date();
        desafioCriado.status = DesafioStatus.PENDENTE;
        return await desafioCriado.save();
    }

    async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<Desafio> {
        const desafioEncontrado = await this.desafioModel.findById(id).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio id ${id} não cadastrado`);
        }

        if (atualizarDesafioDto.status) {
            desafioEncontrado.dataHoraResposta = new Date();
        }

        desafioEncontrado.status = atualizarDesafioDto.status;
        desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;
        return await this.desafioModel.findOneAndUpdate({id}, {$set: desafioEncontrado}).exec();
    }

    async atribuirDesafioPartida(id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(id).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${id} não encontrado`);
        }

        const jogadorFilter = desafioEncontrado.jogadores.filter(jogador => jogador._id == atribuirDesafioPartidaDto.def);

        if (jogadorFilter.length == 0) {
            throw new BadRequestException("O jogador vencedor não faz parte do desafio");
        }

        const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

        partidaCriada.categoria = desafioEncontrado.categoria;
        partidaCriada.jogadores = desafioEncontrado.jogadores;

        const resultado = await partidaCriada.save();

        desafioEncontrado.status = DesafioStatus.REALIZADO;
        desafioEncontrado.partida = resultado._id;

        try {
            await this.desafioModel.findOneAndUpdate({id}, {$set: desafioEncontrado}).exec();
        } catch {
            await this.partidaModel.deleteOne({_id: resultado._id}).exec();
            throw new InternalServerErrorException();
        }
    }

    async deletarDesafio(id: string): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(id).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${id} não cadastrado`);
        }

        desafioEncontrado.status = DesafioStatus.CANCELADO;
        await this.desafioModel.findOneAndUpdate({id}, {$set: desafioEncontrado}).exec();
    }
}
