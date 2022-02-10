import dayjs from 'dayjs'

import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import duration from 'dayjs/plugin/duration.js'
import updateLocale from 'dayjs/plugin/updateLocale.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'

import 'dayjs/locale/ru.js'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

dayjs.tz.setDefault('Europe/Kaliningrad')
dayjs.locale('ru')

export default dayjs
