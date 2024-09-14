import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://mongo:kYNgYYjSUWFsFHEVKQSrSjZkcxNZzkkX@autorack.proxy.rlwy.net:50056')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
