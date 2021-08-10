<template>
    <NavToolTip :buttonName="tips[toolTipCount].name">
      <!-- Header -->
      <template v-slot:header>
        <v-btn fab icon class="close-button" @click="close"
          ><v-img :src="require('../assets/close.svg')"
        /></v-btn>
        <div class="icon-container">
          <img :src="tips[toolTipCount].images[0]" />
          <img
            v-if="tips[toolTipCount].images[1]"
            :src="tips[toolTipCount].images[1]"
          />
        </div>
      </template>
      <!-- Body -->
      <template v-slot:body>
        <div class="body-text top-tool-tip" v-html="tips[toolTipCount].rawHtml" />
      </template>
      <!-- Footer -->
      <template v-slot:footer>
        <div class="button-container">
          <slot>
            <button
              v-if="toolTipCount === Object.keys(tips).length"
              type="button"
              class="footer-btn"
              @click.once="close"
            >
              Next
            </button>
            <button v-else type="button" class="footer-btn" @click.prevent="next">
              Next
            </button>
          </slot>
        </div>
      </template>
    </NavToolTip>
</template>

<script>
import NavToolTip from '../templates/NavToolTip';
// imported svgs will get moved to S3
import Plus from '../assets/plus.png';
import Robot from '../assets/robot.png';
import Trumpet from "../assets/trumpet.png"

export default {
  name: 'NavTipDialog',
  components: { NavToolTip },
  data() {
    return {
      toolTipCount: 1,
      tips: {
        1: {
          images: [Plus],
          rawHtml: `You can give me <b>new free services</b> that you've discovered by adding them here.`,
          name: "free-services"
        },
        2: {
          images: [Trumpet],
          rawHtml: `You can give me <b>Feedback</b> to any wrong information you see presented and more.`,
          name: "give-feedback"
        },
        3: {
          images: [Robot],
          rawHtml: `Some tool-tips to show you <b>how you can use me</b> to find what you're looking for!`,
          name: "how-to-use-chalmers"
        },
      }
    };
  },
  created() {
    // send location view change
    window.gtag('event', 'viewChange', {
      event_category: 'engagement',
      event_label: `navtip_${this.toolTipCount} - ${
        this.tips[this.toolTipCount].rawHtml
      }`
    });
    //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Nav Modal Viewed', `${this.toolTipCount} - ${this.tips[this.toolTipCount].rawHtml}`]);
  },
  updated() {
    this.$store.commit('setNavDrawer', true)
  },
  methods: {
    close() {
      this.$store.commit('setToolTip', "true")
      this.$emit('closeNavTip');
    },
    next() {
      this.toolTipCount += 1;
      window.gtag('event', 'viewChange', {
        event_category: 'engagement',
        event_label: `navtip_${this.toolTipCount} - ${
          this.tips[this.toolTipCount].rawHtml
        }`
      });
      //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Nav Modal Viewed', `${this.toolTipCount} - ${this.tips[this.toolTipCount].rawHtml}`]);
    }
  }
};
</script>

<style scoped>
.icon-container {
  text-align: center;
  margin: 50px 10px 10px 10px;
}

.body-text {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;
  margin: 22px 47px 118px 47px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
}
.body-text.top-tool-tip {
  margin-bottom: 0;
  margin: 22px 35px 118px 35px;
}

.button-container {
  position: absolute;
  bottom: 39px;
  left: 224px;
}
.button-container {
  left: 86px;
}

.footer-btn {
  margin: 0 auto;
  background: #0000ff;
  border-radius: 100px;
  height: 40px;
  width: 152px;
  color: white;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
}

.close-button {
  position: absolute;
  right: 10px;
  top: 12px;
  width: 24px !important;
  height: 24px !important;
}
</style>
