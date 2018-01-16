let windowStatePlugin = {
  install: function (Vue) {
    // ウィンドウの状態
    let state = {
      scrollX: 0,
      scrollY: 0,
      width: 0,
      height: 0
    }
    // スクロール数値を取得
    let onScroll = function () {
      state.scrollX = window.pageXOffset
      state.scrollY = window.pageYOffset
    }
    document.addEventListener('scroll', onScroll)
    // ウィンドウのサイズを取得
    let onResize = function () {
      state.width = document.documentElement.clientWidth
      state.height = document.documentElement.clientHeight
    }
    window.addEventListener('resize', onResize)
    // 初期値を更新
    window.addEventListener('load', function () {
      onScroll()
      onResize()
    })
    // プロパティ $window を定義
    Vue.util.defineReactive(Vue.prototype, '$window', state)
  }
}
export default windowStatePlugin
