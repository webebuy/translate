import windowWatcher from './windowWatcher'
import translateNode from './translate'

var translateTimes = 1

function windowSwitcher(window, globalData) {
  var that = this
  this.globalData = globalData
  this.window = window
  this.document = window.document
  this.watcher = new windowWatcher(window)

  function isChild(node) {
    var queryNodes = that.document.querySelectorAll(
      that.globalData.config.querySelector
    )
    for (var i = 0; i < queryNodes.length; i++) {
      var queryNode = queryNodes[i]
      if (queryNode.contains(node)) {
        return true
      }
    }
  }

  // watch the change node , if is attribute change, the attribute will has  value
  this.watcher.change = function(node, attribute) {
    // include mode not translate the functions
    if (
      that.globalData.config.translateMode == 1 ||
      (node.functionName && that.globalData.config.translateMode == 3)
    ) {
      var tNode = that.getTranslateNote(node, attribute)
      console.log('change: ', node.nodeName, node, translateTimes)
      translateTimes++
      if (translateTimes == 1000) {
        debugger
      }
      return tNode.toLanguage(
        that.globalData.currentLanguage.name,
        that.watcher
      )
    }
    // include or exclude mode
    if (!node.functionName && that.globalData.config.querySelector) {
      if (that.globalData.config.translateMode == 2) {
        // include
        if (isChild(node)) {
          // is include node's child, run translate
          var tNode = that.getTranslateNote(node, attribute)
          return tNode.toLanguage(
            that.globalData.currentLanguage.name,
            that.watcher
          )
        } else if (!attribute) {
          // is not include node's child, query is threre child node include in query, then translate it
          var nodes = node.querySelectorAll(
            that.globalData.config.querySelector
          )
          if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i++) {
              var tNode = that.getTranslateNote(nodes[i], attribute)
              tNode.toLanguage(
                that.globalData.currentLanguage.name,
                that.watcher
              )
            }
          }
          return
        }
      } else if (that.globalData.config.translateMode == 3) {
        // exclude
        if (!isChild(node)) {
          var tNode = that.getTranslateNote(node, attribute)
          return tNode.toLanguage(
            that.globalData.currentLanguage.name,
            that.watcher
          )
        }
      }
    }
  }

  this.getTranslateNote = function(node, attribute) {
    var queryNodes = null
    if (
      this.globalData.config.translateMode == 3 &&
      this.globalData.config.querySelector
    ) {
      queryNodes = this.document.querySelectorAll(
        this.globalData.config.querySelector
      )
    }
    return new translateNode(node, this.globalData, attribute, queryNodes)
  }

  this.restore = function() {
    this.watcher.stop()
    for (var i = 0; i < this.globalData.overrideFunctions.length; i++) {
      var name = this.globalData.overrideFunctions[i]
      window[name] = this.globalData.overrideOriginal[name]
    }

    var tNode = this.getTranslateNote(this.document.documentElement)
    tNode.restore()
  }

  this.toLanguage = function(language) {
    if (this.globalData.config.translateMode != 2) {
      // include mode not translate the functions
      for (var i = 0; i < this.globalData.overrideFunctions.length; i++) {
        var name = this.globalData.overrideFunctions[i]
        this.globalData.overrideOriginal[name] = this.window[name]
        this.window[name] = (function(fName) {
          return function(text) {
            var node = {
              functionName: fName,
              text: text,
              arguments: arguments,
              excute: that.globalData.overrideOriginal[fName]
            }
            return that.watcher.change(node)
          }
        })(name)
      }
    }

    if (this.globalData.config.translateMode == 2) {
      // include
      if (this.globalData.config.querySelector) {
        var nodes = this.document.querySelectorAll(
          this.globalData.config.querySelector
        )
        if (nodes.length > 0) {
          for (var i = 0; i < nodes.length; i++) {
            var tNode = this.getTranslateNote(nodes[i])
            tNode.toLanguage(this.globalData.currentLanguage.name, this.watcher)
          }
        }
      }
    } else {
      if (
        this.globalData.config.translateMode == 1 ||
        (this.globalData.config.translateMode == 3 &&
          this.globalData.config.querySelector)
      ) {
        var tNode = this.getTranslateNote(this.document.documentElement)
        tNode.toLanguage(this.globalData.currentLanguage.name, this.watcher)
      }
    }
    this.watcher.start()
  }
}

export default windowSwitcher
