import switcher from './switch'
if (!window._translate_instance) {
  window._translate_instance = {}
}
var webebuy = window._translate_instance

/**
 *
 * {
 *  sourceLanguage: 'zh-CN',    // 网站原始语言
 *  translateMode:1,            // 翻译对象 1:全部， 2：包含， 3：不包含
 *  querySelector：'.classname' // 页面原始查询范围，多个用逗号分隔
 * }
 */
webebuy.config = function (config) {
  switcher.setConfig(config)
}

webebuy.toLanguage = function (language) {
  if (language && language != switcher.config.sourceLanguage) {
    switcher.toLanguage({name: language})
  } else {
    switcher.restore()
  }
}

export default webebuy
