import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import utcPlugin from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import en from 'dayjs/locale/en'
import vi from 'dayjs/locale/vi'

dayjs.extend(updateLocale)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.locale(en)
dayjs.locale(vi)

export default dayjs