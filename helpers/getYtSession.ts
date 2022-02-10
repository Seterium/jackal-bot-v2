import ytcog from 'ytcog'

import Env from '@ioc:Adonis/Core/Env'

export default async () => {
  const session = new ytcog.Session(
    Env.get('YT_COOKIE'),
    Env.get('YT_USER_AGENT')
  )

  await session.fetch()

  return session
}
