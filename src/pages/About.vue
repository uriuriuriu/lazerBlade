<template lang="pug">
  .outer
    .inner
      h1 about
      .user(v-if="user")
        a(:href="user.html_url")
          img.img(:src="user.avatar_url")
        p
          | twitter:
          a(href="https://twitter.com/uriuriuriu") @uriuriuriu
        p
          | github:
          a(:href="user.html_url") {{ user.login }}
</template>

<script>
import { mapActions } from 'vuex'
import * as apis from 'src/apis/index'

export default {
  name: 'about',
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.setTitle('about')
    this.getUser()
  },
  components: {
  },
  methods: {
    async getUser () {
      let data = await apis.get(`${apis.GET_USER_URL}/uriuriuriu`, {}, true)
      console.log(data)
      if (data.message) {
        // req error
        alert(data.message)
      } else {
        this.user = data
      }
    },
    ...mapActions([ 'setTitle' ])
  }
}
</script>

<style lang="sass" scoped>
.outer
  display: table
  width: 100%
  height: calc(80vh - 61px)
.inner
  display: table-cell
  vertical-align: middle
.img
  width: 150px
  border-radius: 6px
</style>
