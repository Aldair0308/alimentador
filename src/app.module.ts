import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { DistanceModule } from './distance/distance.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://mongo:kYNgYYjSUWFsFHEVKQSrSjZkcxNZzkkX@autorack.proxy.rlwy.net:50056'),
    AuthModule,
    PetsModule,
    DistanceModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
