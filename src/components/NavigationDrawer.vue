<template>
  <v-navigation-drawer
    app
    right
    temporary
    :permanent="navTipVisible"
    :stateless="navTipVisible"
    v-model="drawer"
    class="primary nav-drawer"
    :class="!drawer ? 'hide-shadow' : ''"
    ref="navigationDrawer"
  >
    <v-list dense>
      <v-list-tile v-for="item in items" :key="item.title">
        <v-btn v-if="item.href" flat color="white" :href="item.href" target="_blank" class="nav-button">
          <v-list-tile-action v-if="item.isIcon">
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-action v-if="!item.isIcon">
            <img
              alt="icon"
              :src="require(`../assets/${item.image}`)"
            />
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-btn>
        <v-btn v-else flat color="white" @click="item.onClick" class="nav-button">
          <v-list-tile-action v-if="item.isIcon">
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-action v-if="!item.isIcon">
            <img
              alt="icon"
              :src="require(`../assets/${item.image}`)"
            />
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-btn>
      </v-list-tile>
    </v-list>
    <a href="https://211ontario.ca" target="_blank"><v-img :src="require(`../assets/211logo.svg`)" height="104.05px" width="200px" class="two-logo"></v-img></a>
    <v-btn flat block color="white" class="nav-button center-button nav-footer-btn">
      Version 1.5.1
    </v-btn>
    <NewResourceDialog ref="newResourceDialog" />
    <FeedbackDialog ref="feedbackDialog" />
    <ShareDialog />
   
  </v-navigation-drawer>
</template>
<script>
import FeedbackDialog from './FeedbackDialog';
import NewResourceDialog from './NewResourceDialog';
import ShareDialog from './ShareDialog';

export default {
  name: 'NavigationDrawer',
  components: {
    FeedbackDialog,
    NewResourceDialog,
    ShareDialog,
  },
  props: ['navTipVisible'],
  data() {
    return {
      items: [
        {
          title: 'Add a Service',
          icon: 'add_circle',
          onClick: this.showNewResourceDialog,
          isIcon: true
        },
        {
          title: 'Give Feedback',
          icon: 'feedback',
          onClick: this.showFeedbackDialog,
          isIcon: true
        },
        {
          title: 'How to use Chalmers',
          image: 'how-to-use.svg',
          onClick: this.startToolTip,
          isIcon: false
        },
        {
          title: 'Terms & Conditions',
          href: 'https://amplelabs.co/legal',
          isIcon: false,
          image: 'legal-icon.svg'
        }
      ]
    };
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.navDrawer
      },
      set(boolean) {
        this.$store.commit('setNavDrawer', boolean)
      }
    }
  },
  methods: {
    showNewResourceDialog() {
      this.$refs.newResourceDialog.show();
    },
    showFeedbackDialog() {
      this.$refs.feedbackDialog.open();
    },
    startToolTip() {
      this.$store.commit('setNavDrawer', false)
      this.$emit('startToolTip')
    },
  },
  watch: {
    drawer(cur, old) {
      // event on open
      if (old === false && cur === true) {
        if (this.$store.getters.toolTipComplete !== "true") {
          this.$emit('startNavTip')
        }
      }
    }
  },
};
</script>
<style scoped>
.center-button {
  text-align: center;
  font-size: 12px;
  line-height: 16px;
}
.nav-drawer {
  margin-top: 48px !important;
  box-shadow: 0px 0 10px rgba(0, 0, 0, 0.8);
  z-index: 9;
}
.nav-footer-btn {
  position: absolute;
  bottom: 46px;
}
.two-logo {
  position: absolute;
  bottom: 100px;
  left: 48px;
}
.hide-shadow {
  box-shadow: none;
}
/* Fix nav icon size */
.v-list--dense .v-list__tile .v-icon {
  font-size: 24px;
}
</style>
