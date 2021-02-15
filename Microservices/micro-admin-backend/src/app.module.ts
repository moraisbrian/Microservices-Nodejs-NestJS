import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaSchema } from './interfaces/categoria/categoria.schema';
import { JogadorSchema } from './interfaces/jogador/jogador.schema';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/sradminbackend', mongooseOptions),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
