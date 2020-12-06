import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
    constructor(@InjectModel("Categoria") private readonly categoriaModel: Model<Categoria>) {}

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
        return await this.categoriaModel.find().exec();
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

    private async verificarSeExiste(categoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();

        if (!categoriaEncontrada) {
            throw new BadRequestException(`Categoria com id ${categoria} não encontrada`);
        } 

        return categoriaEncontrada;
    }
}
