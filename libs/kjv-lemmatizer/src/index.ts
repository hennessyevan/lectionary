import {
  KJV_LEMMATIZED_JSON_PATH,
  KJV_SOURCE_JSON_PATH,
} from '@hennessyevan/constants'
import nlp from 'compromise'
import { readFileSync, writeFileSync } from 'node:fs'

interface KJVJSON {
  [book: string]: {
    [chapter: number]: {
      [verse: number]: string
    }
  }
}

const kjvSource = JSON.parse(
  readFileSync(KJV_SOURCE_JSON_PATH, 'utf8')
) as KJVJSON

const kjvLemmatized: KJVJSON = {}

for (const book in kjvSource) {
  if (!kjvLemmatized[book]) {
    kjvLemmatized[book] = {}
  }

  for (const chapter in kjvSource[book]) {
    if (!kjvLemmatized[book][chapter]) {
      kjvLemmatized[book][chapter] = {}
    }

    for (const verse in kjvSource[book][chapter]) {
      const text = kjvSource[book][chapter][verse]

      kjvLemmatized[book][chapter][verse] = nlp(text)
        .compute('root')
        .text('root')
    }
  }
}

writeFileSync(KJV_LEMMATIZED_JSON_PATH, JSON.stringify(kjvLemmatized, null, 2))
