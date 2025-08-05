import { LiturgicalCalendar, Romcal } from 'romcal'
import { Canada_En } from '@romcal/calendar.canada'
import { DateTime } from 'luxon'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import lwcJSON from './assets/lwc.json' assert { type: 'json' }

const romcal = new Romcal({
  localizedCalendar: Canada_En,
})

let calendars: Record<number, LiturgicalCalendar> = {}

async function addRomcalIds() {
  for (const [date, item] of Object.entries(lwcJSON)) {
    const dateTime = DateTime.fromISO(date)

    if (!calendars.hasOwnProperty(dateTime.year)) {
      calendars[dateTime.year] = await romcal.generateCalendar(dateTime.year)
    }

    const calendar = calendars[dateTime.year]

    const romcalId = calendar[date].at(0)?.id

    if (!romcalId) {
      console.error(`No Romcal ID found for date: ${date}`)
      break
    }

    lwcJSON[date] = {
      ...item,
      id: romcalId,
    }
  }

  await writeFile(
    path.join('./assets/lwc.json'),
    JSON.stringify(lwcJSON, null, 2)
  )
  console.info('Romcal IDs added to lwc.json')
  console.info(`Total entries processed: ${Object.keys(lwcJSON).length}`)
  console.info(`Total years processed: ${Object.keys(calendars).length}`)
  console.info('Done!')
}

// addRomcalIds()
