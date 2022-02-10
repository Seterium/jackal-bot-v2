import { URL, URLSearchParams } from 'url'

import miniget from 'miniget'

enum SearchEnities {
  channels = 'channel',
  videos = 'video'
}

export default class YtSearch {
  private readonly searchTypes = {
    channels: 'EgIQAg%3D%3D',
    videos: 'EgIQAQ%3D%3D',
  }

  public async videos (query: string) {
    return await this.search(query, SearchEnities.videos)
  }

  public async channels (query: string) {
    return await this.search(query, SearchEnities.channels)
  }

  private async search (query: string, type: SearchEnities) {
    const url = new URL('https://www.youtube.com/results')

    url.search = new URLSearchParams({
      search_query: query,
      sp: this.searchTypes[type],
    }).toString()

    let result: any

    try {
      result = await miniget(url, {
        headers: {
          'Accept-Language': 'ru-RU',
        },
      }).text()
    } catch (error) {
      throw new Error('Fail to get YouTube search results.')
    }

    const parsed = this.parse(result)
    let mapped: any

    try {
      mapped = this.map(parsed, type)
    } catch (error) {
      throw new Error('Fail to map YouTube search results.')
    }

    return mapped
  }

  private parse (input: any) {
    const startPointer = 'var ytInitialData = '

    const start = input.indexOf(startPointer)
    const end = input.indexOf(';</script>', start)

    const data = input.substring(start + startPointer.length, end)

    let parsed: any

    try {
      parsed = JSON.parse(data)
    } catch (error) {
      throw new Error('Fail to parse YouTube search results.')
    }

    parsed = parsed.contents.twoColumnSearchResultsRenderer.primaryContents

    let contents = []

    if (parsed.sectionListRenderer) {
      contents = parsed.sectionListRenderer.contents
        .filter(item => item?.itemSectionRenderer?.contents
          .filter(x => x.videoRenderer || x.playlistRenderer || x.channelRenderer)
        )
        .shift().itemSectionRenderer.contents
    }

    if (parsed.richGridRenderer) {
      contents = parsed.richGridRenderer.contents
        .filter(item => item.richItemRenderer && item.richItemRenderer.content)
        .map(item => item.richItemRenderer.content)
    }

    return contents.slice(0, 24)
  }

  private map (
    input: any[],
    type: SearchEnities
  ) {
    const enitiesParser = {
      channel: {
        check: (channel: any) => channel.channelRenderer !== undefined,
        map: (channel: any, key: number) => this.mapChannelsData(channel.channelRenderer, key),
      },
      video: {
        check: (video: any) => video.videoRenderer && video.videoRenderer?.lengthText,
        map: (video: any, key: number) => this.mapVideosData(video.videoRenderer, key),
      },
    }

    const results: any[] = []

    for (const entity of input) {
      if (enitiesParser[type].check(entity)) {
        const result = enitiesParser[type].map(
          entity,
          results.length + 1
        )

        results.push(result)
      }
    }

    return results
  }

  private mapChannelsData (parsed: any, key: number) {
    const {
      id,
      title,
      channelId,
      author,
      duration,
      views,
      rating,
      published,
    } = parsed

    return {
      id,
      key: key + 1,
      title,
      channel: {
        id: channelId,
        title: author,
      },
      cover: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      duration: formatDuration(duration, 'full'),
      durationRaw: duration,
      views: formatViews(views),
      rating,
      published,
    }
  }

  private mapVideosData (parsed: any, key: number) {
    const {
      videoId: id,
      ownerText: {
        runs: [
          {
            text: channelTitle,
            navigationEndpoint: {
              browseEndpoint: {
                browseId: channelId,
              },
            },
          },
        ],
      },
      title: {
        runs: [
          {
            text: title,
          },
        ],
      },
      lengthText: {
        simpleText: duration,
      },
      viewCountText,
      publishedTimeText,
    } = parsed

    const views = +(viewCountText?.simpleText.replace(/[^0-9]/g, '')) || 0
    const uploaded = publishedTimeText?.simpleText || '-'
    const cover = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

    return {
      id,
      key,
      title,
      channel: {
        id: channelId,
        title: channelTitle,
      },
      cover,
      duration,
      views: views ? formatViews(views) : 'неизвестно',
      uploaded,
    }
  }
}
