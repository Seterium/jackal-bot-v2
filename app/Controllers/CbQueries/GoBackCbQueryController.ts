import { CbQueryController } from '@types'

import { Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import getLocale from 'helpers/getLocale'

type Params = {}

export default class GoBackCbQueryController implements CbQueryController<Params> {
  public static schema: any = {}

  public context: Context<Update>

  public update: Update.CallbackQueryUpdate

  public params: Params

  public handle (): void {}
}
