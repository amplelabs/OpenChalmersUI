<template>
  <v-dialog v-model="$store.state.feedbackDialog" max-width="400">
    <v-toolbar v-if="!submitted" color="primary" dense>
      <v-toolbar-title class="white--text">Give Feedback</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="close">
        <v-icon fab color="white">close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-card-text :class="{ 'pb-0': !submitted }">
        <v-container pa-0 fluid>
          <v-layout wrap v-if="!submitted">
            <v-flex xs12>
              <v-select
                v-model="item.feedbackType"
                :items="feedbackTypeItems"
                :rules="[v => !!v || 'Feedback type is required']"
                label="Feedback Type"
                required
                outline
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="item.serviceType"
                :items="serviceTypeItems"
                :rules="[v => !!v || 'Service type is required']"
                label="Service Type"
                required
                outline
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                outline
                label="Service Provider"
                v-model="item.serviceProvider"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                outline
                color="#000044"
                v-model.trim="item.description"
                label="Description"
                placeholder="e.g. Free meal is only available for those that stay overnight"
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout column align-center v-else>
            <v-flex xs12>
              <p class="headline">Thank you for your feedback!</p>

              <p>
                Your feedback will be used to help our team make this chatbot
                better.
              </p>

              <p>
                Questions? You can always contact
                <a href="mailto:general@amplelabs.co">general@amplelabs.co</a>.
              </p>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="close" round color="primary">Done</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!submitted" class="pt-0 px-3 pb-3">
        <v-spacer></v-spacer>
        <v-btn round color="primary" @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { callPostFeedback } from '@/lib/ample-api';
import { setTimeout } from 'timers';
import ServiceProviderAutocomplete from './ServiceProviderAutocomplete';

const ANIMATION_DURATION = 300;
const DEFAULT_DESCRIPTION = 'na';

export default {
  components: {
    ServiceProviderAutocomplete
  },
  data() {
    return {
      submitted: false,
      feedbackTypeItems: [
        'Feature request',
        'General feedback',
        'Inaccurate information',
        'Issue / Bug'
      ],
      serviceTypeItems: [
        'Clothing',
        'Drop-in',
        'Crisis Lines',
        'Free Meal',
        'Food Bank',
        'Shelter'
      ],
      item: {
        feedbackType: '',
        serviceType: '',
        serviceProvider: '',
        description: ''
      },
      defaultItem: {
        feedbackType: '',
        serviceType: '',
        serviceProvider: '',
        description: ''
      }
    };
  },
  methods: {
    open() {
      this.$store.commit('toggleFeedbackDialog', true);
    },
    close() {
      this.$store.commit('toggleFeedbackDialog', false);
      // Delay changing state because of dialog close animation.
      setTimeout(this.resetForm, ANIMATION_DURATION);
    },
    submit() {
      // Make a copy because we might modify the item and we do not want the UI
      // to reflect that change.
      const item = Object.assign({}, this.item);

      if (item.description.length === 0) {
        item.description = DEFAULT_DESCRIPTION;
      }
      callPostFeedback(
        item.description,
        item.feedbackType,
        item.serviceType,
        item.serviceProvider
      ).then(() => {
        this.submitted = true;
      });
    },
    resetForm() {
      this.submitted = false;
      this.item = Object.assign({}, this.defaultItem);
    }
  }
};
</script>
