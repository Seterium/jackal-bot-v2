import ytcog from 'ytcog'

import getYtSession from 'helpers/getYtSession'

export default class YtChannel {
  public async fetch (id: string) {
    const session = await getYtSession()

    const channel = new ytcog.Channel(session, {
      id,
    })

    await channel.fetch()

    return this.format(channel)
  }

  private format (data: any) {}
}
