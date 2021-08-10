<template>
  <v-dialog v-model="dialog" max-width="350">
    <v-toolbar style="background-color:#000044" dense>
      <v-toolbar-title class="white--text">Share Chalmers</v-toolbar-title>
      <v-spacer />
      <v-btn icon style="margin-right:-1.4em; padding-left:-12px" @click="dialog=false">
        <v-icon color="white">close</v-icon>
        <span style="color:#000044"></span>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout align-center row v-if="!shareConfirm">
          <v-flex xs8>
            <v-text-field color="red" v-model="url"></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn
              style="margin-left:-5px; color: #000044;"
              round
              outline
              small
              @click="copyToClipboard"
            >Copy URL</v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap text-xs-right v-else>
          <v-flex xs4>
            <v-icon large style="color:#000044">check_circle</v-icon>
          </v-flex>
          <v-flex xs8>
            <p class="text-xs-left font-weight-bold" style="color:#000044">
              Success!
              <br />Link copied!
            </p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      shareConfirm: false,
      url: 'https://chalmersbot.amplelabs.co',
    };
  },
  methods: {
    copyToClipboard() {
      // https://developers.google.com/web/updates/2018/03/clipboardapi
      navigator.clipboard.writeText(this.url)
        .then(() => {
          // console.log('Text copied to clipboard');
          // this.dialog = false;
          this.shareConfirm = true;
          const intervalId = setTimeout(() => {
            this.shareConfirm = false;
            this.dialog = false;
            clearInterval(intervalId);
          }, 2000);
        })
        .catch((err) => {
          // This can happen if the user denies clipboard permissions:
          // eslint-disable-next-line
          console.error('Could not copy text: ', err);
        });
    },
    shareCB() {
      this.dialog = true;
    },
  },
};
</script>

