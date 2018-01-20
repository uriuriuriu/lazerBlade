<template lang="pug">
  div
    h1
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'index',
  mounted () {
    this.setTitle('index')
  },
  components: {
  },
  methods: {
    ...mapActions([ 'setTitle' ])
  }
}
</script>
<style lang="sass" scoped>
</style>
