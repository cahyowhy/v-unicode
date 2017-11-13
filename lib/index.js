import directive from './v-unicode'

const plugin = {
  install (Vue) {
    Vue.directive('unicode', directive)
  },
  directive
}

export default plugin
