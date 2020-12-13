import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectModel("Categoria") private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ) {}

    async criarCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = criarCategoriaDto;
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

        if (categoriaEncontrada) {
            throw new BadRequestException(`Categoria ${categoria} já cadastrada`);
        }

        const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
        return await categoriaCriada.save();
    }

    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriaModel.find().populate("jogadores").exec();
    }

    async consultarCategoriaPorIdentificacao(categoria: string): Promise<Categoria> {
        return this.verificarSeExiste(categoria);
    }

    async atualizarCategoria(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<Categoria> {
        await this.verificarSeExiste(categoria);

        return this.categoriaModel.findOneAndUpdate({
            categoria: categoria
        }, {
            $set: atualizarCategoriaDto
        })
        .exec();
    }

    async deletarCategoria(categoria: string): Promise<any> {
        await this.verificarSeExiste(categoria);
        return await this.categoriaModel.findOneAndDelete({categoria}).exec();
    }

    async atribuirCategoriaJogador(params: Array<string>): Promise<void> {
        const categoria = params["categoria"];
        const idJogador = params["idJogador"];

        const categoriaEncontrada = await this.verificarSeExiste(categoria);
        const jogadorJaCadastradoCategoria = await this.categoriaModel
            .find({categoria}).where("jogadores").in(idJogador).exec();
        
        if (!categoriaEncontrada) {
            throw new BadRequestException(`Categoria ${categoria} não cadastrada`);
        }

        if (jogadorJaCadastradoCategoria.length > 0) {
            throw new BadRequestException(`Jogador ${idJogador} já cadastrado na categoria ${categoria}`);
        }

        categoriaEncontrada.jogadores.push(idJogador);
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrada}).exec();
    }

    async consultarCategoriaPorJogador(idJogador: any): Promise<Categoria> {
        return await this.categoriaModel.findOne().where("jogadores").in(idJogador).exec();
    }

    private async verificarSeExiste(categoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

        if (!categoriaEncontrada) {
            throw new BadRequestException(`Categoria com id ${categoria} não encontrada`);
        } 

        return categoriaEncontrada;
    }
}
