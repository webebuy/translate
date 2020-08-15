import constant from './constant'

function windowWatcher(window) {
  var that = this
  this.window = window
  this.document = window.document
  ;(this.isStart = false), (this.observer = null), (this.change = null)

  this.init = function() {
    if (this.observer == null) {
      this.observer = new MutationObserver(function(mutationList) {
        mutationList.forEach(mutation => {
          // content editable node is not translate
          if (mutation.target.isContentEditable) {
            return
          }
          switch (mutation.type) {
            case 'childList':
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                var addNode = mutation.addedNodes[i]
                if (
                  constant.ignoreNodeNames.indexOf(mutation.target.nodeName) <
                    0 &&
                  constant.ignoreNodeNames.indexOf(addNode.nodeName) < 0
                ) {
                  if (
                    addNode.nodeName != 'FONT' ||
                    !addNode.getAttribute(constant.attrPrefix + 'text')
                  ) {
                    that.change(addNode)
                  }
                }
              }
              /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
                 mutation.removedNodes */
              break
            case 'attributes':
              if (
                constant.ignoreNodeNames.indexOf(mutation.target.nodeName) <
                  0 &&
                constant.translateAttrs.indexOf(mutation.attributeName) >= 0
              ) {
                that.change(mutation.target, mutation.attributeName)
              }
              /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
                 该属性之前的值为 mutation.oldValue */
              break
            case 'characterData':
              if (mutation.target.nodeName == '#text') {
                that.change(mutation.target, '#text')
              }

              break
          }
        })
      })
    }
  }

  this.start = function() {
    if (!this.isStart) {
      this.init()
      const mutationObserverOptions = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['title']
      }
      this.observer.observe(
        this.document.documentElement,
        mutationObserverOptions
      )

      this.isStart = true
    }
  }

  this.stop = function() {
    if (this.isStart) {
      this.observer.disconnect()
    }
    this.isStart = false
  }
}

export default windowWatcher
