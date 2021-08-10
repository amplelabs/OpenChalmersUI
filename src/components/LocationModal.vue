<template>
  <BaseModal>
    <!-- Header -->  
    <template v-slot:header>
      <div class="icon-container">
        <img
          alt="wave icon"
          class="icon"
          :src="require(`../assets/${modalProperties[modalPageCount].icon}`)"
        />
      </div>
      <div class="header-text">
        {{ modalProperties[modalPageCount].headerData }}
      </div>
    </template>
    <!-- Body --> 
    <template v-slot:body>
      <div class="body-text" v-if="useAltBody && modalProperties[modalPageCount].altBodyData">
        {{ modalProperties[modalPageCount].altBodyData }}
      </div>
      <div class="body-text" v-else>
        {{ modalProperties[modalPageCount].bodyData }}
      </div>
      <div class="radio-input-container">
        <div class="radio-input">
          <v-radio-group  v-model="selectedChoice" class="ch-radio-group">
            <v-radio
              v-for="(data, index) in compRadioData"
              :value="data"
              :key="index"
              :color="'#0000FF'"
              style="font-size: 18px !important;"
            >
              <template slot="label">
                <div class="radio-data-label"><span>{{data}}</span><span class="subtext" v-if="modalProperties[modalPageCount].radioDataSubText[index]">&nbsp;{{modalProperties[modalPageCount].radioDataSubText[index]}}</span></div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
      </div>
    </template>
    <!-- Footer -->
    <template v-slot:footer>
      <div :class="$vuetify.breakpoint.smAndDown ? 'mobile-button-container' : 'button-container'">
        <slot>
          <button
            type="button"
            class="footer-btn"
            @click="next"
            :disabled="!valid"
            v-if="!modalProperties[modalPageCount].startChat"
          >
            Next
          </button>
          <button
            type="button"
            class="footer-btn"
            @click.once="start"
            v-if="modalProperties[modalPageCount].startChat"
          >
            Start
          </button>
        </slot>
        <slot>
          <div>
            <button
              type="button"
              class="skip-btn"
              @click="skip"
              v-if="modalProperties[modalPageCount].enableSkip"
            >
              Skip
            </button>
          </div>
        </slot>
      </div>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "../templates/BaseModal"

export default {
  name: 'location-modal',
  components: { BaseModal },
  data() {
    return {
      useAltBody: false,
      selectedChoice: null, // will store radio button responses
      valid: true,
      name: '',
      nameRules: [v => !!v || 'Name is required'],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      modalPageCount: 1,
      modalProperties: {
        1: {
          icon: 'location-icon.png',
          headerData: 'Can I use your location?',
          bodyData: 'To make the best out of Chalmers, we want to give you recommendations based on where you are!',
          altBodyData: null,
          altRadioData: null,
          radioData: ['Sure', 'No thank you'],
          radioDataSubText: ['', ''],
          enableForm: false,
          startChat: true,
          enableSkip: false,
        },
      },
    };
  },
  computed: {
    compRadioData() {
      if (this.useAltBody && this.modalProperties[this.modalPageCount].altRadioData) {
        return this.modalProperties[this.modalPageCount].altRadioData
      }
      return this.modalProperties[this.modalPageCount].radioData
    }
  },
  created() {
    // send location view change
    window.gtag('event', 'viewChange', {
      event_category: 'engagement',
      event_label: `location_1 - ${this.modalProperties[this.modalPageCount].headerData}`
    });
    //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Location Modal Viewed', `1 - ${this.modalProperties[this.modalPageCount].headerData}`]);
    // set default choice
    this.selectedChoice = "Sure"
  },
  methods: {
    getCurrentPosition(options) {
      if (navigator.geolocation) {
        return new Promise(
          (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options),
        );
      }
      return new Promise(resolve => resolve({}));
    },
    start() {
      if (this.selectedChoice === "Sure") {
        const geolocationOptions = {
          enableHighAccuracy: false,
          timeout: 4000,
          maximumAge: 0,
        };

        this.getCurrentPosition(geolocationOptions).then((position) => {
          const positionObj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          };
          this.$store.commit('setUserPosition', JSON.stringify(positionObj));
        }).then(() => {
          this.close()
        }).catch(() => {
          // eslint-disable-next-line
          console.log('failed')
          this.close()
          // It's likely that the user has denied access to location, do not
          // crash, just business as usual.
        });
      } else {
        this.close()
      }
    },
    close() {
      this.$emit('start');
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
  margin-left: 47px;
  margin-right: 47px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
}
.ch-radio-group {
  justify-content: center;
  max-height: 324px;
  align-content: center;
}

.radio-input >>> div.v-radio {
  margin: 8px 0 !important;
  max-width: 265px;
  justify-content: flex-start;
}
.radio-data-label {
  flex-direction: column !important;
  flex-wrap:  nowrap;
}
.radio-data-label >>> #text {
  width: 100%
}
.radio-input >>> label {
  font-weight: bold;
  font-family: Noto Sans;
  font-style: normal;
  font-size: 16.5px;
  position: relative;
}
.subtext {
  font-weight: 300
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
  position: absolute;
  top: 427px;
  left: 86px;
}
.button-container {
  position: absolute;
  top: 427px;
  left: 224px;
}

.footer-btn {
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

.skip-btn {
  background: none;
  color: #0000ff;
  border-radius: 100px;
  height: 40px;
  width: 152px;
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
