import { Context } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { JackalControllerParams } from '@types'

export default class {{ name }} {
  public index (params: JackalControllerParams, context: Context) {
    const update = context.update as Update.MessageUpdate
  }
}
