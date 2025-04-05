import { Module } from '@nestjs/common';
import { FreeCommunityController } from './free-community.controller';
import { FreeCommunityService } from './free-community.service';

@Module({
  imports: [],
  controllers: [FreeCommunityController],
  providers: [FreeCommunityService],
})
export class FreeCommunityModule {}
