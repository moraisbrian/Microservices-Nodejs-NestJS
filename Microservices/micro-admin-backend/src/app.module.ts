import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaSchema } from './interfaces/categoria/categoria.schema';
import { JogadorSchema } from './interfaces/jogador/jogador.schema';
import * as dotenv from 'dotenv';

dotenv.config();

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING, mongooseOptions),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema },
      { name: 'Jogador', schema: JogadorSchema }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
