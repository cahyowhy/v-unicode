
/* global jest describe it expect beforeEach */

import unicde from '../lib/index'

const plugin = unicde
const directive = unicde.directive

describe('v-unicode -> plugin', () => {
  it('install the directive into the vue instance', () => {
    const vue = {
      directive: jest.fn()
    }
    plugin.install(vue)
    expect(vue.directive).toHaveBeenCalledWith('unicode', directive)
    expect(vue.directive).toHaveBeenCalledTimes(1)
  })
})

describe('v-unicode -> directive', () => {
  let input = document.createElement('input')

  beforeEach(() => {
    directive.in = undefined
    directive.from = undefined
    directive.to = undefined
    input = document.createElement('input')
  })

  it('it has bind, update and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  describe('bind', () => {
    beforeEach(() => {
      directive.in = undefined
      directive.from = undefined
      directive.to = undefined
    })

    it('adds an event listener to the element', () => {
      input.addEventListener = jest.fn()
      directive.bind(input, { value: [] })
      expect(input.addEventListener.mock.calls.length).toBe(1)
    })

    it('throws an error if value is not an object', () => {
      const updateWithNoArray = () => directive.bind(input, { value: () => {} })
      expect(updateWithNoArray).toThrowError(/Argument must be an object/)
    })

    it('throws an error if value is not an array', () => {
      const updateWithNoArray = () => directive.bind(input, {})
      expect(updateWithNoArray).toThrowError(/Argument must be an object/)
    })

    it('saves the unicode array values', () => {
      const unicodeValues = [57, 100]
      directive.bind(input, { value: unicodeValues })
      expect(directive.in).toBe(unicodeValues)
      expect(directive.from).toBe(undefined)
      expect(directive.to).toBe(undefined)
    })

    it('saves the from value', () => {
      const from = 57
      directive.bind(input, { value: { from } })
      expect(directive.from).toBe(57)
      expect(directive.in).toBe(undefined)
      expect(directive.to).toBe(undefined)
    })

    it('saves the to value', () => {
      const to = 57
      directive.bind(input, { value: { to } })
      expect(directive.to).toBe(57)
      expect(directive.in).toBe(undefined)
      expect(directive.from).toBe(undefined)
    })

    it('saves the from and to values', () => {
      const between = { from: 40, to: 60 }
      directive.bind(input, { value: between })
      expect(directive.from).toBe(40)
      expect(directive.to).toBe(60)
      expect(directive.in).toBe(undefined)
    })
  })

  describe('unbind', () => {
    it('removes the event listener from the element', () => {
      input.removeEventListener = jest.fn()
      directive.bind(input, { value: [] })
      directive.unbind(input)
      expect(input.removeEventListener.mock.calls.length).toBe(1)
    })
  })

  describe('onEvent', () => {
    it('it executes the event listener callback and it prevents the default if the event is not allowed', () => {
      const preventDefault = jest.fn()
      const event = { charCode: 54, preventDefault }
      const allowedValues = [52]

      directive.bind(input, { value: allowedValues })

      directive.onEvent(event)
      expect(preventDefault).toHaveBeenCalled()
    })
  })
})
