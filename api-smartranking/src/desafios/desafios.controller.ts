import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacao } from './pipes/desafio-status-validacao.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
    constructor(private readonly desafiosService: DesafiosService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        return await this.desafiosService.criarDesafio(criarDesafioDto);
    }

    @Get()
    async consultarDesafios(): Promise<Array<Desafio>> {
        return await this.desafiosService.consultarDesafios();
    }

    @Get("/:idJogador")
    async consultarDesafiosPorJogador(@Param("idJogador") idJogador: string): Promise<Array<Desafio>> {
        return await this.desafiosService.consultarDesafiosPorJogador(idJogador);
    }

    @Put("/:desafio")
    @UsePipes(ValidationPipe)
    async atualizarDesafio(
        @Param("desafio") desafio: string, 
        @Body(DesafioStatusValidacao) atualizarDesafioDto: AtualizarDesafioDto): Promise<Desafio> {
        return await this.desafiosService.atualizarDesafio(desafio, atualizarDesafioDto);
    }
}
