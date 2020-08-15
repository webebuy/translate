var constant = {
  translateAttrs: ['title', 'placeholder', 'label'],
  attrPrefix: 'data-webebug-original-',
  quertSelectorText:
    '[data-webebug-original-text],[data-webebug-original-title],[data-webebug-original-placeholder]',
  ignoreNodeNames: [
    'SCRIPT',
    '#comment',
    'STYLE',
    'LINK',
    'META',
    'TEXTAREA',
    'IMG',
    'CANVAS',
    'SVG',
    'IFRAME'
  ]
}
export default constant
