import windowSwitcher from './windowSwitcher'

var switcher = {
  currentLanguage: null,
  config: null,
  words: {},
  remoteWords: {},
  overrideFunctions: ['alert', 'confirm', 'prompt'],
  overrideOriginal: {},
  windowSwitchers: [],
  cachedTranslateNodes: new Map(),
  isInit: false
}

switcher.setConfig = function (config) {
  switcher.config = config
}

switcher.init = function () {
  if (!switcher.isInit) {
    var rootSwitcher = new windowSwitcher(window, switcher)
    switcher.windowSwitchers.push(rootSwitcher)
    // if (switcher.config.iframe) {
    //   var iframes = window.document.querySelectorAll('iframe')
    //   for (var i = 0; i < iframes.length; i++) {
    //     var iframe = iframes[i]
    //     var iframeWindow = iframe.contentWindow || iframe
    //     var ws = new windowSwitcher(iframeWindow, switcher)
    //     switcher.windowSwitchers.push(ws)
    //   }
    // }
    switcher.isInit = true
  }
}

switcher.restore = function () {
  switcher.currentLanguage = null
  for (var i = 0; i < switcher.windowSwitchers.length; i++) {
    var ws = switcher.windowSwitchers[i]
    ws.restore()
  }
}

switcher.toLanguage = function (language) {
  if (language != switcher.currentLanguage) {
    switcher.init()
    switcher.currentLanguage = language
    for (var i = 0; i < switcher.windowSwitchers.length; i++) {
      var ws = switcher.windowSwitchers[i]
      ws.toLanguage(language)
    }
  }
}

export default switcher
