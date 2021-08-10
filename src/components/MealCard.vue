<template>
  <v-card class="meal-card">
    <v-img :src="mapsUrl" aspect-ratio="2"></v-img>

    <v-card-title primary-title>
      <h3 class="title mb-0 font-weight-bold">{{ organizationName }}</h3>
    </v-card-title>

    <v-card-text class="py-0">
      <v-container class="pa-0">
        <v-layout column>
          <v-flex xs12>
            <v-icon class="pr-1">location_on</v-icon>
            {{ address }}
          </v-flex>
          <v-flex xs12 pb-1>
            <v-icon class="pr-1" color="white">location_on</v-icon>
            {{ walkTimeFormatted }}
          </v-flex>
          <v-flex xs12 pb-1>
            <v-icon class="pr-1">phone</v-icon>
            <a :href="phoneNumberLink">{{ phone_Number }}</a>
          </v-flex>
          <v-flex xs12>
            <v-icon class="pr-1">access_time</v-icon>
            {{ mealTime }}
          </v-flex>
          <v-flex xs12 pb-1>
            <v-icon class="pr-1" color="white">access_time</v-icon>
            {{ mealEndsIn }}
          </v-flex>
          <v-flex xs12 pb-1>
            <v-icon class="pr-1">people</v-icon>
            <span v-html="serving"></span>
          </v-flex>
          <v-flex xs12 pb-1>
            <v-btn flat color="primary" class="ma-0 pl-0">
              <v-icon class="pr-2">warning</v-icon>
              Report an error
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer />
      <v-btn flat color="primary" :href="directionsUrl" target="_blank">
        See directions
        <v-icon class="pr-1">call_made</v-icon>
      </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>


<script>
import moment from 'moment';

export default {
  props: {
    address: String,
    organizationName: String,
    phone_Number: String,
    latitude: Number,
    longitude: Number,
    program: String,
    LGBTQ: String,
    resourceId: String,
    meals__age__001: Number,
    meals__age__002: Number,
    meals__startTime: String,
    meals__endTime: String,
    meals__type: String,
    meals__notes: String,
    meals__gender: String,
    meals__race: String,
    mealEndsIn: String,
    serves: String,
    mapsUrl: String,
    directionsUrl: String,
    walkTime: Number,
  },
  data() {
    return {};
  },
  computed: {
    startTime() {
      return this.formatTime(this.meals__startTime);
    },
    endTime() {
      return this.formatTime(this.meals__endTime);
    },
    mealTime() {
      return `${this.startTime} - ${this.endTime}`;
    },
    serving() {
      return `Serves <strong>${this.serves}</strong>`;
    },
    walkTimeFormatted() {
      return `${this.walkTime} min walk`;
    },
    phoneNumberLink() {
      return `tel:${this.phone_Number}`;
    },
  },
  methods: {
    formatTime(value) {
      return moment(value, ['h:m a', 'H:m']).format('H:mma');
    },
  },
};
</script>

<style>
  .meal-card {
    border-radius: 12px;
  }

  .meal-card .v-btn {
    font-weight: bold;
    text-transform: none;
  }
</style>
