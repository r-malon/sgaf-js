import { Injectable } from '@nestjs/common'
import { PrismaCrudService } from 'nestjs-prisma-crud'

@Injectable()
export class ValorService extends PrismaCrudService {
  constructor() {
    super({
      model: 'Valor',
      allowedJoins: [],
      defaultJoins: [],
    })
  }
}
