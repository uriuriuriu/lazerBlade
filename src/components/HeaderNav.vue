<template lang="pug">
  el-menu(:default-active="$route.path", :router="true", mode="horizontal", @select="handleSelect")
    el-menu-item(index="/") Home
    el-menu-item(index="/scrollPage") scrollPage
    el-menu-item(index="/about") About
    // el-submenu(index="2")
      template(slot="title") Workspace
      el-menu-item(index="2-1") item one
      el-menu-item(index="2-2") item two
      el-menu-item(index="2-3") item three
    // el-menu-item(index="3")
      a(href="https://www.ele.me", target="_blank") Orders
  </template>

<script>
export default {
  name: 'haderNav',
  data () {
    return {
      // activeIndex: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
