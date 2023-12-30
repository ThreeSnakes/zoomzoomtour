import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Seller } from './infra/database/entity/seller.entity';
import { SellerModule } from './module/seller/seller.module';
import { Tour } from './infra/database/entity/tour.entity';
import { TourModule } from './module/tour/tour.module';
import { RegularHoliday } from './infra/database/entity/regularHoliday.entity';
import { Holiday } from './infra/database/entity/holiday.entity';
import { Client } from './infra/database/entity/client.entity';
import { Reservation } from './infra/database/entity/reservation.entity';
import { ClientModule } from './module/client/client.module';
import { ReservationModule } from './module/reservation/reservation.module';

const isDev = process.env.NODE_ENV !== 'production';

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
        entities: [Seller, Tour, RegularHoliday, Holiday, Client, Reservation],
        synchronize: isDev,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
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
