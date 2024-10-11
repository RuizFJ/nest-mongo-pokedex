import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.valitation';


@Module({
  imports: [
    //ConfigModule para cargar las variables de entorno
    ConfigModule.forRoot({
      load: [envConfig],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    //Para conectar la aplicacion a la base de datos en este caso usamos mongoose es un ODM para mongoDB
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'Pokemonsdb'
    }),
    PokemonModule,
    SeedModule,
    CommonModule,
    

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
