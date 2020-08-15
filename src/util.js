import cookie from 'js-cookie'
var util = {}

util.isElementChild = function (parent, child) {
  var current = child
  while (current) {
    if (current == parent) {
      return true
    }
    current = current.parentNode
  }
  return false
}

util.formatString = function (formatStr, args) {
  for (var key in args) {
    formatStr = formatStr.replace(
      new RegExp('\\{' + key + '\\}', 'g'),
      args[key]
    )
  }
  return formatStr
}

util.getComputedStyle = function (el, style) {
  if (el.computedStyleMap) {
    return el.computedStyleMap().get(style).value
  }
  return window.getComputedStyle(el)[style]
}

util.escapeRegExp = function (string) {
  var regExp = new RegExp('[.*+?^${}()|[\\]\\\\]', 'g')
  return string.replace(regExp, '\\$&')
  //$&表示整个被匹配的字符串
}

/// revert of format string , useLocale : 'a {0} b {1} c', afterFormat: 'a arg1 b arg2 c', return {0: arg1, 1: arg2}
util.revertFormatString = function (useLocale, afterFormat) {
  if (useLocale) {
    var regExp = new RegExp('\\{[0-9]+\\}', 'g')
    var matchRegex = regExp
    var matchs = useLocale.match(matchRegex)
    if (matchs && matchs.length > 0) {
      var args = {}
      var beforeStr = useLocale
      var afterStr = afterFormat
      for (var i = 0; i < matchs.length; i++) {
        var match = matchs[i]
        var argIndex = match.substring(1, match.length - 1)
        var matchIndex = beforeStr.indexOf(match)

        var startStr = beforeStr.substring(0, matchIndex)
        if (startStr && afterStr.indexOf(startStr) != 0) {
          // the string format is not match
          return null
        }

        beforeStr = beforeStr.substring(matchIndex + match.length)
        afterStr = afterStr.substring(matchIndex)

        if (!beforeStr) {
          args[argIndex] = afterStr
        } else {
          var nextIndex = 0
          if (i == matchs.length - 1) {
            nextIndex = beforeStr.length
          } else {
            nextIndex = beforeStr.indexOf(matchs[i + 1])
          }
          var matchString = beforeStr.substring(0, nextIndex)

          var afterIndex = afterStr.indexOf(matchString)

          var argValue = afterStr.substring(0, afterIndex)
          afterStr = afterStr.substring(afterIndex)

          args[argIndex] = argValue
        }
      }
      return args
    }
  } else {
    return null
  }
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
util.guid = function () {
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

var cookie_key = '_webebuy_cookie_cache'
util.getCookie = function () {
  var str = cookie.get(cookie_key)
  if (str) {
    return JSON.parse(str)
  }
  return {}
}
util.setCookie = function (key, value) {
  var original = util.getCookie()
  original[key] = value
  cookie.set(cookie_key, JSON.stringify(original))
}

String.prototype.myStartsWith = function (str) {
  if (str) {
    return this.indexOf(str) == 0
  }
  return false
}

String.prototype.myEndsWith = function (str) {
  if (str) {
    return this.lastIndexOf(str) == this.length - str
  }
  return false
}

util.inIframe = function () {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

util.onload = function (el, callback) {
  if (el.nodeName == 'IFRAME') {
    var isCallback = false
    try {
      var timer = null
      var checkState = function () {
        var doc = el.document || el.contentDocument || el.contentWindow.document
        if (
          doc.location &&
          doc.location.href &&
          doc.location.href != 'about:blank' &&
          (doc.readyState === 'complete' || doc.readyState === 'interactive')
        ) {
          console.log(doc.location)
          console.log(doc.location.href)
          isCallback = true
          callback('IFRAME', el.contentWindow || el)
        } else {
          timer = setTimeout(checkState, 200)
        }
      }
      checkState()
    } catch (err) {
      console.warn(err)
    } finally {
      console.log('run loaded')
      if (!isCallback) {
        if (el.addEventListener) {
          el.addEventListener('load', callback, true)
        } else if (el.attachEvent) {
          //ie
          el.attachEvent('onload', callback)
        } else {
          el.onload = callback
        }
      }
    }
  } else {
    var doc = el.document
    if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
      callback()
      return
    }
    if (el.addEventListener) {
      el.addEventListener('load', callback, true)
    } else if (el.attachEvent) {
      //ie
      el.attachEvent('onload', callback)
    } else {
      el.onload = callback
    }
  }
}

export default util
