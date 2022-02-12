import fs from 'fs'

import mustache from 'mustache'

import { string } from '@ioc:Adonis/Core/Helpers'

import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'

export default class MakeBotControllers extends BaseCommand {
  public static commandName = 'make:bot_controllers'

  public static description = ''

  @flags.boolean({
    description: 'Controllers for commands',
    alias: 'c',
  })
  public forCommands: boolean = false

  @args.spread({ description: 'Controllers class names' })
  public names: string[]

  public async run () {
    const type = this.forCommands
      ? 'Command'
      : 'CbQuery'

    const template = fs.readFileSync(`${process.env.PWD}/plop/${type}.plop.ts`).toString()

    this.names.forEach((name) => {
      let className = this.forCommands
        ? 'CommandController'
        : 'CbQueryController'

      const dir = this.forCommands
        ? 'Commands'
        : 'CbQueries'

      let path = `${process.env.PWD}/app/Controllers/${dir}`

      if (name.indexOf('/') === -1) {
        className = `${string.pascalCase(name)}${className}`
      } else {
        const filepath = name.split('/').map((namePart) => string.pascalCase(namePart))

        className = `${string.pascalCase(filepath.pop() as string)}${className}`
        path = `${path}/${filepath.join('/')}`

        fs.mkdirSync(path, {
          recursive: true,
        })
      }

      const rendered = mustache.render(template, {
        name: string.pascalCase(name),
        className,
        dir,
      })

      fs.writeFileSync(`${path}/${className}.ts`, rendered)

      this.logger.success(`${className}.ts created`)
    })
  }
}
