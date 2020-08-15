import $ from 'jquery'

export function jsonp(url, args, options = {timeout: 3000}) {
  function generateJsonpCallback() {
    return `jsonpcallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`
  }

  function removeScript(id) {
    document.body.removeChild(document.getElementById(id))
  }

  function removeFunc(name) {
    delete global[name]
  }

  const timeout = options.timeout
  let timeId
  return new Promise((resolve, reject) => {
    const funcName = generateJsonpCallback()
    global[funcName] = (res) => {
      resolve(res)
      timeId = setTimeout(() => {
        removeScript(funcName)
        removeFunc(funcName)
      }, timeout)
    }
    const script = document.createElement('script')
    var fullUrl = `${url}?callback=${funcName}`
    for (var argk in args) {
      fullUrl += '&' + argk + '=' + encodeURI(args[argk])
    }
    script.src = fullUrl
    script.id = funcName
    script.type = 'text/javascript'
    document.body.appendChild(script)
    script.onerror = () => {
      reject(new Error(`fetch ${url} failed`))
      removeScript(funcName)
      removeFunc(funcName)
      if (timeId) clearTimeout(timeId)
    }
  })
}

function ajax(url, args) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      headers: {'X-HTTP-Method-Override': 'GET'},
      url: url,
      dataType: 'jsonp',
      data: args,
      success: function (result) {
        if (!result.error) {
          // translated text in
          // result.data.translations[0].translatedText
          resolve(result)
        } else {
          reject(result)
        }
      }
    })
  })
}

function splitQuery(query, texts, startIndex, result, promises) {
  var url = 'https://www.googleapis.com/language/translate/v2'
  var q = texts[startIndex]
  var splitChar = '|'
  var maxLength = 0
  for (var i = startIndex + 1; i < texts.length; i++) {
    var text = texts[i]
    var nextq = ''
    nextq = q + splitChar + text
    if (nextq.length > maxLength) {
      query.q = q
      promises.push(
        jsonp(url, query).then((r) => {
          console.log(r)
          var tTexts = r.data.translations[0].translatedText.split(splitChar)
          for (var j = 0; j < tTexts.length; j++) {
            result[texts[startIndex + j]] = tTexts[j]
          }
        })
      )
      splitQuery(query, texts, i, result, promises)
      return
    } else {
      q = nextq
    }
  }
  if (q) {
    query.q = q
    promises.push(
      jsonp(url, query).then((r) => {
        console.log(r)
        var tTexts = r.data.translations[0].translatedText.split(splitChar)
        for (var j = 0; j < tTexts.length; j++) {
          result[texts[startIndex + j]] = tTexts[j]
        }
      })
    )
  }
}

function request(method, args) {
  var query = {
    key: args.googleKey,
    source: args.sourceLanguage,
    target: args.lan,
    q: ''
  }
  var result = {}
  var promises = []
  var texts = []
  for (var i = 0; i < args.texts.length; i++) {
    if (args.texts[i]) {
      texts.push(args.texts[i])
    }
  }
  if (texts.length == 0) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }
  console.log(args)
  splitQuery(query, texts, 0, result, promises)
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then((r) => {
        console.log(result)
        resolve({translateWords: result, lan: args.lan})
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export default {request}
