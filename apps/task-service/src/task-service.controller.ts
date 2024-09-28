import { Controller } from '@nestjs/common';
import { TaskServiceService } from './task-service.service';

@Controller()
export class TaskServiceController {
  constructor(private readonly taskServiceService: TaskServiceService) {}
}
