<template>
  <v-dialog v-model="resource" max-width="400" scrollable>
    <v-card>
      <v-card-title
        v-if="!resourceSubmitted"
        style="background-color: #000044"
        dense
        class="new-service-title"
      >
        <v-toolbar-title class="white--text">Add a new service</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="close" class="pl-4">
          <v-icon color="white">close</v-icon>
          <span style="color: #000044"></span>
        </v-btn>
      </v-card-title>
      <v-card-text :class="{ 'pb-0': !resourceSubmitted }">
        <v-container pa-0 fluid>
          <v-layout column v-if="!resourceSubmitted" :fill-height="true">
            <v-flex xs12>
              <div class="sub-text">
                <span class="sub-title">About the organization</span>
              </div>
            </v-flex>
            <v-flex xs12>
              <v-label>Organization Name</v-label>
              <v-text-field
                :hide-details="true"
                v-model="org_name"
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Address</v-label>
              <v-textarea
                :hide-details="true"
                v-model="org_address"
                color="#000044"
                outline
                maxlength="50"
              ></v-textarea>
            </v-flex>
            <v-flex xs12>
              <v-label>Website</v-label>
              <v-text-field
                :hide-details="true"
                v-model="www"
                placeholder="http://"
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Phone number</v-label>
              <v-text-field
                :hide-details="true"
                v-model="org_phone"
                placeholder="xxx-xxx-xxxx"
                color="#000044"
                outline
                maxlength="30"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <div class="sub-text" style="margin-top: 14px">
                <span class="sub-title">Service provided</span>
              </div>
              <div class="sub-text">
                <p>
                  If the organization provides more than one services (ex. both
                  shelter and clothing), please submit one entry for each
                  service.
                </p>
              </div>
            </v-flex>
            <v-flex xs12>
              <v-label>Type of service</v-label>
              <v-text-field
                :hide-details="true"
                v-model="service"
                placeholder="ex. meals, shelter, etc."
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Service description</v-label>
              <v-text-field
                :hide-details="true"
                v-model="desc"
                placeholder="Provide more details about the service"
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Days and times served</v-label>
              <v-text-field
                :hide-details="true"
                v-model="days"
                placeholder="ex. 24/7, Monday 7 am - 9 am, Tuesday all day, closed on holidays, etc."
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <div class="sub-text" style="margin-top: 14px">
                <span class="sub-title">Who is eligible?</span>
              </div>
            </v-flex>
            <v-flex xs12>
              <v-label>Age</v-label>
              <v-text-field
                :hide-details="true"
                v-model="age"
                placeholder="ex. everyone, under 18, etc."
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Gender</v-label>
              <v-text-field
                :hide-details="true"
                v-model="eligibility"
                placeholder="ex. everyone, female only, LGBTQ+, etc."
                color="#000044"
                outline
                maxlength="50"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-label>Additional Items</v-label>
              <v-textarea
                :hide-details="true"
                v-model="notes"
                placeholder="ex. by appointment, closed on holidays, etc."
                outline
                color="#000044"
                name="input-7-4"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 class="submit-button">
              <v-spacer></v-spacer>
              <v-btn
                round
                large
                color="primary"
                @click="submitResource"
                class="capitalize"
                >Submit</v-btn
              >
            </v-flex>
          </v-layout>
          <v-layout row wrap v-else style="color: #000044">
            <v-flex xs12 class="thank-you-container">
              <div id="thank-you-title" class="text-xs-left">
                Thank you for your submission!
              </div>
              <p>
                Your submission has been sent for review. We’ll contact you
                should we require more information.
              </p>
              <p>
                Questions? You can always contact
                <a href="mailto:general@amplelabs.co">general@amplelabs.co</a>.
              </p>
            </v-flex>
            <v-flex xs6>
              <v-btn
                round
                outlined
                left
                color="white"
                @click="show"
                class="capitalize add-another-service-button"
                >Add another service</v-btn
              >
            </v-flex>
            <v-flex xs6>
              <v-btn
                round
                right
                color="primary"
                @click="close"
                class="capitalize done-button"
                >Done</v-btn
              >
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!resourceSubmitted" class="pt-2 pb-3 px-3">
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uuid from 'uuid';
import { callPostAddService } from '@/lib/ample-api';

