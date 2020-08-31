# [English Document](README.md)

# 说明

- 自动翻译您的网页
- 当您的网页文字动态变化时，翻译也将自动执行
- 使用 google 翻译 API

# 演示

https://webebuy.com

# 起步

## 1. 添加脚本链接

```
<script src="https://apis.google.com/js/api.js"></script>
<script src="./dist/translate.min.js"></script>
```

## 2. 配置

```
window._translate_instance.config({
          sourceLanguage: 'en',
          translateMode: 1,
          googleKey: 'you google app key'
        })
```

## 3. 切换语言

```
window._translate_instance.toLanguage('zh-cn')
```

# 已知问题

- 不支持 IE < 11
- 单个语句支持最长 1900 个字符
- 因为使用了 google 翻译服务, 国内不能直接使用，需要翻墙, 不翻墙试试 https://webebuy.com

# 支持的语言

- af: Afrikaans
- sq: Albanian
- am: Amharic
- ar: Arabic
- hy: Armenian
- az: Azerbaijani
- eu: Basque
- be: Belarusian
- bn: Bengali
- bs: Bosnian
- bg: Bulgarian
- ca: Catalan
- ceb: Cebuano
- ny: Chichewa
- zh-cn : Chinese Simplified
- zh-tw : Chinese Traditional
- co: Corsican
- hr: Croatian
- cs: Czech
- da: Danish
- nl: Dutch
- en: English
- eo: Esperanto
- et: Estonian
- tl: Filipino
- fi: Finnish
- fr: French
- fy: Frisian
- gl: Galician
- ka: Georgian
- de: German
- el: Greek
- gu: Gujarati
- ht: Haitian Creole
- ha: Hausa
- haw: Hawaiian
- iw: Hebrew
- hi: Hindi
- hmn: Hmong
- hu: Hungarian
- is: Icelandic
- ig: Igbo
- id: Indonesian
- ga: Irish
- it: Italian
- ja: Japanese
- jw: Javanese
- kn: Kannada
- kk: Kazakh
- km: Khmer
- ko: Korean
- ku: Kurdish (Kurmanji)
- ky: Kyrgyz
- lo: Lao
- la: Latin
- lv: Latvian
- lt: Lithuanian
- lb: Luxembourgish
- mk: Macedonian
- mg: Malagasy
- ms: Malay
- ml: Malayalam
- mt: Maltese
- mi: Maori
- mr: Marathi
- mn: Mongolian
- my: Myanmar (Burmese)
- ne: Nepali
- no: Norwegian
- ps: Pashto
- fa: Persian
- pl: Polish
- pt: Portuguese
- ma: Punjabi
- ro: Romanian
- ru: Russian
- sm: Samoan
- gd: Scots Gaelic
- sr: Serbian
- st: Sesotho
- sn: Shona
- sd: Sindhi
- si: Sinhala
- sk: Slovak
- sl: Slovenian
- so: Somali
- es: Spanish
- su: Sundanese
- sw: Swahili
- sv: Swedish
- tg: Tajik
- ta: Tamil
- te: Telugu
- th: Thai
- tr: Turkish
- uk: Ukrainian
- ur: Urdu
- uz: Uzbek
- vi: Vietnamese
- cy: Welsh
- xh: Xhosa
- yi: Yiddish
- yo: Yoruba
- zu: Zulu
