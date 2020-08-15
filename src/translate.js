import api from './api'
import constant from './constant'
import util from './util'
// node: html node
// config: language settinngs
// words: the translate words text
// remoteWords: all the text that has try translate, contains the faild text
// attribute : if attribute has value, only translate the attribute value text
function translateNode(node, globalData, attribute, queryNodes) {
  var that = this
  this.originalNode = node
  this.sourceLanguage = globalData.config.sourceLanguage
  that.cachedTranslateNodes = globalData.cachedTranslateNodes
  // var textAttr = constant.attrPrefix + 'text'
  // if (
  //   node.nodeName == '#text' &&
  //   node.parentNode &&
  //   (node.parentNode.nodeName == 'TITLE' ||
  //     (node.parentNode.nodeName == 'FONT' &&
  //       node.parentNode.getAttribute(textAttr)))
  // ) {
  //   node.parentNode.removeAttribute(textAttr)
  //   this.node = node.parentNode
  // } else {
  //   this.node = node
  // }
  if (that.cachedTranslateNodes.get(node)) {
    delete that.cachedTranslateNodes.get(node)
  }
  this.node = node

  this.config = globalData.config
  this.words = globalData.words
  this.remoteWords = globalData.remoteWords
  this.lan = null
  this.attribute = attribute
  this.queryNodes = queryNodes
  this.document = this.node.ownerDocument

  this.mergeWords = function (newWords, lan) {
    for (var text in newWords) {
      if (!this.words[text]) {
        this.words[text] = {}
      }
      this.words[text][lan] = newWords[text]
    }
  }

  this.getLanguageText = function (text) {
    if (this.words[text]) {
      return this.words[text][this.lan]
    }
    // match the text that contains the replace words {w}
    for (var item in this.words) {
      var args = util.revertFormatString(item, text)
      if (args) {
        var replacedText = this.words[item][this.lan]
        if (replacedText) {
          return util.formatString(replacedText, args)
        }
      }
    }
    return null
  }

  // only check the exclude mode, the other mode is checked before run translateNode
  this.shouldTranslate = function (n) {
    var constantValue = constant
    if (
      this.config.translateMode == 3 &&
      this.queryNodes &&
      this.queryNodes.length > 0
    ) {
      for (var i = 0; i < this.queryNodes.length; i++) {
        var queryNode = this.queryNodes[i]
        if (queryNode == n) {
          return false
        }
      }
    }
    var result =
      n.functionName ||
      (!n.isContentEditable &&
        !(constantValue.ignoreNodeNames.indexOf(n.nodeName) >= 0) &&
        !(
          n.parentNode &&
          constantValue.ignoreNodeNames.indexOf(n.parentNode.nodeName) >= 0
        ) &&
        !(n.nodeName == '#text' && n.parentNode.isContentEditable))
    return result
  }

  this.getTranslateTexts = function (node) {
    var texts = []
    var that = this
    if (this.shouldTranslate(node)) {
      if (this.attribute) {
        if (this.attribute == '#text' && node.nodeName == '#text') {
          texts.push(node.textContent.trim())
        } else {
          var attValue = node.getAttribute(this.attribute)
          if (attValue && attValue.trim()) {
            var text = attValue.trim()
            texts.push(text)
          }
        }
      } else {
        function innerGetTranslateTexts(node) {
          if (!that.shouldTranslate(node)) {
            return
          }
          var isStopped = false
          var cachedNodeData = that.cachedTranslateNodes.get(node)
          if (node.nodeName == '#text') {
            var text
            if (cachedNodeData && cachedNodeData.text) {
              text = cachedNodeData.text
            } else {
              text = node.textContent.trim()
            }
            if (text && texts.indexOf(text) < 0) {
              texts.push(text)
            }
            isStopped = true
          } else if (node.getAttribute) {
            for (var i = 0; i < constant.translateAttrs.length; i++) {
              var att = constant.translateAttrs[i]
              if (cachedNodeData && cachedNodeData[att]) {
                // already translated node, get the oridinal text
                var text = cachedNodeData[att]
                if (text) {
                  texts.push(text)
                }
              } else {
                // not translated node, get the attribute text
                var attValue = node.getAttribute(att)
                if (attValue && attValue.trim()) {
                  var text = attValue.trim()
                  if (text && texts.indexOf(text) < 0) {
                    texts.push(text)
                  }
                }
              }
            }
          }
          if (!isStopped) {
            for (var i = 0; i < node.childNodes.length; i++) {
              innerGetTranslateTexts(node.childNodes[i])
            }
          }
        }

        innerGetTranslateTexts(node)
      }
    }
    return texts
  }

  this.translateNodeAttribute = function (node, att) {
    var attValue = node.getAttribute(att)
    if (attValue && attValue.trim()) {
      var text = attValue.trim()
      var translateText = this.getLanguageText(text)
      if (translateText) {
        var cachedNodeData = that.cachedTranslateNodes.get(node)
        if (!cachedNodeData) {
          cachedNodeData = {}
          cachedNodeData[att] = text
          that.cachedTranslateNodes.set(node, cachedNodeData)
        }
        node.setAttribute(att, translateText)
      }
    }
  }

  this.translateNodes = function (node) {
    if (!this.shouldTranslate(node)) {
      return
    }
    var isStopped = false
    var cachedNodeData = that.cachedTranslateNodes.get(node)
    if (this.attribute) {
      if (this.attribute == '#text' && node.nodeName == '#text') {
        var text = node.textContent.trim()
        if (text) {
          var translateText = this.getLanguageText(text)
          if (translateText) {
            if (!cachedNodeData) {
              cachedNodeData = {text: text}
              that.cachedTranslateNodes.set(node, cachedNodeData)
            }
            node.textContent = translateText
          }
        }
      } else {
        this.translateNodeAttribute(node, this.attribute)
      }
      return
    }
    if (node.nodeName == '#text') {
      var text = null
      if (cachedNodeData && cachedNodeData.text) {
        text = cachedNodeData.text
      } else {
        text = node.textContent.trim()
      }
      if (text) {
        var translateText = this.getLanguageText(text)
        if (translateText) {
          if (!cachedNodeData) {
            cachedNodeData = {text: text}
            that.cachedTranslateNodes.set(node, cachedNodeData)
          }
          node.textContent = translateText
          // var font = this.document.createElement('font')
          // font.setAttribute(constant.attrPrefix + 'text', text)
          // font.innerText = translateText
          // node.replaceWith(font)
        }
      }
      isStopped = true
    } else if (node.getAttribute) {
      if (cachedNodeData && cachedNodeData.text) {
        // already translated font node
        var text = cachedNodeData.text
        var translateText = this.getLanguageText(text)
        if (translateText) {
          node.textContent = translateText
        }
        isStopped = true
      } else {
        for (var i = 0; i < constant.translateAttrs.length; i++) {
          var att = constant.translateAttrs[i]
          if (cachedNodeData && cachedNodeData[att]) {
            // already translated node, get the oridinal text
            var text = cachedNodeData[att]
            if (text) {
              var translateText = this.getLanguageText(text)
              if (translateText) {
                node.setAttribute(att, translateText)
              }
            }
          } else {
            // not translated node, get the attribute text
            this.translateNodeAttribute(node, att)
          }
        }
      }
    }
    if (!isStopped) {
      for (var i = 0; i < node.childNodes.length; i++) {
        this.translateNodes(node.childNodes[i])
      }
    }
  }

  this.innerToLanguage = function (lan, watcher) {
    return new Promise((resolve, reject) => {
      watcher.stop()
      var needRemoteTranslateTexts = []
      var texts = this.getTranslateTexts(this.node)
      for (var i = 0; i < texts.length; i++) {
        var text = texts[i]
        //
        if (
          !this.getLanguageText(text) &&
          !(this.remoteWords[text] && this.remoteWords[text][lan])
        ) {
          needRemoteTranslateTexts.push(text)
        }
      }
      if (needRemoteTranslateTexts.length > 0) {
        watcher.start()
        var requestTextArgs = []
        needRemoteTranslateTexts.forEach((n) => requestTextArgs.push(n))
        api
          .request('gettranslatedata', {
            texts: requestTextArgs,
            lan: this.lan,
            sourceLanguage: that.sourceLanguage,
            googleKey: this.config.googleKey
          })
          .then((res) => {
            if (res) {
              watcher.stop()
              if (!needRemoteTranslateTexts) {
                debugger
              }
              for (var j = 0; j < needRemoteTranslateTexts.length; j++) {
                var remoteText = needRemoteTranslateTexts[j]
                if (!this.remoteWords[remoteText]) {
                  this.remoteWords[remoteText] = {}
                }
                this.remoteWords[remoteText][lan] = true
              }

              this.mergeWords(res.translateWords, res.lan)
              var result = this.translateNodes(this.node)
              watcher.start()
              resolve(result)
            }
          })
          .catch((err) => {
            console.error(err)
            this.translateNodes(this.node)
            watcher.start()
            resolve()
          })
      } else {
        this.translateNodes(this.node)
        watcher.start()
        resolve()
      }
    })
  }

  this.toLanguage = function (lan, watcher) {
    this.lan = lan
    if (this.node.functionName) {
      // alert, confirm, promt function can not be sync, so get translate text direct
      var tText = this.getLanguageText(this.node.text)
      if (tText) {
        this.node.arguments[0] = tText
      }
      return this.node.excute.apply(window, this.node.arguments)
    } else {
      return this.innerToLanguage(lan, watcher)
    }
  }
  this.restore = function () {
    that.cachedTranslateNodes.forEach(function (cachedData, node) {
      var cachedData = that.cachedTranslateNodes.get(node)
      if (cachedData['text']) {
        node.textContent = cachedData['text']
      } else {
        for (var j = 0; j < constant.translateAttrs.length; j++) {
          var att = constant.translateAttrs[j]
          if (cachedData[att]) {
            node.setAttribute(att, cachedData[att])
          }
        }
      }
    })
  }
}

export default translateNode
