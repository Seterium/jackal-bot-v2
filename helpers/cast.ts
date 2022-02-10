import { CastType, CastValue } from '@types'

export default (value: string, type: CastType): CastValue => {
  switch (type) {
    case 'string': return value

    case 'number': return parseInt(value)

    case 'boolean': return value === '0' || value === 'false' ? false : true

    default:
      return value
  }
}
