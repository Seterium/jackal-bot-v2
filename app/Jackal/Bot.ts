import { Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import Controllers from 'App/Controllers'

import Env from '@ioc:Adonis/Core/Env'

import config from 'Config/jackal'

export default class Bot {
  /**
   * Инстанс Telegraf
   */
  private bot: Telegraf

  /**
   * Список зарегистрированных обработчиков Command
   */
  private static commands: any = {}

  /**
   * Список зарегистрированных обработчиков CallbackQuery
   */
  private static cbQueries: any = {}

  constructor () {
    this.bot = new Telegraf(Env.get('BOT_TOKEN'))
  }

  public init () {
    this.initMiddleware()

    try {
      this.initCommandsHandler()
    } catch (error) {
      console.log(error)

      process.exit()
    }

    try {
      this.initCbQueriesHandler()
    } catch (error) {
      console.log(error)

      process.exit()
    }

    console.log('Jackal Bot started')

    console.log({
      commands: Bot.commands,
      cbQueries: Bot.cbQueries,
    })
  }

  /**
   * Инициализация авторизационной мидлвари
   */
  private initMiddleware (): void {
    this.bot.use(async (context, next) => {
      let update:Update.MessageUpdate | Update.CallbackQueryUpdate
      let from: number

      if (context.update.hasOwnProperty('message')) {
        update = context.update as Update.MessageUpdate

        from = update.message.from.id
      } else if (context.update.hasOwnProperty('callback_query')) {
        update = context.update as Update.CallbackQueryUpdate

        from = update.callback_query.from.id
      } else {
        return
      }

      if (!config.users.includes(from)) {
        return
      }

      try {
        await next()
      } catch (error) {
        console.log(error)
      }
    })
  }

  /**
   * Инициализация обработчиков Command
   */
  private initCommandsHandler (): void {}

  /**
   * Инициализация обработчиков CallbackQuery
   */
  private initCbQueriesHandler (): void {}

  /**
   * Регистрация обработчика Command
   *
   * @param {string} name Имя команды
   * @param {string} handler Указатель метода-обработчика
   */
  public static command (name: string, handler: string) {
    this.commands[name] = handler
  }

  /**
   * Регистрация обработчика CallbackQuery
   *
   * @param {string} name Имя команды
   * @param {string} handler Указатель метода-обработчика
   */
  public static cbQuery (name: string, handler: string) {
    this.cbQueries[name] = handler
  }
}
