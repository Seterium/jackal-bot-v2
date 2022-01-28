import fs from 'fs'

import mustache from 'mustache'

import { BaseCommand, args } from '@adonisjs/core/build/standalone'

import { string } from '@ioc:Adonis/Core/Helpers'

export default class BotCommand extends BaseCommand {
  public static commandName = 'bot:command'

  public static description = 'Create bot Command controller'

  @args.string({ description: 'Controller class name' })
  public name: string

  public async run () {
    const template = fs.readFileSync(`${process.env.PWD}/plop/Command.plop.ts`).toString()

    const name = `${string.pascalCase(this.name)}CommandController`

    const rendered = mustache.render(template, {
      name,
    })

    fs.writeFileSync(`${process.env.PWD}/app/Controllers/Commands/${name}.ts`, rendered)

    this.logger.success(`${name}.ts created`)
  }
}
