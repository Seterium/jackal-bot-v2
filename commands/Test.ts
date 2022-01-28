import { BaseCommand } from '@adonisjs/core/build/standalone'

enum CastType {
  string = 'string',
  number = 'number',
  boolean = 'boolean'
}

type CastValue = string | number | boolean

const cast = (value: string, type: CastType): CastValue => {
  switch (type) {
    case 'string': return value

    case 'number': return parseInt(value)

    case 'boolean': return value === '0' || value === 'false' ? false : true

    default:
      return value
  }
}

type Schema = {
  action: string,
  params: Array<{
    key: string,
    type: CastType
  }>
}

type ParamsList = {
  [key: string]: string | number | boolean
}

export default class Test extends BaseCommand {
  public static commandName = 'test'

  public static description = ''

  public async run () {
    const template: string = 'action/key1:string/key2:number/key3:boolean/key4'
    const schema: Schema = this.createSchema(template)

    const query: string = 'action/value/256/1'
    const [ action, ...queryParams ] = query.split('/')

    const params: ParamsList = this.parseQueryParams(queryParams, schema)
  }

  private createSchema (template: string): Schema {
    const schema: Schema = {
      action: '',
      params: [],
    }

    const [ action, ...paramsSchemas ] = template.split('/')

    schema.action = action

    paramsSchemas.forEach((paramsSchema) => {
      const [ key, type ] = paramsSchema.split(':')

      schema.params.push({
        key,
        type,
      })
    })

    return schema
  }

  private parseQueryParams (queryParams: string[], schema: Schema): ParamsList {
    const params: ParamsList = {}

    schema.params.forEach(({ key, type }, index) => {
      const value = queryParams[index]

      if (value === undefined || type === undefined) {
        params[key] = value

        return
      }

      params[key] = cast(value, type)
    })

    return params
  }
}
