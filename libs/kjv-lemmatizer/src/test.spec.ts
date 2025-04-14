import { expect, test } from 'vitest'
import nlp from 'compromise'

const NSRVUE =
  'These are the generations of the heavens and the earth when they were created. In the day that the Lord God made the earth and the heavens,'
const KJV =
  'These are the generations of the heavens and of the earth when they were created, in the day that the Lord God made the earth and the heavens,'
const NASB =
  'This is the account of the heavens and the earth when they were created, in the day that the Lord God made earth and heaven.'

const splitWord = 'create'

function splitText(text: string, splitWordLemma: string) {
  return nlp(text).splitAfter(`{${splitWordLemma}}`).out('array')[0]
}

test('splits each appropriately', () => {
  expect(splitText(NSRVUE, splitWord)).toEqual(
    'These are the generations of the heavens and the earth when they were created.'
  )
  expect(splitText(KJV, splitWord)).toEqual(
    'These are the generations of the heavens and of the earth when they were created,'
  )
  expect(splitText(NASB, splitWord)).toEqual(
    'This is the account of the heavens and the earth when they were created,'
  )
})
