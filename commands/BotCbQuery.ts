import fs from 'fs'

import mustache from 'mustache'

import { BaseCommand, args } from '@adonisjs/core/build/standalone'

import { string } from '@ioc:Adonis/Core/Helpers'

export default class BotCbQuery extends BaseCommand {
  public static commandName = 'bot:cbquery'

  public static description = 'Create bot CallbackQuery controller'

  @args.string({ description: 'Controller class name' })
  public name: string

  public async run () {
    const template = fs.readFileSync(`${process.env.PWD}/plop/CbQuery.plop.ts`).toString()

    const name = `${string.pascalCase(this.name)}CbQueryController`

    const rendered = mustache.render(template, {
      name,
    })

    fs.writeFileSync(`${process.env.PWD}/app/Controllers/CbQueries/${name}.ts`, rendered)

    this.logger.success(`${name}.ts created`)
  }
}
