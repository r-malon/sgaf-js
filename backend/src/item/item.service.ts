import { Injectable } from '@nestjs/common'
import { PrismaCrudService } from 'nestjs-prisma-crud'

@Injectable()
export class ItemService extends PrismaCrudService {
  constructor() {
    super({
      model: 'Item',
      allowedJoins: [],
      defaultJoins: [],
    })
  }
}
