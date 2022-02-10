import fs from 'fs'
import mustache from 'mustache'

type LocParams = {
  [key: string]: any
}

export default (path: string, params?: LocParams) => {
  const template = fs.readFileSync(`${process.env.PWD}/locales/${path}.html`, {
    encoding: 'utf8',
    flag: 'r',
  })

  if (!params) {
    return template
  }

  return mustache.render(template, params)
}
