import { Controller } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller()
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}
}
