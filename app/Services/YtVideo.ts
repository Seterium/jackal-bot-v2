import ytcog from 'ytcog'

import getYtSession from 'helpers/getYtSession'

export default class YtVideo {
  public async fetch (id: string) {
    const session = await getYtSession()

    const video = new ytcog.Video(session, {
      id,
    })

    await video.fetch()
  }

  public async download (
    quality: string,
    compression: number,
    progress: (percent: number) => void
  ) {}

  private format (data: any) {}
}
