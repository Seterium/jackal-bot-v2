import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  DRIVE_DISK: Env.schema.enum(['local'] as const),

  BOT_TOKEN: Env.schema.string(),

  YT_COOKIE: Env.schema.string(),
  YT_USER_AGENT: Env.schema.string(),
})
