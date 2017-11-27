const directive = {
  in: undefined,
  from: undefined,
  to: undefined
}

directive.shouldRestrict = function (unicode) {
  if (directive.in) {
    // Look unicode in an array of values
    return !directive.in.find(u => u === unicode)
  } else if (directive.from && directive.to) {
    // Look unicode in between two values
    return !(unicode >= directive.from && unicode <= directive.to)
  } else if (directive.from) {
    // Look unicode from a specific value
    return unicode < directive.from
  }
  // Look unicode to a specific value
  return unicode > directive.to
}

directive.onEvent = function (event) {
  if (directive.shouldRestrict(event.charCode)) {
    event.preventDefault()
  }
}

directive.bind = function (el, binding) {
  if (typeof binding.value !== 'object') {
    throw new Error('Argument must be an object')
  }
  if (Array.isArray(binding.value)) {
    directive.in = binding.value
  }
  directive.from = binding.value.from
  directive.to = binding.value.to
  el.addEventListener('input', directive.onEvent)
}

directive.unbind = function (el) {
  el.removeEventListener('input', directive.onEvent)
}

directive.update = function (el, binding) {
  const val = binding.value
  // Check val string
  return val
}

export default directive
