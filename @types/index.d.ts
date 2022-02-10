import { Context } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

export type ParamsObject = {
  [key: string]: number | string | boolean
}

export type Config = {
  /**
   * Пользователи, с которыми бот будет взаимодействовать
   * Запросы от других пользователей игнорируются
   */
  users: number[]

  /**
   * Список рекомендуемых каналов
   * Выводится в списке подписок при отсутсвии самих подписок
   */
  recommendedChannels: Array<{
    id: string,
    title: string
  }>

  /**
   * Возможные варианты преобразования видео
   *
   * @property {string} quality - Название формата (240p, 360p и т.д)
   * @property {array[number]} compressions - Степени сжатия (1-50)
   */
  availableQualities: Array<{
    quality: string,
    compressions: number[]
  }>
}

export interface CommandController {
  /**
   * Контекст Telegraf
   */
  public context: Context<Update>

  /**
   * Инстанс объекта сообщения
   */
  public message: Message.TextMessage

  /**
   * Инстанс объекта обновления
   */
  public update: Update.MessageUpdate

  /**
   * Обработчик команды
   */
  public handle (): void
}

export interface CbQueryController<Params> {
  /**
   * Контекст Telegraf
   */
  public context: Context<Update>

  /**
   * Инстанс объекта обновления
   */
  public update: Update.CallbackQueryUpdate

  /**
   * Параметры callbackQuery
   */
  public params: Params

  /**
   * Обработчик команды
   */
  public handle (): void
}

export enum CastType {
  string = 'string',
  number = 'number',
  boolean = 'boolean'
}

export type CastValue = string | number | boolean

export type Schema = {
  action: string,
  params: Array<{
    key: string,
    type: CastType
  }>
}
