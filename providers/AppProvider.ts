import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import Bot from 'App/Jackal/Bot'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    const bot = new Bot()

    await bot.init()
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
