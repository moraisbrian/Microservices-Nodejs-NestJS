import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';

@Controller('desafios')
export class DesafiosController {
    constructor(private readonly desafiosService: DesafiosService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<void> {
        await this.desafiosService.criarDesafio(criarDesafioDto);
    }
}
