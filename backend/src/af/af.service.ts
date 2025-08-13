import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';

@Injectable()
export class AfService extends PrismaCrudService {
  constructor() {
    super({
      model: 'AF',
      allowedJoins: [],
      defaultJoins: [],
    });
  }
}
