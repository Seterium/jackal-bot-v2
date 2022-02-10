import crypto from 'crypto'

import ffmpeg from 'fluent-ffmpeg'

type ProgressCallback = (status: any) => void

export default async (video: string, compression: number, progress: ProgressCallback) => {
  const filename = crypto.randomUUID()
  const output = `${process.env.PWD}/public/videos/${filename}.mp4`

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(video)
      .format('mp4')
      .videoCodec('libx264')
      .outputOptions(`-crf ${compression}`)
      .on('progress', progress)
      .on('end', resolve)
      .on('error', reject)
      .output(output)
      .run()
  })

  return output
}
