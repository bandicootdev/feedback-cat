import { Module, ValidationPipe } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // MONGO_USERNAME: Joi.string().required(),
        // MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
      }),
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // const username = configService.get('MONGO_USERNAME');
        // const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');
        return {
          // uri: `mongodb://${username}:${password}@${host}`,
          uri: `mongodb://${host}/${database}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ProductModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
