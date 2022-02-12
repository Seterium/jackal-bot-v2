import crypto from 'crypto'

import ytcog from 'ytcog'

import getYtSession from 'helpers/getYtSession'

export default class YtVideo {
  public id: string

  private video: any

  private session: any

  constructor (id: string) {
    this.id = id
  }

  public get formatted () {
    const {
      id,
      title,
      channelId,
      author,
      duration,
      views,
      rating,
      published,
    } = this.video

    return {
      id,
      title,
      channel: {
        id: channelId,
        title: author,
      },
      cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      duration,
      views,
      rating,
      published,
    }
  }

  public async fetch () {
    const session = await this.getSession()

    this.video = new ytcog.Video(session, {
      id: this.id,
    })

    await this.video.fetch()
  }

  public async download (
    videoQuality: string,
    progress: (percent: number) => void
  ) {
    const filename = crypto.randomUUID()
    const path = `${process.env.PWD}/public/results`

    const video = new ytcog.Video(this.session, {
      id: this.id,
    })

    await video.download({
      filename,
      path,
      videoQuality,
      progress,
      mediaBitrate: 'lowest',
      container: 'mp4',
    })

    return `${path}/${filename}.mp4`
  }

  private async getSession () {
    if (this.session) {
      return this.session
    }

    this.session = await getYtSession()

    return this.session
  }
}
