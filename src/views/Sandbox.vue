<template>
  <v-app id="sandbox">
    <v-content>
      <v-container fluid>
        <v-layout>
          <v-flex xs12>
            <v-layout row>
              <v-flex v-for="(item, index) in meals" :key="index" grow xs9 offset-xs1>
                <MealCard v-bind="item.meal" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

import MealCard from '@/components/MealCard';

export default {
  components: {
    MealCard,
  },
  data() {
    return {
      meals: [],
    };
  },
  created() {
    axios.get('/static/fixtures/meals_toronto.json')
      .then(({ data }) => { this.meals = data; });
  },
};
</script>

<style>
  body {
    background-color:#f3f4f5;
  }

  .application {
    font-family: 'Noto Sans', sans-serif
  }
</style>

