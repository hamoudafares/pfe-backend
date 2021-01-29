import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { PresentationSchema } from './schemas/presentation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name : 'Presentation' , schema: PresentationSchema }])],
  controllers: [PresentationController],
  providers: [PresentationService]
})
export class PresentationModule {}
