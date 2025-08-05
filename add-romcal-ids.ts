import { LiturgicalCalendar, Romcal } from 'romcal'
import { Canada_En } from '@romcal/calendar.canada'
import { DateTime } from 'luxon'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import lwcJSON from './assets/canada-lectionary-raw.json' assert { type: 'json' }

const romcal = new Romcal({
  localizedCalendar: Canada_En,
})

let calendars: Record<number, LiturgicalCalendar> = {}

const newJSON: Record<string, any> = {}

async function addRomcalIds() {
  for (const [date, item] of Object.entries(lwcJSON)) {
    const dateTime = DateTime.fromISO(date)

    if (!calendars.hasOwnProperty(dateTime.year)) {
      console.log(dateTime.year, 'not found in calendars, generating...')
      calendars[dateTime.year] = await romcal.generateCalendar(dateTime.year)
    }

    const calendar = calendars[dateTime.year]

    const romcalId = calendar[date].at(0)?.id

    if (!romcalId) {
      console.error(`No Romcal ID found for date: ${date}`)
      break
    }

    newJSON[romcalId] = {
      ...item,
      id: romcalId,
    }
  }

  await writeFile(
    path.join('./assets/canada-lectionary-raw.json'),
    JSON.stringify(newJSON, null, 2)
  )

  console.info('Romcal IDs added to canada-lectionary-raw.json')
  console.info(`Total entries processed: ${Object.keys(newJSON).length}`)
  console.info(`Total years processed: ${Object.keys(calendars).length}`)
  console.info('Done!')
}

addRomcalIds()
