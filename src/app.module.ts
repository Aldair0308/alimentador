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
import { ProblemModule } from './problem/problem.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb://mongo:mpdZxINVGCtBOWMMauuVxkKmXtSRoCFi@mongodb.railway.internal:27017',
    ), // Conexión a la base de datos local
    AuthModule,
    PetsModule,
    DistanceModule,
    BreedsModule,
    DispenserModule,
    ProblemModule,
  ],
  controllers: [],
  providers: [NotificationService],
})
export class AppModule {}
