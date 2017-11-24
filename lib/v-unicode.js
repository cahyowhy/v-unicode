const directive = {
  in: undefined,
  from: undefined,
  to: undefined
}

directive.checkFrom = function (from, event) {
  if (event.charCode < from) {
    event.preventDefault()
  }
}

directive.checkTo = function (to, event) {
  if (event.charCode > to) {
    event.preventDefault()
  }
}

directive.checkBetween = function (between, event) {
  if (!(event.charCode >= between.from && event.charCode <= between.to)) {
    event.preventDefault()
  }
}

directive.checkIn = function (values, event) {
  if (!values.find(u => u === event.charCode)) {
    event.preventDefault()
  }
}

directive.isInCharCode = function () {

}

directive.onEvent = function (event) {
  if (directive.in) {
    return directive.checkIn(directive.in, event)
  } else if (directive.from && directive.to) {
    return directive.checkBetween({ from: directive.from, to: directive.to }, event)
  } else if (directive.from) {
    return directive.checkFrom(directive.from, event)
  }
  return directive.checkTo(directive.to, event)
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
  el.addEventListener('keypress', directive.onEvent)
}

directive.unbind = function (el) {
  el.removeEventListener('keypress', directive.onEvent)
}

directive.update = function (el, binding) {
  const val = binding.value
  // Check val string
  return val
}

export default directive
