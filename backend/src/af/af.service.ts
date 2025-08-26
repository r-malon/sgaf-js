import { Injectable } from '@nestjs/common'
import { PrismaCrudService } from 'nestjs-prisma-crud'

@Injectable()
export class AfService extends PrismaCrudService {
  constructor() {
    super({
      model: 'AF',
      allowedJoins: [],
      defaultJoins: [],
      paginationConfig: {
        defaultPageSize: 10000,
        maxPageSize: 10000,
      },
    })
  }
}
