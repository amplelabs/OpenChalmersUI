<template>
  <v-toolbar class="chalmers-primary" app dense flat fixed clipped-right>
    <img
      width="95"
      height="24"
      v-if="logo"
      v-bind:src="logo"
      @click="restartBot"
      style="cursor:pointer;"
    />
    <v-spacer />
 
     <v-btn flat @click="showNav" class="nav-button toolbar-menu chalmers-primary">
      <v-spacer />
      <img alt="icon" :src="require(`../assets/menu.svg`)" class="toolbar-menu-button"/>
      &nbsp;Menu
    </v-btn>
   
  </v-toolbar>
</template>

<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/
export default {
  name: 'toolbar-container',
  data() {
    return {
      processing: false,
    }
  },
  props: {
    title: String,
    logo: String,
    isOnboarding: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    restartBot() {
      if (this.processing === false && this.isOnboarding === false) {
        this.processing = true
        this.$store.dispatch('restartBot')
        // set timeout to avoid duplicate messages
        setTimeout(() => {
          this.processing = false
        }, 10000)
      }
    },
    showNav() {
      this.$emit('showNav');
    },
  },
};
</script>

<style scoped>

.toolbar-menu {
  margin-right: -14px;
}
.toolbar-menu-button {
  height: 22px;
  width: 22px;
  color: #000044;
  font-size: 16px;
}
.chalmers-primary {
  background-color: #FEC201 !important;
  font-family: 'noto-sans';
  font-weight: 500;
}
</style>
