# Description

- Automatic translation of web pages.
- Any text can be translate when the text is changed.
- We use google translation api.

# Demo

https://webebuys.com

# Getting Started

## 1. Add script link

```
<script src="https://apis.google.com/js/api.js"></script>
<script src="./dist/translate.min.js"></script>
```

## 2. Config

```
window._translate_instance.config({
          sourceLanguage: 'en',
          translateMode: 1,
          googleKey: 'you google app key'
        })
```

## 3. Switch languages

```
window._translate_instance.toLanguage('zh-cn')
```

# Know Issures

- IE < 11 not support
- The max translate text length is 1900
- We use google api, you may not use in china, you can try https://webebuys.com

# Support Languages

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
