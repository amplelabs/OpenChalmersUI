<template>
  <v-flex d-flex class="message" :class="emptyResponse">
    <!-- contains message and response card -->
    <v-layout column ma-2 class="message-layout">
      <!-- contains message bubble and date -->
      <v-flex d-flex class="message-bubble-date-container">
        <v-layout column class="message-bubble-column">
          <!-- contains message bubble and avatar -->
          <v-flex d-flex class="message-bubble-avatar-container">
            <v-layout row class="message-bubble-row">
              <div
                v-if="shouldShowAvatarImage && message.text.length"
                v-bind:style="botAvatarBackground"
                v-bind:tabindex="message.id + 1"
                class="bot-avatar focusable"
              ></div>
              <div
                v-if="message.text !== ''"
                v-bind:tabindex="message.id + 1"
                v-on:focus="onMessageFocus"
                v-on:blur="onMessageBlur"
                class="message-bubble focusable"
              >
                <message-text
                  v-bind:message="message"
                  v-if="'text' in message && message.text !== null && message.text.length"
                ></message-text>
                <div v-if="message.type === 'human' && message.audio" class="message-audio">
                  <audio>
                    <source v-bind:src="message.audio" type="audio/wav">
                  </audio>
                  <v-btn
                    v-on:click="playAudio"
                    v-bind:tabindex="message.id + 1"
                    icon
                    class="black--text ml-0 mr-0"
                  >
                    <v-icon class="play-icon">play_circle_outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-layout>
          </v-flex>
          <v-flex
            v-if="shouldShowMessageDate && isMessageFocused"
            class="text-xs-center message-date"
          >{{messageHumanDate}}</v-flex>
        </v-layout>
      </v-flex>
      <transition name="fade">
        <v-flex v-if="shouldDisplayResponseCard" class="response-card" d-flex>
          <response-card
            v-for="(card, index) in message.responseCard.genericAttachments"
            v-bind:response-card="card"
            v-bind:key="index"
            :noText="!message.text.length"
          ></response-card>
        </v-flex>
      </transition>
    </v-layout>
  </v-flex>
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
import MessageText from './MessageText';
import ResponseCard from './ResponseCard';

