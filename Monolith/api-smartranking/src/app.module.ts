import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosModule } from './desafios/desafios.module';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

@Module({
  imports: [
    JogadoresModule,
    MongooseModule.forRoot(process.env.CONNECTION_STRING, mongooseOptions),
    CategoriasModule,
    DesafiosModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}