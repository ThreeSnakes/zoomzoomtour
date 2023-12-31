import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './infra/database/entity/seller.entity';
import { SellerModule } from './module/seller/seller.module';
import { TourEntity } from './infra/database/entity/tour.entity';
import { TourModule } from './module/tour/tour.module';
import { RegularHolidayEntity } from './infra/database/entity/regularHoliday.entity';
import { HolidayEntity } from './infra/database/entity/holiday.entity';
import { ClientEntity } from './infra/database/entity/client.entity';
import { ReservationEntity } from './infra/database/entity/reservation.entity';
import { ClientModule } from './module/client/client.module';
import { ReservationModule } from './module/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER_NAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [
          SellerEntity,
          TourEntity,
          RegularHolidayEntity,
          HolidayEntity,
          ClientEntity,
          ReservationEntity,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    SellerModule,
    TourModule,
    ClientModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
