import { CbQueryController } from '@types'

import { Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import getLocale from 'App/Helpers/getLocale'

type Params = {}

export default class {{ className }} implements CbQueryController<Params> {
  public context: Context<Update>

  public update: Update.CallbackQueryUpdate

  public params: Params

  public handle (): void {}
}
