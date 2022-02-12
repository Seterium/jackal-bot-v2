import ytcog from 'ytcog'

import getYtSession from 'helpers/getYtSession'

export default class YtChannel {
  public id: string

  public channel: any

  public videos: any

  private session: any

  constructor (id: string) {
    this.id = id
  }

  public async fetch () {
    await this.startSession()

    this.channel = new ytcog.Channel(this.session, {
      id: this.id,
    })

    await this.channel.fetch()
  }

  public async fetchVideos (page: number) {
    await this.startSession()

    const VIDEOS_PER_PAGE = 20

    this.channel = new ytcog.Channel(this.session, {
      id: this.id,
      items: 'videos',
      quantity: page * VIDEOS_PER_PAGE > 60
        ? page * VIDEOS_PER_PAGE
        : 60,
    })

    await this.channel.fetch()

    const sliceStart = (page - 1) * VIDEOS_PER_PAGE

    this.videos = this.channel.videos.slice(sliceStart, sliceStart + VIDEOS_PER_PAGE)
  }

  public get formatted () {
    const {
      data,
      author,
      description,
    } = this.channel

    const cover = data[0]?.header?.c4TabbedHeaderRenderer?.banner?.thumbnails[0].url

    const subscribers = data[0]?.header?.c4TabbedHeaderRenderer?.subscriberCountText?.simpleText

    return {
      id: this.id,
      author,
      cover,
      subscribers,
      description,
    }
  }

  public get formattedVideos () {
    return this.videos.map((video: any) => ({
      id: video.id,
      title: video.title,
      channel: {
        id: video.channelId,
        title: video.author,
      },
      cover: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      duration: video.duration,
      views: video.views,
      rating: video.rating,
      published: video.published,
    }))
  }

  private async startSession () {
    this.session = await getYtSession()
  }
}
