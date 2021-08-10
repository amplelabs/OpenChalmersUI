<template>
  <v-container class="button-options" grid-list-md >
    <v-img
      v-if="responseCard.imageUrl !== null && responseCard.imageUrl !== 'null'"
      :src="imageUrl"
      :lazy-src="require('../assets/staticmap.png')"
      class="response-card-img"
      :style="noText ? 'margin-top: -12px' : ''"
    />
    <v-layout row wrap> 
      <v-card-actions
        v-if="responseCard.title === 'AWHL'"
        class="button-row">
        
        <v-btn
          class="cgred"
          :style="styleAdj"
          round outline small
          tag="a"
          v-bind:href="'tel:416-863-0511'"
        >
          Call
        </v-btn>
        <v-btn
          class="cgred"
          :style="styleAdj"
          round outline small
          tag="a"
          v-bind:href="'https://www.awhl.org/online-chat'"
          target="_blank"
        >
          Chat
        </v-btn>
      </v-card-actions>
      <v-card-actions
        v-else-if="responseCard.attachmentLinkUrl && displayLinkCaption()">
        <v-btn
          class="cgred"
          :style="styleAdj"
          round outline small
          tag="a"
          v-bind:href="responseCard.attachmentLinkUrl"
          target="_blank"
        >
          {{ responseCard.subTitle }}
        </v-btn>
      </v-card-actions>
      <v-card-actions
        v-for="(button, index) in responseCard.buttons"
        v-bind:key="index"
        actions
        class="button-row"
        >
        <v-btn
          v-if="button.text && button.value && !hasButtonBeenClicked"
          v-on:click.once.native="onButtonClick(button)"
          v-bind:disabled="hasButtonBeenClicked"
          class="cgred"
          :style="styleAdj"
          round outline small
        >
          {{button.text}}
        </v-btn>
      </v-card-actions>
       <v-card-actions
        v-if="responseCard.title === 'AWHL'"
        class="button-row">
           <v-btn
          class="cgred"
          style="padding-left:0;"
          round outline small
          tag="a"
          @click.once="exit"
        >
          Exit
        </v-btn>
       </v-card-actions>
    </v-layout>
  </v-container>
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
export default {
  name: 'response-card',
  props: ['response-card', 'noText'],
  data() {
    return {
      subTitle: null,
      hasButtonBeenClicked: false,
    };
  },
  computed: {
    styleAdj() {
      return {
        "text-decoration": "none"
      };
    },
    imageUrl() {
      return `${this.responseCard.imageUrl}`;
    },
  },
  methods: {
    displayLinkCaption() {
      if (this.subTitle === null
        || this.subTitle === undefined
        || typeof (this.subTitle) !== 'string') {
        return false;
      }
      const len = this.subTitle.length;
      return len !== 0;
    },
    getUrl(c) {
      return c.imageUrl;
    },
    onButtonClick(button) {
      this.hasButtonBeenClicked = true;
      const message = {
        type: 'human',
        text: button.text,
        value: button.value,
      };

      this.$store.dispatch('postResponseCardTextMessage', message);
    },
    exit() {
      window.open("https://yahoo.com");
      window.location.href = "https://google.ca";
    }
  },
  mounted() {
    this.subTitle = this.responseCard.subTitle;
  },
};
</script>

<style scoped>
.card {
  width: 75vw;
  height: 100%;
  position: inherit; /* workaround to card being displayed on top of toolbar shadow */
  padding-bottom: 0em;
}
.card__title {
  padding: 0em;
  padding-top: 0em;
}
.card__text {
  padding: 0.33em;
}
.card__actions {
  padding-bottom: 0px !important;
}
.card__actions.button-row {
  justify-content: left;
  padding-bottom: 0em;
  margin-bottom: 0px;
}

.cgred {
  margin: 0.25em 0 0 0;
  text-transform: capitalize;
  font-size: 16px;
  height: 3em;
  padding: 0 0.5em;
}

.container {
  /* padding: 2vh 1.5vh; */
  text-transform: capitalize;
}

.button-options {
  margin-top: 12px;
  margin-left: 38px;
  padding: 0;
}

.linkbutton {
  margin-bottom: -1.5em;
}

a {
  color:#000044 !important;
  text-decoration: none;
}

a:link {
  color:#000044 !important;
  text-decoration: none;
}

a[href^="tel:"] {
  color: #000044 !important;
  text-decoration: underline;
}

.v-btn {
  min-width: 120px;
  height: 40px;
  color:#000044;
  background-color: white !important;
  border: 1px solid #A5A5FF;
  box-shadow: 1px 1px 10px rgba(176, 176, 178, .75); /* #B0B0B2 */
}
.v-btn:hover, .v-btn--active:before, .v-btn:focus:before, .v-btn:hover:before {
  background-color: #fec201 !important;
  border-color: #fec201 !important;
}
.response-card-img {
  height: 177px;
  width: 594px;
  border: 1.1px solid #A5A5FF !important;
  border-width: 1px;
  border-radius: 12px;
  margin-left: 2px;
  margin-top: 4px;
}
@media (max-width: 750px) {
  .response-card-img {
    width: calc(95vw - 42px);
  }
}
</style>
