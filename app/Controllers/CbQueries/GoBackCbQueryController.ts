import { CbQueryController } from '@types'

import { Context } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

type Params = {}

export default class GoBackCbQueryController implements CbQueryController<Params> {
  public context: Context<Update>

  public message: Message.TextMessage

  public update: Update.MessageUpdate

  public params: Params

  public handle (): void {}
}
