import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PointsModule } from './points/points.module';

@Module({
  imports: [AuthModule, PointsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
