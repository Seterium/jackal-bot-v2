import { CommandController, CbQueryController, ParamsObject, Schema, CastType } from '@types'

import { Telegraf } from 'telegraf'
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram'

import Controllers from 'App/Controllers'

import Env from '@ioc:Adonis/Core/Env'

import config from 'Config/jackal'

import cast from 'helpers/cast'

export default class JackalBot {
  /**
   * Инстанс Telegraf
   */
  private bot: Telegraf

  /**
   * Список зарегистрированных обработчиков Command
   */
  private static commands: {
    [command: string]: string
  }

  /**
   * Список зарегистрированных обработчиков CallbackQuery
   */
  private static cbQueries: {
    [cbQuery: string]: {
      handler: string,
      schema: Schema['params']
    }
  }

  constructor () {
    this.bot = new Telegraf(Env.get('BOT_TOKEN'))
  }

  /**
   * Инициализация системы
   */
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
    Object.keys(Bot.commands).forEach((command) => {
      const handler = Bot.commands[command]

      this.bot.command(command, (context) => {
        const handlerClass: CommandController = new (Controllers.commands[handler])()

        if (!handlerClass) {
          return
        }

        const update = context.update as Update.MessageUpdate
        const message = update.message as Message.TextMessage

        handlerClass.context = context
        handlerClass.message = message
        handlerClass.update = update

        try {
          handlerClass.handle()
        } catch (error) {
          console.log(error)
        }
      })
    })
  }

  /**
   * Инициализация обработчиков CallbackQuery
   */
  private initCbQueriesHandler (): void {
    this.bot.on('callback_query', async (context) => {
      const update = context.update as Update.CallbackQueryUpdate
      const callbackQuery = update.callback_query as CallbackQuery.DataCallbackQuery

      const [ action, ...rawParams ] = callbackQuery.data.split('|')

      if (Bot.cbQueries[action] === undefined) {
        return
      }

      const { handler, schema } = Bot.cbQueries[action]

      const handlerClass: CbQueryController<any> = new (Controllers.cbQueries[handler])()

      handlerClass.context = context
      handlerClass.update = update
      handlerClass.params = this.parseCbQueryParams(rawParams, schema.params)

      try {
        handlerClass.handle()
      } catch (error) {
        console.log(error)
      }
    })
  }

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
    const { action, params } = this.createCbQueryParamsSchema(cbQuery)

    this.cbQueries[action] = {
      handler,
      schema: params,
    }
  }

  /**
   * Парсинг шаблона CallbackQuery и создание схемы преобразования параметров
   *
   * @param {string} template
   * @returns {Schema} Schema
   */
  private static createCbQueryParamsSchema (template: string): Schema {
    const schema: Schema = {
      action: '',
      params: [],
    }

    const [ action, ...paramsSchemas ] = template.split('|')

    schema.action = action

    paramsSchemas.forEach((paramsSchema) => {
      const [ key, type ] = paramsSchema.split(':')

      schema.params.push({
        key,
        type: type as CastType,
      })
    })

    return schema
  }

  /**
   * Парсинг параметров CallbackQuery
   */
  private parseCbQueryParams (payload: string[], paramsSchema: Schema['params']): ParamsObject {
    const params: ParamsObject = {}

    paramsSchema.forEach(({ key, type }, index: number) => {
      const value = payload[index]

      if (value === undefined || type === undefined) {
        params[key] = value

        return
      }

      params[key] = cast(value, type)
    })

    return params
  }
}
