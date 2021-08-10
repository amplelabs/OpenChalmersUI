<template>
  <div>
    <BottomToolTip v-if="toolTipCount <= 2">
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
        <div class="body-text" v-html="tips[toolTipCount].rawHtml" />
      </template>
      <!-- Footer -->
      <template v-slot:footer>
        <div class="button-container">
          <slot>
            <button type="button" class="footer-btn" @click="next">
              Next
            </button>
          </slot>
        </div>
      </template>
    </BottomToolTip>
    <TopToolTip :direction="tips[toolTipCount].direction" v-if="toolTipCount >= 3 && toolTipCount <= 4">
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
        <div class="button-container" :class="tips[toolTipCount].direction">
          <slot>
            <button
              v-if="toolTipCount === Object.keys(tips).length"
              type="button"
              class="footer-btn"
              @click.once="close"
            >
              Next
            </button>
            <button v-else type="button" class="footer-btn" @click="next">
              Next
            </button>
          </slot>
        </div>
      </template>
    </TopToolTip>
  </div>
</template>

<script>
import BottomToolTip from '../templates/BottomToolTip';
import TopToolTip from '../templates/TopToolTip';
// imported svgs will get moved to S3
import Hamburger from '../assets/hamburger.svg';
import Brief from '../assets/brief.svg';
import Robot from '../assets/robot.svg';
import Flag from '../assets/flag.svg';
import Info from '../assets/info.svg';

export default {
  name: 'toolTipDialog',
  components: { BottomToolTip, TopToolTip },
  data() {
    return {
      toolTipCount: 1,
      tips: {
        1: {
          images: [Hamburger, Brief],
          rawHtml: `You can also ask me for things here in the text box. Try things like <b>“I’m hungry”</b> or <b>“I am in a crisis”.</b>`
        },
        2: {
          images: [Robot],
          rawHtml: `I understand things like:<br><b>“I need somewhere to stay”<br>“Food Bank”<br>“Closest Drop-In”<br>“I need to find clothing”<br>“find me somewhere to eat”</b>`
        },
        3: {
          images: [Info],
          rawHtml: `You can give me <b>Feedback</b> to any wrong information you see presented and more.`,
          direction: 'right'
        },
        4: {
          images: [Flag],
          rawHtml: `Click here to restart me anytime!`,
          direction: 'left'
        },
      }
    };
  },
  created() {
    // send location view change
    window.gtag('event', 'viewChange', {
      event_category: 'engagement',
      event_label: `tooltip_${this.toolTipCount} - ${
        this.tips[this.toolTipCount].rawHtml
      }`
    });
    //! matomo
      window._paq.push(['trackEvent', `View Change Event`, 'Tooltip Modal Viewed', `${this.toolTipCount} - ${
      this.tips[this.toolTipCount].rawHtml
    }`]);
  },
  methods: {
    close() {
      this.$emit('closeToolTip');
    },
    next() {
      this.toolTipCount += 1;
      window.gtag('event', 'viewChange', {
        event_category: 'engagement',
        event_label: `tooltip_${this.toolTipCount} - ${
          this.tips[this.toolTipCount].rawHtml
        }`
      });
    //! matomo
      window._paq.push(['trackEvent', `View Change Event`, 'Tooltip Modal Viewed', `${this.toolTipCount} - ${
      this.tips[this.toolTipCount].rawHtml
    }`]);
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
.button-container.right, .button-container.left {
  left: 86px;
}
@media (max-width: 959px) {
  .button-container {
    left: 86px;
  }
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
