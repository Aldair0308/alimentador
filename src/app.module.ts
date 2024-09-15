import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://mongo:kYNgYYjSUWFsFHEVKQSrSjZkcxNZzkkX@autorack.proxy.rlwy.net:50056'),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
