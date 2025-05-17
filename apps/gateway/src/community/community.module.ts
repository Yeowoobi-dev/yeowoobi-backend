import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMUNITY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'community',
          port: 5002,
        },
      },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService]
})
export class CommunityModule {}
