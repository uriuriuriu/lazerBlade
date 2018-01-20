<template lang="pug">
  div
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
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'scrollPage',
  mounted () {
    this.setTitle('scroll page')
  },
  components: {
  },
  methods: {
    ...mapActions([ 'setTitle' ])
  }
}
</script>
<style lang="sass" scoped>
  .row
    margin-bottom: 300px
    &:last-child
      margin-bottom: 0
  .col
    .cont
      border-radius: 4px
      background-color: rgba(#FFF, .1)
      border: solid 1px #FFF
      padding: 300px 10px
      color: #FFF
</style>
