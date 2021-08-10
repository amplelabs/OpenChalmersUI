<template>
  <v-layout
    column
    reverse
    fill-height
    class="message-list"
    :style="browserSpecificStyle"
  >
    <message
      ref="messages"
      v-for="message in messages"
      v-bind:message="message"
      v-bind:key="message.id"
      v-bind:class="`message-${message.type}`"
      v-on:scrollDown="scrollDown"
    ></message>
  </v-layout>
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

import { detect } from 'detect-browser';

import Message from './Message';
import MessageLoading from './MessageLoading';

export default {
  name: 'message-list',
  components: {
    Message,
    MessageLoading,
  },
  computed: {
    messages() {
      return this.$store.state.messages.map(x => x).reverse();
    },
    loading() {
      return this.$store.state.lex.isProcessing;
    },
    browserSpecificStyle() {
      const browser = detect();
      switch (browser && browser.name) {
        /**
         * Firefox has a bug that the scrollbar is not displayed when
         * `flex-direction: column-reverse` is used. This style makes the
         * scrollbar appear as expected however it has an undesired side effect
         * of new messages not auto-scrolling to the bottom, this makes the user
         * experience but more usable when compared to not being able to scroll.
         *
         * More info:
         * - https://bugzilla.mozilla.org/show_bug.cgi?id=1042151
         * - https://github.com/philipwalton/flexbugs/issues/108
        */
        case 'firefox':
          return { 'overflow-y': 'auto' };
        default:
          return {};
      }
    },
  },
  watch: {
    messages(newValue, oldValue) {
      if (newValue.length > oldValue.length) {
        this.scrollDown();
      }
    },
  },
  methods: {
    scrollDown() {
      return this.$nextTick(() => {
        this.$el.scrollTop = this.$el.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.message-list {
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 16px;
}

.message-bot {
  align-self: flex-start;
}

.message-human {
  align-self: flex-end;
}
</style>
