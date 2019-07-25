
/* global jest describe it expect */

import unicode from '../lib/index'

const plugin = unicode
const directive = unicode.directive

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
  it('it has a bind and unbind methods available', () => {
    expect(typeof directive.bind).toBe('function')
    expect(typeof directive.unbind).toBe('function')
  })

  it('it has a shouldRestrict, onKeyPress, onPaste, config and validate methods available', () => {
    expect(typeof directive.shouldRestrict).toBe('function')
    expect(typeof directive.onKeyPress).toBe('function')
    expect(typeof directive.onPaste).toBe('function')
    expect(typeof directive.config).toBe('function')
    expect(typeof directive.validate).toBe('function')
  })

  describe('bind', () => {
    it('adds event listeners to the element', () => {
      const input = document.createElement('input')

      input.addEventListener = jest.fn()
      directive.bind(input, { value: [] })
      expect(input.addEventListener.mock.calls.length).toBe(2)
    })

    it('throws an error if value is not an object', () => {
      const input = document.createElement('input')
      const bindWithInvalidValue = () => directive.bind(input, { value: () => {} })

      expect(bindWithInvalidValue).toThrowError(/Argument must be an object/)
    })

    it('throws an error if value is not an array', () => {
      const input = document.createElement('input')
      const bindWithInvalidValue = () => directive.bind(input, {})

      expect(bindWithInvalidValue).toThrowError(/Argument must be an object/)
    })
  })

  describe('unbind', () => {
    it('removes the event listeners from the element', () => {
      const input = document.createElement('input')
      const binding = { value: [] }

      input.removeEventListener = jest.fn()
      directive.bind(input, binding)
      directive.unbind(input, binding)
      expect(input.removeEventListener.mock.calls.length).toBe(2)
    })
  })

  describe('onKeyPress', () => {
    it('it prevents the default if the event charCode is not allowed', () => {
      const preventDefault = jest.fn()
      const event = { charCode: 54, preventDefault }
      const bindingValue = [51]

      directive.onKeyPress(event, bindingValue)
      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('onPaste', () => {
    it('it prevents the default if the event charCode is not allowed', () => {
      const input = document.createElement('input')
      const bindingValue = [51]
      const preventDefault = jest.fn()
      const content = 'FOO'
      const event = {
        preventDefault,
        clipboardData: { getData: () => content }
      }

      directive.onPaste(input, event, bindingValue)
      expect(preventDefault).toHaveBeenCalled()
    })

    it('sanitizes the pasted values into the input value', () => {
      const input = document.createElement('input')
      const bindingValue = { from: 48, to: 57 } // Numeric values
      const preventDefault = jest.fn()
      const content = 'FOO-123-BAR-456'
      const sanitizedContent = '123456'
      const event = {
        preventDefault,
        clipboardData: { getData: () => content }
      }

      directive.onPaste(input, event, bindingValue)
      expect(preventDefault).toHaveBeenCalled()
      expect(input.value).toEqual(sanitizedContent)
    })

    it('sanitizes the restricted values into the input value', () => {
      const input = document.createElement('input')
      const bindingValue = {restrict: [48,49,50,51,52,53,54,55,56,57]} // restrict Numeric values
      const preventDefault = jest.fn()
      const content = 'FOO-123-BAR-456'
      const sanitizedContent = 'FOO--BAR-'
      const event = {
        preventDefault,
        clipboardData: { getData: () => content }
      }

      directive.onPaste(input, event, bindingValue)
      expect(preventDefault).toHaveBeenCalled()
      expect(input.value).toEqual(sanitizedContent)
    })
  })
})
