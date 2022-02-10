import { CommandController } from '@types'

import { Context } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import getLocale from 'helpers/getLocale'

export default class StartCommandController implements CommandController {
  public context: Context<Update>

  public message: Message.TextMessage

  public update: Update.MessageUpdate

  public handle (): void {}
}
