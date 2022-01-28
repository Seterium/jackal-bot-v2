export type JackalConfig = {
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
