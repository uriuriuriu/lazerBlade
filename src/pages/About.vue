<template lang="pug">
  div
    h1 about page
    Hello
    .user(v-if="user")
      img(:src="user.avatar_url")
      p hello, i am {{ user.name }}
      p
        | github:
        a(:href="user.html_url") {{ user.login }}
</template>

<script>
import Hello from 'src/components/Hello'
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
    Hello
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
img
  width: 150px
</style>
