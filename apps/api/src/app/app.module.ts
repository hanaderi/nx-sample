import { Module } from '@nestjs/common';
import { HealthModule } from '@org/api-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HealthModule.forRoot({ message: 'Hi from API 👋' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
