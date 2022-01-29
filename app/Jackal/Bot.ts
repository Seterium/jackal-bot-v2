import { CommandController } from '@types'

import { Telegraf } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

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
  private static commands: {
    [key: string]: string
  }

  /**
   * Список зарегистрированных обработчиков CallbackQuery
   */
  private static cbQueries: {
    [key: string]: string
  }

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
  private initCommandsHandler (): void {
    Bot.commands.forEach(({ command, handler }) => {
      this.bot.command(command, (context) => {
        const handlerClass: CommandController = new (Controllers.commands[handler])()

        const update = context.update as Update.MessageUpdate
        const message = update.message as Message.TextMessage

        handlerClass.context = context
        handlerClass.message = message
        handlerClass.update = update

        if (!handlerClass) {
          return
        }

        handlerClass.handle()
      })
    })
  }

  /**
   * Инициализация обработчиков CallbackQuery
   */
  private initCbQueriesHandler (): void {}

  /**
   * Регистрация обработчика Command
   *
   * @param {string} command Имя команды
   * @param {string} handler Указатель метода-обработчика
   */
  public static command (command: string, handler: string) {
    this.commands[command] = handler
  }

  /**
   * Регистрация обработчика CallbackQuery
   *
   * @param {string} cbQuery Имя команды
   * @param {string} handler Указатель метода-обработчика
   */
  public static cbQuery (cbQuery: string, handler: string) {
    this.cbQueries[cbQuery] = handler
  }
}
