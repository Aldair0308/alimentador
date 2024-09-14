import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'autorack.proxy.rlwy.net',
      password: 'eheheNHJXjKiixlcqNzBNRTxwmVcokDA',
      username: 'root',
      database: 'railway',
      port: 37407,

    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
