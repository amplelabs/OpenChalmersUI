<template>
    <BaseModal>
        <!-- Header -->
        <template v-slot:header>
            <div class="icon-container">
                <img
                    alt="wave icon"
                    class="icon"
                    :src="
                        require(`../assets/${modalProperties[modalPageCount].icon}`)
                    "
                />
            </div>
            <div class="header-text" v-if="modalProperties[modalPageCount].headerData">
                {{ modalProperties[modalPageCount].headerData }}
            </div>
        </template>
        <!-- Body -->
        <template v-slot:body>
            <div class="body-text pb-3">
                <span v-html="modalProperties[modalPageCount].bodyHtml"></span>
            </div>
        </template>
        <!-- Footer -->
        <template v-slot:footer>
            <div
                :class="
                    $vuetify.breakpoint.smAndDown
                        ? 'mobile-button-container'
                        : 'button-container'
                "
            >
                <slot>
                    <button
                        type="button"
                        class="footer-btn"
                        @click="exit"
                        v-if="!modalProperties[modalPageCount].startChat"
                    >
                        Exit
                    </button>
                    <button
                        type="button"
                        class="footer-btn"
                        @click.once="accept"
                        v-if="modalProperties[modalPageCount].startChat"
                    >
                        Next
                    </button>
                </slot>
            </div>
        </template>
    </BaseModal>
</template>

<script>
import BaseModal from "../templates/NewBaseModal"

export default {
  name: 'privacy-modal',
  components: { BaseModal },
  data() {
    return {
      modalPageCount: 0,
      modalProperties: [
       {
          icon: 'raised-hands.png',
          headerData: '',
          bodyHtml: `By continuing, you agree to our <a href="https://www.amplelabs.co/legal/" target="_blank" style="color:#0000FF;">Privacy Policy.</a><br><br>Thank you for making the experience better for other people like you.`,
          startChat: true,
          safeExit: true
        },
      ],
    };
  },
  computed: {
  },
  created() {
    // send location view change
    window.gtag('event', 'viewChange', {
      event_category: 'engagement',
      event_label: `privacy_1 - ${this.modalProperties[this.modalPageCount].headerData}`
    });
     //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Privacy Modal Viewed', `1 - ${this.modalProperties[this.modalPageCount].headerData}`]);
  },
  methods: {
    accept() {
      this.$emit('acceptPrivacy');
    },
    exit() {
      window.location = "https://211ontario.ca"
    },
    next() {
        window.gtag('event', 'viewChange', {
            event_category: 'engagement',
            event_label: `privacy_2 - ${this.modalProperties[this.modalPageCount].headerData}`
        });
         //! matomo
        window._paq.push(['trackEvent', `View Change Event`, 'Privacy Modal Viewed', `2 - ${this.modalProperties[this.modalPageCount].headerData}`]);
        this.modalPageCount += 1
    },
    close() {
      this.$emit('closePrivacyModal');
    },
  }
};
</script>

<style scoped>
.icon-container {
    text-align: center;
    margin: 10px;
    margin-top: 47px;
}

.header-text {
    font-size: 24px;
    margin: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.375px;
    margin-top: 24px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
}

.body-text {
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.25px;
    margin-bottom: 20px;
    margin-top: 22px;
    margin-left: 40px;
    margin-right: 40px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    /* white-space: pre-line; */
}

.input-box {
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
}

.line-input {
    height: 1px;
    width: 190px;
    border: 1px solid rgba(0, 0, 255, 0.354267);
}

.mobile-button-container {
    position: relative;
    left: 73px;
    padding-bottom: 40px;
}
.button-container {
    position: relative;
    left: 211px;
    padding-bottom: 40px;
}

.footer-btn {
    background: #0000ff;
    border-radius: 100px;
    height: 40px;
    width: 182px;
    color: white;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
}

.skip-btn {
    background: none;
    color: #0000ff;
    border-radius: 100px;
    height: 40px;
    width: 182px;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: bold;
    line-height: 24px;
    font-size: 18px;
}
@media (min-width: 960px) {
    .radio-input >>> .v-input--selection-controls {
        margin-top: 52px;
    }
}
</style>
