<template>
  <div
    v-if="message.text && message.type === 'human'"
    class="message-text"
  >
    {{ message.text }}
  </div>
  <div
    v-else-if="altHtmlMessage && AllowSuperDangerousHTMLInMessage"
    v-html="altHtmlMessage"
    class="message-text"
  ></div>
  <div
    v-else-if="message.text && message.type === 'bot'"
    class="message-text"
  >
    <span v-html="message.text"></span>
  </div>
  <div
    v-else-if="message.type === 'pondering' && loading"
    class="loading"
  >
    <span class="loading-dot one">&nbsp;</span>
    <span class="loading-dot two">&nbsp;</span>
    <span class="loading-dot three">&nbsp;</span>
  </div>
</template>

<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/

import Pondering from '@/components/Pondering';

const marked = require('marked');

const renderer = new marked.Renderer();

renderer.link = function link(href, title, text) {
  return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
};

export default {
  name: 'message-text',
  props: ['message'],
  components: {
    Pondering,
  },
  computed: {
    loading() {
      return this.$store.state.lex.isProcessing;
    },
    shouldConvertUrlToLinks() {
      return true;
    },
    shouldStripTags() {
      return false;
    },
    AllowSuperDangerousHTMLInMessage() {
      return true;
    },
    altHtmlMessage() {
      let out = false;
      if (this.message.alts) {
        if (this.message.alts.html) {
          out = this.message.alts.html;
        } else if (this.message.alts.markdown) {
          out = marked(this.message.alts.markdown, { renderer });
        }
      }
      return out;
    },
    shouldRenderAsHtml() {
      return ((this.message.type === 'bot' || (this.message.type === 'pondering'))
      && this.shouldConvertUrlToLinks);
    },
    botMessageAsHtml() {
      // Security Note: Make sure that the content is escaped according
      // to context (e.g. URL, HTML). This is rendered as HTML
      const messageText = this.message.text; // this.stripTagsFromMessage(this.message.text);
      const messageWithLinks = this.botMessageWithLinks(messageText);
      return messageWithLinks;
      // return 'rawHtml';
    },
  },
  methods: {
    encodeAsHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    botMessageWithLinks(messageText) {
      const linkReplacers = [
        // The regex in the objects of linkReplacers should return a single
        // reference (from parenthesis) with the whole address
        // The replace function takes a matched url and returns the
        // hyperlink that will be replaced in the message
        {
          type: 'web',
          regex: new RegExp(
            '\\b((?:https?://\\w{1}|www\\.)(?:[\\w-.]){2,256}'
            + '(?:[\\w._~:/?#@!$&()*+,;=[\'\\]-]){0,256})',
            'im',
          ),
          replace: (item) => {
            const url = (!/^https?:\/\//.test(item)) ? `http://${item}` : item;
            return '<a target="_blank" '
              + `href="${encodeURI(url)}">${this.encodeAsHtml(item)}</a>`;
          },
        },
      ];
      // TODO avoid double HTML encoding when there's more than 1 linkReplacer
      return linkReplacers
        .reduce(
          // splits the message into an array containing content chunks
          // and links. Content chunks will be the even indexed items in the
          // array (or empty string when applicable).
          // Links (if any) will be the odd members of the array since the
          // regex keeps references.
          (message, replacer) => message.split(replacer.regex).reduce(
            (messageAccum, item, index, array) => {
              let messageResult = '';
              if ((index % 2) === 0) {
                const urlItem = ((index + 1) === array.length)
                  ? '' : replacer.replace(array[index + 1]);
                messageResult = `${this.encodeAsHtml(item)}${urlItem}`;
              }
              return messageAccum + messageResult;
            },
            '',
          ),
          messageText,
        );
    },
    // used for stripping SSML (and other) tags from bot responses
    stripTagsFromMessage(messageText) {
      const doc = document.implementation.createHTMLDocument('').body;
      doc.innerHTML = messageText;
      return doc.textContent || doc.innerText || '';
    },
  },
};
</script>

<style scoped>
.message-text {
  hyphens: auto;
  overflow-wrap: break-word;
  padding: .25em;
  white-space: normal;
  word-break: break-word;
  color: black;
}
.message-text a {
  color:  #000044;
}


/* loading dots */
.loading {
  text-align: center;
  width: 70px;
  height: 36px;
}

.loading-dot {
  animation: showHideDot 1.8s ease-in-out infinite;
  border-radius: 32px;
  width: 8px;
  height: 8px;
  background-color: #000044;
  display: inline-block;
  opacity: 0;
  margin-top: calc(25% - 3px);
}

.loading-dot.one {
  animation-delay: 0.2s;
}

.loading-dot.two {
  animation-delay: 0.4s;
}

.loading-dot.three {
  animation-delay: 0.6s;
}

@keyframes showHideDot {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
