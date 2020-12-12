import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
        return await this.categoriasService.criarCategoria(criarCategoriaDto);
    }

    @Get()
    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriasService.consultarCategorias();
    }

    @Get("/:categoria")
    async consultarCategoriaPorIdentificacao(@Param("categoria") categoria: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaPorIdentificacao(categoria);
    }

    @Put("/:categoria")
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
        @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
        @Param("categoria") categoria: string): Promise<Categoria> {
            return await this.categoriasService.atualizarCategoria(categoria, atualizarCategoriaDto);
        }

    @Delete("/:categoria")
    async deletarCategoria(@Param("categoria") categoria: string): Promise<any> {
        return await this.categoriasService.deletarCategoria(categoria);
    }

    @Post("/:categoria/jogadores/:idJogador")
    async atribuirCategoriaJogador(@Param() params: Array<string>): Promise<void> {
        return await this.categoriasService.atribuirCategoriaJogador(params);
    }
}
