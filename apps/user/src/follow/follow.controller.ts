import { Controller } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}
}
