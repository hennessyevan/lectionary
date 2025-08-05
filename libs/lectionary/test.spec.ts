import { describe, it } from 'vitest'
import { Romcal } from 'romcal'
import { Canada_En } from '@romcal/calendar.canada'
import lwc from '../../assets/lwc.json' assert { type: 'json' }
import { uniqBy } from 'lodash-es'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

describe('full canada calendar', () => {
  it('should have an entry for every date in the next 3 years', async () => {
    const romcal = new Romcal({
      localizedCalendar: Canada_En,
    })

    const allDefs = await romcal.getAllDefinitions()

    const uniqueLwcDates = uniqBy(
      Object.entries(lwc).map(([date, item]) => ({
        date,
        ...item,
      })),
      'id'
    )

    const missingLwcDates = Object.keys(allDefs).filter((id) => {
      return !uniqueLwcDates.some((item) => item.id === id)
    })

    console.log(
      Object.entries(allDefs).length,
      'unique dates in romcal Canada calendar'
    )
    console.log(Object.entries(lwc).length, 'dates in lwc.json')
    console.log(
      uniqueLwcDates.length,
      'unique dates in lwc.json after removing duplicates'
    )

    await writeFile(
      path.join(__dirname, './missing-ids.txt'),
      JSON.stringify(missingLwcDates, null, 2)
    )
  })
})