export default {
  data() {
    return {
      resource: false,
      resourceSubmitted: false,
      org_name: null,
      org_address: null,
      org_phone: null,
      www: null,
      email: null,
      service: null,
      desc: null,
      days: null,
      age: null,
      eligibility: null,
      notes: null,
    };
  },
  methods: {
    show() {
      this.clearForm();
      this.resource = true;
      this.resourceSubmitted = false;
    },
    clearForm() {
      this.org_name = null;
      this.org_address = null;
      this.org_phone = null;
      this.www = null;
      this.email = null;
      this.service = null;
      this.desc = null;
      this.days = null;
      this.age = null;
      this.eligibility = null;
      this.notes = null;
    },
    submitResource() {
      this.resourceSubmitted = true;
      // eslint-disable-next-line
      const item = {
        id: uuid.v1(),
        org_name:
          this.org_name === null || this.org_name.length === 0
            ? 'na'
            : this.org_name,
        org_address:
          this.org_address === null || this.org_address.length === 0
            ? 'na'
            : this.org_address,
        org_phone:
          this.org_phone === null || this.org_phone.length === 0
            ? 'na'
            : this.org_phone,
        www: this.www === null || this.www.length === 0 ? 'na' : this.www,
        email:
          this.email === null || this.email.length === 0 ? 'na' : this.email,
        service:
          this.service === null || this.service.length === 0
            ? 'na'
            : this.service,
        desc: this.desc === null || this.desc.length === 0 ? 'na' : this.desc,
        days: this.days === null || this.days.length === 0 ? 'na' : this.days,
        age:
          this.age === null || this.age.length === 0 ? 'na' : this.age,
        eligibility:
          this.eligibility === null || this.eligibility.length === 0
            ? 'na'
            : this.eligibility,
        notes:
          this.notes === null || this.notes.length === 0 ? 'na' : this.notes,
      };
      // eslint-disable-next-line
      callPostAddService(
        this.$store.state.chalmersUser.userId,
        item.service,
        item.org_name,
        item.www,
        item.org_phone,
        item.desc,
        item.days,
        item.age,
        item.eligibility,
        item.notes
      )
        .then(() => {
          this.resourceSubmitted = true;
        })
        .catch((err) => {
          this.resourceSubmitted = false;
          this.resource = false;
          this.clearForm();
          // eslint-disable-next-line
          console.error(err);
        });
    },
    resourceCB() {
      this.resource = true;
    },
    close() {
      this.resource = false;
    },
  },
};
</script>

<style scoped>
.v-dialog__content >>> .v-text-field,
.v-dialog__content >>> .v-textarea {
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
.v-dialog__content >>> .v-text-field input {
  margin-top: 0px;
  min-height: 52px;
}
.v-dialog__content >>> .v-textarea textarea {
  margin-top: 8px;
}
.v-label {
  font-size: 14px;
  color: #000044;
  mix-blend-mode: normal;
  opacity: 0.6;
  padding-left: 2px;
}
.capitalize {
  text-transform: capitalize;
}
.submit-button {
  text-align: right;
}
.new-service-title {
  padding: 1px 16px;
}
.sub-text {
  padding-left: 2px;
  margin-bottom: 16px;
  font-weight: normal;
  font-size: 14px;
  opacity: 1;
  width: 335px;
}
.sub-title {
  font-family: 'noto-sans';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #000000;
}
.thank-you-container {
  font-size: 14px;
}
#thank-you-title {
  font-family: 'noto-sans';
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
}
.add-another-service-button {
  width: 192px;
  left: -6px;
  background: #ffffff !important;
  border: 1.1px solid #bd7800 !important;
  box-sizing: border-box !important;
  box-shadow: 1px 1px 8px rgba(176, 176, 178, 0.5) !important;
  border-radius: 24.948px !important;
}
.done-button {
  width: 151px;
  right: -14px;
}
.v-dialog__content input {
    font-size:14px !important;
}
</style>