export default {
  name: 'message',
  props: ['message'],
  components: {
    MessageText,
    ResponseCard,
  },
  data() {
    return {
      isMessageFocused: false,
      messageHumanDate: 'Now',
    };
  },
  computed: {
    emptyResponse() {
      if (this.message.type === '' && this.message.text === '') {
        return 'shrink-response'
      }
      return '';
    },
    botDialogState() {
      if (!('dialogState' in this.message)) {
        return null;
      }
      switch (this.message.dialogState) {
        case 'Failed':
          return { icon: 'error', color: 'red', state: 'fail' };
        case 'Fulfilled':
        case 'ReadyForFulfillment':
          return { icon: 'done', color: 'green', state: 'ok' };
        default:
          return null;
      }
    },
    botAvatarUrl() {
      return this.$store.state.config.ui.avatarImageUrl;
    },
    showDialogStateIcon() {
      return this.$store.state.config.ui.showDialogStateIcon;
    },
    shouldDisplayResponseCard() {
      return (
        this.message.responseCard
        && (this.message.responseCard.version === '0' // example code use version 1
          || this.message.responseCard.version === '1'
          || this.message.responseCard.version === 1
          || this.message.responseCard.version === 0)
        && this.message.responseCard.contentType
          === 'application/vnd.amazonaws.card.generic'
        && 'genericAttachments' in this.message.responseCard
        && this.message.responseCard.genericAttachments instanceof Array
      );
    },
    shouldShowAvatarImage() {
      // console.log(this.message.text);
      return (
        (this.message.type === 'bot' || this.message.type === 'pondering')
        && this.botAvatarUrl
      );
    },
    botAvatarBackground() {
      return {
        background: `url(${
          this.botAvatarUrl
        }) center center / contain no-repeat`,
        // 'background-color': 'grey lighten-4',
        'background-size': '32px 32px',
      };
    },
    shouldShowMessageDate() {
      return false; // this.$store.state.config.ui.showMessageDate;
    },
  },
  methods: {
    playAudio() {
      const audioElem = this.$el.querySelector('audio');
      if (audioElem) {
        audioElem.play();
      }
    },
    onMessageFocus() {
      if (!this.shouldShowMessageDate) {
        return;
      }
      this.messageHumanDate = this.getMessageHumanDate();
      this.isMessageFocused = true;
      if (this.message.id === this.$store.state.messages.length - 1) {
        this.$emit('scrollDown');
      }
    },
    onMessageBlur() {
      if (!this.shouldShowMessageDate) {
        return;
      }
      this.isMessageFocused = false;
    },
    getMessageHumanDate() {
      const dateDiff = Math.round((new Date() - this.message.date) / 1000);
      const secsInHr = 3600;
      const secsInDay = secsInHr * 24;
      if (dateDiff < 60) {
        return 'Now';
      } if (dateDiff < secsInHr) {
        return `${Math.floor(dateDiff / 60)} min`;
      } if (dateDiff < secsInDay) {
        return this.message.date.toLocaleTimeString();
      }
      return this.message.date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.message,
.message-bubble-column {
  flex: 0 0 auto;
}

.message,
.message-bubble-row {
  max-width: 80vw;
}

@media (max-width: 750px) {
  .message,
  .message-bubble-row {
    max-width: 95vw;
  }
}

.bot-avatar {
  align-self: center;
  border-radius: 50%;
  border-style: none;
  border-width: 0px;
  min-width: 32px; /* calc(2.5em + 0.0vmin); */
  min-height: 32px; /* calc(2.5em + 0.0vmin); */
  align-self: flex-start;
  margin-right: 8px;
  margin-left: 0px;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

.message-bubble {
  border-radius: 8px;
  display: inline-flex;
  font-size: calc(1em + 0.25vmin);
  padding: 0.5em;
  width: fit-content;
  align-self: center;
}

.focusable {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: default;
}

.focusable:focus {
  outline: none;
}

.message-bot .message-bubble {
  outline-color: #ffffff;
  border: 1px solid #ffffff; /* red; */
  background-color: #ffffff;
  border: 1.1px solid #A5A5FF !important;
}

.message-pondering .message-bubble {
  outline-color: #ffffff;
  border: 1px solid #ffffff; /* red; */
  background-color: #ffffff;
  border: 1.1px solid #A5A5FF !important;
}

.message-human .message-bubble {
  background-color: #fec201;
  outline-color: #fec201;
  border: 1px solid #fec201;
  font-size: 16px;
  padding: .75em;
}

.dialog-state {
  display: inline-flex;
}

.icon.dialog-state-ok {
  color: green;
}
.icon.dialog-state-fail {
  color: red;
}

.play-icon {
  font-size: 2em;
}
.response-card {
  width: 85vw;
  justify-content: center;
}
@media (max-width: 750px) {
  .response-card {
    width: 95vw;
  }
}
</style>

<style>
.message-text p {
  margin-bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


.speech-fade-enter-active {
  transition: opacity 1.5s;
}

.speech-fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

a {
  color: #0026F5;
  text-decoration: underline;
  font-weight: bold;
}
/* 
a:link {
  color: #0026F5;
  text-decoration: none;
} */

a[href^="tel:"] {
  color: #0026F5;
  text-decoration: underline;
}
.shrink-response {
  margin-top: -16px
}
.response-card-spacer {
  width: 565px;
  height: 0;
}
@media (max-width: 750px) {
  .response-card-spacer {
    width: calc(92vw - 56px);
  }
}
.response-card-max {
  max-width:567px;
}
#covid-message {
  background-color: #D32028;
  color: #FFFFFF;
  display: inline-block;
  font-weight: bold;
  border-radius: 4px;
  padding:0px 8px 0px 5px;
  margin-bottom: 12.71px;
}
#covid-banner {
  vertical-align:-3px;
  margin-right:4px;
}
.covid-alert {
  color: #D32028;
  max-width:567px
}
</style>
