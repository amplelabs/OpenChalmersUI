<template>
    <base-modal>
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
            <div class="header-text">
                {{ modalProperties[modalPageCount].headerData }}
            </div>
        </template>
        <!-- Body -->
        <template v-slot:body>
            <div class="body-text">
                <span v-html="modalProperties[modalPageCount].bodyHtml"></span>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout row wrap>
                        <v-flex xs12 class="name-email-input">
                            <v-text-field
                                v-model="name"
                                :rules="nameRules"
                                label="First name"
                                required
                                ref="Name"
                                id="name_input"
                            ></v-text-field>
                            <img
                                v-if="name.length > 0"
                                alt="wave icon"
                                class="valid-field"
                                :src="require(`../assets/checkmark.svg`)"
                            />
                        </v-flex>
                        <v-flex xs12 class="name-email-input">
                            <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                label="E-mail"
                                required
                                ref="Email"
                                id="email_input"
                            ></v-text-field>
                            <img
                                v-if="
                                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                                        email
                                    )
                                "
                                alt="wave icon"
                                class="valid-field"
                                :src="require(`../assets/checkmark.svg`)"
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout class="pt-3">
                        <v-flex xs1>
                            <v-checkbox
                                v-model="optInMarketing"
                                :rules="optInMarketingRules"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs11
                            ><p
                                class="optin-label"
                                v-html="
                                    modalProperties[modalPageCount]
                                        .optInMarketingText
                                "
                            ></p
                        ></v-flex>
                    </v-layout>
                    <v-layout class="pt-0">
                        <v-flex xs1>
                            <v-checkbox
                                v-model="optInResearch"
                                class="optin"
                                :rules="optInResearchRules"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs11
                            ><p
                                class="optin-label"
                                v-html="
                                    modalProperties[modalPageCount]
                                        .optInResearchText
                                "
                            ></p
                        ></v-flex>
                    </v-layout>
                </v-form>
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
                        @click="next"
                        v-if="!modalProperties[modalPageCount].startChat"
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        class="footer-btn"
                        @click.once="accept"
                        v-if="modalProperties[modalPageCount].startChat"
                    >
                        Accept &amp; Continue
                    </button>
                </slot>
                <slot>
                    <div>
                        <button
                            type="button"
                            class="skip-btn"
                            @click.once="close"
                            v-if="modalProperties[modalPageCount].enableSkip"
                        >
                            Skip
                        </button>
                    </div>
                </slot>
            </div>
        </template>
    </base-modal>
</template>

<script>
import BaseModal from '../templates/NewBaseModal';
import { callMailChimp } from '../lib/ample-api';

export default {
    name: 'email-modal',
    components: { BaseModal },
    data() {
        return {
            valid: false,
            optInResearch: false,
            optInMarketing: false,
            name: '',
            nameRules: [v => !!v || 'Please enter your first name'],
            email: '',
            emailRules: [
                v => !!v || 'Please enter a valid email',
                v => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v) || 'Please enter a valid email',
            ],
            optInMarketingRules: [
                () => !!(this.optInResearch || this.optInMarketing) || '',
            ],
            optInResearchRules: [
                () => !!(this.optInResearch || this.optInMarketing) || 'Please select one or both of the above options',
            ],
            modalPageCount: 0,
            modalProperties: [
                {
                    icon: 'mail-icon.png',
                    headerData: 'Can we keep in touch?',
                    bodyHtml: `Your email will only be used to receive updates on new features`,
                    optInMarketingText:
                        'I want to recieve updates on new features',
                    optInResearchText:
                        'I would like to hear about <strong>paid</strong> research opportunities',
                    startChat: false,
                    enableSkip: true,
                    safeExit: true,
                },
            ],
        };
    },
    created() {
        // send location view change
        window.gtag('event', 'viewChange', {
            event_category: 'engagement',
            event_label: `email_1 - ${
                this.modalProperties[this.modalPageCount].headerData
            }`,
        });
        //! matomo
        window._paq.push([
            'trackEvent',
            `View Change Event`,
            'Email Modal Viewed',
            `1 - ${this.modalProperties[this.modalPageCount].headerData}`,
        ]);
    },
    computed: {
        city() {
            const { ipLocation } = this.$store.getters.lex.sessionAttributes;
            return JSON.parse(ipLocation).city;
        },
        optedIn() {
            return !(this.optInResearch || this.optInMarketing);
        },
    },
    methods: {
        exit() {
            this.$emit('closeEmailModal');
        },
        next() {
            // Validate and do something with email and name
            if (this.$refs.form.validate() === true) {
                // call API
                callMailChimp(
                    this.email,
                    this.name,
                    this.city,
                    this.optInResearch,
                    this.optInMarketing
                );
                this.$store.commit('setGivenEmail', 'true');
                this.close();
            }
        },
        close() {
            this.$store.commit('setSkippedEmail', true);
            this.$emit('closeEmailModal');
        },
    },
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
    margin: 22px 40px 20px;
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
    left: 86px;
    padding-bottom: 40px;
}
.button-container {
    position: relative;
    left: 224px;
    padding-bottom: 40px;
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
.v-input--selection-controls.v-input--checkbox {
    margin-top: -4px;
    margin-left: -4px;
}
.optin-label {
    text-align: left;
    padding-left: 10px;
}
.optin.v-input--checkbox >>> .v-messages__wrapper {
    position: fixed;
    padding-top: 15px;
    visibility: hidden;
}
.optin.error--text.v-input--checkbox >>> .v-messages__wrapper {
    visibility: visible;
    position: fixed;
    padding-top: 15px;
}
@media (min-width: 960px) {
    .optin-label {
        padding-left: 2px;
    }
    .body-text {
        margin-left: 70px;
        margin-right: 70px;
    }
    .optin.error--text.v-input--checkbox >>> .v-messages__wrapper {
        padding-top: 0px;
    }
}

.name-email-input {
    position: relative;
}
.valid-field {
    position: absolute;
    top: 24px;
    right: 0px;
}
.accent--text {
    color: #0000ff;
}
</style>
