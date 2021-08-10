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
      <div v-if="useAltBody && modalProperties[modalPageCount].altHeaderData" class="header-text">
        {{ modalProperties[modalPageCount].altHeaderData }}
      </div>
      <div v-else class="header-text"> 
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
        <div v-if="!modalProperties[modalPageCount].enableForm" class="radio-input">
          <v-radio-group  v-model="selectedChoice" hide-details class="ch-radio-group">
            <v-radio
              v-for="(data, index) in compRadioData"
              :value="data"
              :key="index"
              :color="'#0000FF'"
              style="font-size: 18px !important; align-items: flex-start;"
            >
              <template slot="label">
                <v-flex xs12>
                  <div class="radio-data-label">
                    <span>{{data}}</span>
                    <span class="subtext" v-if="modalProperties[modalPageCount].radioDataSubText[index] && !useAltBody">{{modalProperties[modalPageCount].radioDataSubText[index]}}</span>
                  </div>
                  <input
                    v-if="selectedChoice === data && modalPageCount === 2 && modalProperties[modalPageCount].placeholder"
                    v-model="otherData"
                    hide-details
                    height="40px"
                    id="otherData"
                    name="otherData"
                    :placeholder="modalProperties[modalPageCount].placeholder[index]"
                    class="radio-text-input"
                  />
                </v-flex>
              </template>
            
            </v-radio>
          </v-radio-group>
        </div>
        <div v-if="modalProperties[modalPageCount].enableForm" class="name-email-input">
          <v-form ref="form" v-model="valid" lazy-validation style="max-width: 260px; margin: 0 auto;">
            <v-text-field
              v-model="name"
              name="name"
              :rules="nameRules"
              placeholder="Enter your name"
              class="input-box"
              required
            ></v-text-field>
            <v-text-field
              v-model="email"
              name="email"
              :rules="emailRules"
              placeholder="Enter your email"
              class="input-box"
              required
            ></v-text-field>
          </v-form>
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
import { callPostUserEmail, callPostUserName, callPostOnboarding } from "@/lib/ample-api"
import BaseModal from "../templates/BaseModal"

