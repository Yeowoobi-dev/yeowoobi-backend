import { Controller } from '@nestjs/common';
import { BookLogService } from './book-log.service';

@Controller()
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}
}
