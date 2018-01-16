<template lang="pug">
  .title
    h1 you are in page {{ pageTitle }}
    h2 loading count {{ loadingCount }}
    h2 loading sets {{ loadingSets }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'hello',
  computed: {
    ...mapGetters([ 'pageTitle', 'loadingCount', 'loadingSets' ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
h1, h2
  font-weight: normal

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  color: #42b983
</style>
