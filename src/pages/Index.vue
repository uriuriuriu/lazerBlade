<template lang="pug">
  div
    h1 index page
    el-row.row(:gutter="30")
      el-col.col(:span="8")
        .cont col8
      el-col.col(:span="8")
        .cont col8
      el-col.col(:span="8")
        .cont col8
    el-row.row(:gutter="20")
      el-col.col(:span="12")
        .cont col12
      el-col.col(:span="12")
        .cont col12
    hello
</template>

<script>
import Hello from 'src/components/Hello'
import { mapActions } from 'vuex'

export default {
  name: 'index',
  mounted () {
    this.setTitle('index')
  },
  components: {
    Hello
  },
  methods: {
    ...mapActions([ 'setTitle' ])
  }
}
</script>
<style lang="sass" scoped>
  .row
    margin-bottom: 20px
    &:last-child
      margin-bottom: 0
  .col
    .cont
      border-radius: 4px
      background-color: #FFF
      padding: 10px
</style>
