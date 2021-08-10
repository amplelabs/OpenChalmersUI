<template>
  <v-app id="lex-web"
  style="background: #F3F3F5;"
  :style="isToolTipVisible ? 'overflow: hidden;' : ''"
  >
    <NavigationDrawer @startToolTip="closeOnboardingModal" @startNavTip="openNavTip" :navTipVisible="isNavTipVisible"/>
    <toolbar-container
      v-bind:title="toolbarTitle"
      v-bind:logo="toolbarLogo"
      v-on:showNav="toggleNav"
      :isOnboarding="isOnboarding"
    ></toolbar-container>

    <v-content>
      <v-container class="message-list-container" fluid pa-0>
        <message-list v-show="!isUiMinimized"
        ></message-list>
      </v-container>
    </v-content>

    <input-container
      v-if="!isUiMinimized"
      v-bind:text-input-placeholder="textInputPlaceholder"
      v-bind:initial-speech-instruction="initialSpeechInstruction"
    ></input-container>

    <onboarding-modal v-if="isOnboardingModalVisible"      
      v-show="isOnboardingModalVisible"
      @closeOnboarding="closeOnboardingModal"
    ></onboarding-modal>

    <tool-tip-dialog v-if="isToolTipVisible"
      v-show="isToolTipVisible" 
      @closeToolTip="closeToolTip"
    ></tool-tip-dialog>
    
    <NavTipDialog v-if="isNavTipVisible"
      v-show="isNavTipVisible" 
      @closeNavTip="closeNavTip"
      @keepNavOpen="toggleNav"
    ></NavTipDialog>
    

    <location-modal v-if="isLocationModalVisible"      
      v-show="isLocationModalVisible"
      @start="closeLocationModal"
    ></location-modal>
  </v-app>
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

/* eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
import ToolbarContainer from '@/components/ToolbarContainer';
import MessageList from '@/components/MessageList';
import InputContainer from '@/components/InputContainer';
import OnboardingModal from '@/components/OnboardingModal';
import NavigationDrawer from '@/components/NavigationDrawer';
import LocationModal from '@/components/LocationModal';
import ToolTipDialog from "@/components/ToolTipDialog";
import NavTipDialog from '@/components/NavTipDialog';

export default {
  name: 'lex-web',
  components: {
    ToolbarContainer,
    MessageList,
    InputContainer,
    OnboardingModal,
    NavigationDrawer,
    LocationModal,
    ToolTipDialog,
    NavTipDialog,
  },
  data() {
    return {
      drawer: false,
      isOnboardingModalVisible: true,
      isLocationModalVisible: false,
      isToolTipVisible: false,
      isNavTipVisible: false,
      initTimeout: false,
    };
  },
  computed: {
    initialSpeechInstruction() {
      return this.$store.state.config.lex.initialSpeechInstruction;
    },
    textInputPlaceholder() {
      return this.$store.state.config.ui.textInputPlaceholder;
    },
    toolbarColor() {
      return this.$store.state.config.ui.toolbarColor;
    },
    toolbarTitle() {
      return this.$store.state.config.ui.toolbarTitle;
    },
    toolbarLogo() {
      return this.$store.state.config.ui.toolbarLogo;
    },
    isUiMinimized() {
      return this.$store.state.isUiMinimized;
    },
    lexState() {
      return this.$store.state.lex;
    },
    isMobile() {
      const mobileResolution = 900;
      return (this.$vuetify.breakpoint.smAndDown
        && 'navigator' in window && navigator.maxTouchPoints > 0
        && 'screen' in window
        && (window.screen.height < mobileResolution
          || window.screen.width < mobileResolution)
      );
    },
    isOnboarding() {
      return !!(
        this.isOnboardingModalVisible
        || this.isLocationModalVisible
        || this.isToolTipVisible
        || this.initTimeout
      )
    }
  },
  watch: {
    // emit lex state on changes
    lexState() {
      this.$emit('updateLexState', this.lexState);
    },
  },
  created() {
    // override default vuetify vertical overflow on non-mobile devices
    // hide vertical scrollbars
    if (!this.isMobile) {
      document.documentElement.style.overflowY = 'hidden';
    }
    this.$store.dispatch('initUser');
    // set starting modal based on state
    if (this.$store.state.onboardingComplete === "true") {
      this.isOnboardingModalVisible = false
     this.isLocationModalVisible = true
    }
  },
  methods: {
    toggleNav() {
      if (this.$store.state.navDrawer === true) {
        return this.$store.commit('setNavDrawer', false)
      }
      return this.$store.commit('setNavDrawer', true)
    },
    hideNav() {
      return this.$store.commit('setNavDrawer', false)
    },
    toggleMinimizeUi() {
      return this.$store.dispatch('toggleIsUiMinimized');
    },
    // messages from parent
    messageHandler(evt) {
      // security check
      if (evt.origin !== this.$store.state.config.ui.parentOrigin) {
        console.warn('ignoring event - invalid origin:', evt.origin);
        return;
      }
      if (!evt.ports || !Array.isArray(evt.ports) || !evt.ports.length) {
        console.warn('postMessage not sent over MessageChannel', evt);
        return;
      }
      switch (evt.data.event) {
        case 'ping':
          console.info('pong - ping received from parent');
          evt.ports[0].postMessage({
            event: 'resolve',
            type: evt.data.event,
          });
          break;
        // received when the parent page has loaded the iframe
        case 'parentReady':
          evt.ports[0].postMessage({ event: 'resolve', type: evt.data.event });
          break;
        case 'toggleMinimizeUi':
          this.$store.dispatch('toggleIsUiMinimized')
            .then(() => evt.ports[0].postMessage({
              event: 'resolve', type: evt.data.event,
            }));
          break;
        case 'postText':
          if (!evt.data.message) {
            evt.ports[0].postMessage({
              event: 'reject',
              type: evt.data.event,
              error: 'missing message field',
            });
            return;
          }

          this.$store.dispatch(
            'postTextMessage',
            { type: 'human', text: evt.data.message },
          )
            .then(() => evt.ports[0].postMessage({
              event: 'resolve', type: evt.data.event,
            }));
          break;
        default:
          console.warn('unknown message in messageHanlder', evt);
          break;
      }
    },
    logRunningMode() {
      if (!this.$store.state.isRunningEmbedded) {
        console.info('running in standalone mode');
        return;
      }

      console.info(
        'running in embedded mode from URL: ',
        document.location.href,
      );
      console.info('referrer (possible parent) URL: ', document.referrer);
      console.info(
        'config parentOrigin:',
        this.$store.state.config.ui.parentOrigin,
      );
      if (!document.referrer
        .startsWith(this.$store.state.config.ui.parentOrigin)
      ) {
        console.warn(
          'referrer origin: [%s] does not match configured parent origin: [%s]',
          document.referrer, this.$store.state.config.ui.parentOrigin,
        );
      }
    },
    init() {
      this.initConfig()
        .then(() => Promise.all([
          this.$store.dispatch(
            'initCredentials',
            this.$lexWebUi.awsConfig.credentials,
          ),
          this.$store.dispatch('initRecorder'),
          this.$store.dispatch(
            'initBotAudio',
            (window.Audio) ? new Audio() : null,
          ),
        ]))
        .then(() => Promise.all([
          this.$store.dispatch('initMessageList'),
          this.$store.dispatch('initPollyClient', this.$lexWebUi.pollyClient),
          this.$store.dispatch('initLexClient', this.$lexWebUi.lexRuntimeClient),
        ]))
        .then(() => (
          (this.$store.state.isRunningEmbedded)
            ? this.$store.dispatch(
              'sendMessageToParentWindow',
              { event: 'ready' },
            )
            : Promise.resolve()
        ))
        .then(() => console.info(
          'sucessfully initialized lex web ui version: ',
          this.$store.state.version,
        ))
        .catch((error) => {
          console.error('could not initialize application while mounting:', error);
        });
    },
    initConfig() {
      if (this.$store.state.config.urlQueryParams.lexWebUiEmbed !== 'true') {
        this.$store.commit('setIsRunningEmbedded', false);
        this.$store.commit('setAwsCredsProvider', 'cognito');
      } else {
        window.addEventListener('message', this.messageHandler, false);
        this.$store.commit('setIsRunningEmbedded', true);
        this.$store.commit('setAwsCredsProvider', 'parentWindow');
      }

      // get config
      return this.$store.dispatch('initConfig', this.$lexWebUi.config)
        .then(() => this.$store.dispatch('getConfigFromParent'))
        // avoid merging an empty config
        .then(config => (
          (Object.keys(config).length)
            ? this.$store.dispatch('initConfig', config) : Promise.resolve()
        ))
        .then(() => this.logRunningMode());
    },
    closeOnboardingModal() {
      this.isOnboardingModalVisible = false;
      this.isToolTipVisible = true;
    },
    closeToolTip() {
      this.isToolTipVisible = false;
      if (!this.$store.state.lex.sessionAttributes.userPosition) {
        this.isLocationModalVisible = true;
      }
    },
    closeNavTip() {
      this.isNavTipVisible = false;
    },
    openNavTip() {
      this.isNavTipVisible = true;
    },
    closeLocationModal() {
      this.isLocationModalVisible = false;
      this.initTimeout = true;
      setTimeout(() => this.initTimeout = false, 6000)
      this.$store.commit("clearMessages")
      this.init()
    }
  },
};
</script>

<style>
.message-list-container {
  /* vuetify toolbar and footer are 48px each when using 'dense' */
  height: calc(100% - 110px);
  position: fixed;
  top: 48px;
  background-color:#f3f4f5;
  color: #000044;
}

.theme--light.v-input:not(.v-input--is-disabled) input, .theme--light.v-input:not(.v-input--is-disabled) textarea {
  color: #000044
}
.theme--light.v-label {
  color: #000000 !important;
}
.theme--light.v-label.error--text {
  color: rgb(255, 82, 82) !important;
}
.application {
  font-family: 'Noto Sans', sans-serif;
}
.nav-button {
  text-transform: capitalize;
  font-size: 16px;
}
nav > div.v-toolbar__content {
  padding: 0 16px !important;
}
.v-text-field:not(.error--text)>.v-input__control>.v-input__slot:after {
  border-color: #0000FF;
}
.v-text-field:not(.error--text):focus-within>.v-input__control>.v-input__slot>.v-text-field__slot>label.v-label--active  {
  color: #0000FF !important;
}
.accent--text {
    color: #0000FF !important;
}
</style>
