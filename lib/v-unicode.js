const directive = {}

directive.shouldRestrict = function (config, unicode) {
  if (config.in) {
    // Look unicode in an array of values
    return !config.in.find(u => u === unicode)
  } else if(config.restrict) {
    // Look unicode in restrict unicodes
    return config.restrict.find(u => u === unicode)
  } else if (config.from && config.to) {
    // Look unicode in between two values
    return !(unicode >= config.from && unicode <= config.to)
  } else if (config.from) {
    // Look unicode from a specific value
    return unicode < config.from
  }
  // Look unicode for a specific value
  return unicode > config.to
}

directive.onKeyPress = function (event, bindingValue) {
  const config = directive.config(bindingValue)
  if (directive.shouldRestrict(config, event.charCode)) {
    event.preventDefault()
  }
}

directive.onPaste = function (el, event, bindingValue) {
  const config = directive.config(bindingValue)

  const content = event.clipboardData
    ? event.clipboardData.getData('text/plain')
    : window.clipboardData.getData('Text')

  const restrictedCharIndex = content
    .split('')
    .findIndex(char => directive.shouldRestrict(config, char.charCodeAt(0)))

  if (restrictedCharIndex < 0) {
    return
  }

  event.preventDefault()
  let sanitizedContent = content.slice(0, restrictedCharIndex)

  content
    .slice(restrictedCharIndex)
    .split('')
    .forEach((char) => {
      if (!directive.shouldRestrict(config, char.charCodeAt(0))) {
        sanitizedContent += char
      }
    })

  el.value = sanitizedContent
}

directive.config = function (value) {
  const config = {}
  if (Array.isArray(value)) {
    config.in = value
    return config
  } else if (value && Array.isArray(value.restrict)) {
    config.restrict = value.restrict;
    return config
  }

  config.from = value.from
  config.to = value.to
  return config
}

directive.validate = function (bindingValue) {
  if (typeof bindingValue !== 'object') {
    throw new Error('Argument must be an object')
  }
}

directive.bind = function (el, binding) {
  directive.validate(binding.value)
  el.addEventListener('keypress', event => directive.onKeyPress(event, binding.value))
  el.addEventListener('paste', event => directive.onPaste(el, event, binding.value))
}

directive.unbind = function (el, binding) {
  directive.validate(binding.value)
  el.removeEventListener('keypress', event => directive.onKeyPress(event, binding.value))
  el.removeEventListener('paste', event => directive.onPaste(el, event, binding.value))
}

export default directive
