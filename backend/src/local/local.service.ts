import { Injectable } from '@nestjs/common'
import { PrismaCrudService } from 'nestjs-prisma-crud'

@Injectable()
export class LocalService extends PrismaCrudService {
  constructor() {
    super({
      model: 'Local',
      allowedJoins: [],
      defaultJoins: [],
    })
  }
}
