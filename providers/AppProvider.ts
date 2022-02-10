import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import JackalBot from 'App/Services/JackalBot'

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
    const bot = new JackalBot()

    bot.init()
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
