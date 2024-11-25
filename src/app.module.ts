// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { PetsModule } from './pets/pets.module';
// import { DistanceModule } from './distance/distance.module';
// import { BreedsModule } from './breeds/breeds.module';

// @Module({
//   imports: [
//     UserModule,
//     MongooseModule.forRoot(
//       'mongodb://mongo:kRIrfumgVDkjEokSwgzoyrxvfhetWndI@junction.proxy.rlwy.net:36463',
//     ),
//     AuthModule,
//     PetsModule,
//     DistanceModule,
//     BreedsModule,
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { DistanceModule } from './distance/distance.module';
import { BreedsModule } from './breeds/breeds.module';
import { DispenserModule } from './dispenser/dispenser.module';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/alimentador'), // Conexión a la base de datos local
    AuthModule,
    PetsModule,
    DistanceModule,
    BreedsModule,
    DispenserModule,
  ],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule {}