export default {
  name: 'onboarding-modal',
  components: { BaseModal },
  data() {
    return {
      otherData: '',
      justBrowsing: false,
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
          startChat: false,
          enableSkip: true,
          enableForm: false,
          icon: 'wave-icon.png',
          headerData: 'Welcome to Chalmers!',
          bodyData: 'Before we get started, what brought you here today?',
          altBodyData: null,
          radioData: ["I'm looking for help", "I'm helping someone", "I'm just browsing"],
          altRadioData: null,
          radioDataSubText: ['', '', '']
        },
        2: {
          icon: 'thinking-icon.png',
          altHeaderData: `That's nice of you`,
          headerData: 'Ok, got it...',
          bodyData: 'Can you tell me a bit more about yourself?',
          altBodyData: `Can you tell me a bit more about yourself?`,
          radioData: ["I'm a social worker", "I'm a first responder (police, ambulance, etc.)", 'Other'],
          altRadioData: ["I'm a social worker", "I'm a first responder (police, ambulance, etc.)", 'Other'],
          radioDataSubText: ['', '', ''],
          enableSkip: true,
          placeholder: [`Which Organization?`, `What do you do?`, `Can you be more specific?`]
        },
        3: {
          icon: 'house-icon.png',
          altHeaderData: `To better help`,
          headerData: 'To better help',
          bodyData: 'Can you tell me what is your current housing situation?',
          altBodyData: `Can you tell me what is their current housing situation?`,
          radioData: ['I rent or own my place', "I don't have my own place", 'I am living in an emergency shelter'],
          altRadioData: ['They rent or own their place', "They don't have their own place", 'They are living in an emergency shelter'],
          radioDataSubText: ['', '(crashing with friends, sleeping in car, etc.)', ''],
          enableSkip: true,
          placeholder: [`Which Organization?`, `What do you do?`, `Can you be more specific?`]
        },
        4: {
          icon: 'time-icon.png',
          headerData: 'Can you tell me more?',
          bodyData: 'How long have you been living in this situation?',
          altBodyData: 'How long have they been living in this situation?',
          radioData: ['Less than 6-months', 'Between 6-months to a year', 'More than a year'],
          altRadioData: null,
          radioDataSubText: ['', '', ''],
          enableSkip: true,
        },
        // 5: {
        //   icon: 'mail-icon.png',
        //   headerData: 'Can we keep in touch?',
        //   bodyData: "We'd love to give you updates on new features!",
        //   altBodyData: null,
        //   altRadioData: null,
        //   enableForm: true,
        //   enableSkip: true,
        // }
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
    window.gtag('event', 'viewChange', {
      event_category: 'engagement',
      event_label: `onboarding_${this.modalPageCount} - ${this.modalProperties[this.modalPageCount].headerData}`
    });
     //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Onboarding Modal Viewed', `${this.modalPageCount} - ${this.modalProperties[this.modalPageCount].headerData}`]);
  },
  methods: {
    sendData() {
      if (this.name.length || this.email.length) {
        if (this.name.length) {
          this.$store.commit('setUserName', this.name);
          callPostUserName(this.$store.state.chalmersUser.userId, this.$store.state.userName)
        }
        if (this.email.length) {
          this.$store.commit('setUserEmail', this.email);
          callPostUserEmail(this.$store.state.chalmersUser.userId, this.$store.state.userEmail)
        }
        this.selectedChoice = null
      } else {
        let dataObj = {}
        if (this.otherData.length) {
          dataObj = {
            question: this.modalProperties[this.modalPageCount].bodyData,
            // send skip rather than null if no
            answer: this.selectedChoice ? `${this.selectedChoice}-${this.otherData}` : 'skip',
            timestamp: new Date()
          }
        } else {
          dataObj = {
            question: this.modalProperties[this.modalPageCount].bodyData,
            // send skip rather than null if no
            answer: this.selectedChoice ? this.selectedChoice : 'skip',
            timestamp: new Date()
          };
        }
        if (this.modalPageCount === 1 && (this.selectedChoice === "I'm helping someone" || this.selectedChoice === "I'm just browsing")) {
          this.useAltBody = true;
        }
        if (this.modalPageCount === 1 && this.selectedChoice === "I'm just browsing") {
          this.justBrowsing = true;
        }
        this.$store.commit('setOnboardingResponse', dataObj);
        // Post Onboarding Results after entering the last window
        this.selectedChoice = null
        this.otherData = ''
      }
      if (this.modalPageCount === Object.keys(this.modalProperties).length) {
        callPostOnboarding(
          this.$store.state.chalmersUser.userId,
          this.$store.state.onboardingResponse
        )
        // set flag so onboarding does not re-appear for returning user
        this.$store.commit('setOnboarding', "true")
      }
    },
    close() {
      this.$emit('closeOnboarding');
    },
    next() {
      this.sendData();
      if (this.modalPageCount === Object.keys(this.modalProperties).length) {
        this.close();
      } else {
        this.nextModalPage();
      }
    },
    skip() {
      this.close();
    },
    nextModalPage() {
      if (this.modalPageCount === 1 && !this.useAltBody) {
        this.modalPageCount += 1;
      }
      if (this.modalPageCount === 1 && this.justBrowsing) {
        this.useAltBody = false;
      }
      this.modalPageCount += 1;
      // track subsequent onboarding events
      window.gtag('event', 'viewChange', {
        event_category: 'engagement',
        event_label: `onboarding_${this.modalPageCount} - ${this.useAltBody ? this.modalProperties[this.modalPageCount].altHeaderData : this.modalProperties[this.modalPageCount].headerData}`
      });
       //! matomo
    window._paq.push(['trackEvent', `View Change Event`, 'Onboarding Modal Viewed', `${this.modalPageCount} - ${this.useAltBody ? this.modalProperties[this.modalPageCount].altHeaderData : this.modalProperties[this.modalPageCount].headerData}`]);
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
  min-height: 185px;
  align-items: center;
  justify-content: space-around;
}
.radio-input >>> .v-input__control {
  min-height: 185px;
}
.radio-input >>> .v-input--selection-controls {
  margin-top: -16px;
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
.radio-text-input {
  height: 40px;
  border-radius: 8px;
  border: 1.5px solid #9A9A9A;
  padding-left: 9px;
  font-size: 14px;
  width: 200px;
  margin-top: 10px;
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
.name-email-input {
  margin-top: 16px;
}

@media (min-width: 960px) {
  .radio-input-container {
    margin-top: 30px;
  }
}
</style>
