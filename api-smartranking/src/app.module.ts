import { Module } from '@nestjs/common';
import { JogadoresModule } from './jogadores/jogadores.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionString } from '../connectionString';

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

@Module({
  imports: [
    JogadoresModule,
    MongooseModule.forRoot(ConnectionString, mongooseOptions)
  ],
  controllers: [],
  providers: []
})
export class AppModule {}