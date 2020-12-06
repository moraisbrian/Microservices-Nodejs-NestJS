import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaSchema } from './interfaces/categoria..schema';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    MongooseModule.forFeature([{ name: "categoria", schema: CategoriaSchema }])
  ]
})
export class CategoriasModule {}
