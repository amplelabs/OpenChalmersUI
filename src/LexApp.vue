<template>
  <div id="lex-app">
    <page
      v-bind:pageTitle="pageTitle"  
      v-once></page>
    <router-view></router-view>
  </div>
</template>

<script>
/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the 'License'). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the 'license' file accompanying this file. This file is distributed on an 'AS IS'
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/

/* eslint no-console: ['error', { allow: ['warn', 'error', 'info'] }] */
import Page from '@/components/Page';
import { Loader as LexWebUi } from '@/lex-web-ui';
import faviconLogo from '../static/img/ChalmersBot.svg';
import chalmersLogoHorizontalSvg from '../static/img/Chalmers-logo-Horizontal.svg';

function getToolbarLogo() {
  // Search for logo image files in ../assets/
  // if not found, assigns the default flower logo.
  const toolbarLogoRequire = require.context(
    '@/assets',
    false,
    /^\.\/logo.(png|jpe?g|svg)$/,
  );
  // Logo loading depends on the webpack require.context API:
  // https://webpack.github.io/docs/context.html

  const toolbarLogoRequireKey = toolbarLogoRequire.keys().pop();

  return toolbarLogoRequireKey
    ? toolbarLogoRequire(toolbarLogoRequireKey)
    : chalmersLogoHorizontalSvg;
}

function getFavIcon() {
  // search for favicon in assets directory - use toolbar logo if not found
  const favIconRequire = require.context(
    '@/assets',
    false,
    /^\.\/favicon.(png|jpe?g|svg|ico)$/,
  );
  const favIconRequireKey = favIconRequire.keys().pop();
  return favIconRequireKey ? favIconRequire(favIconRequireKey) : faviconLogo;
}

const lexWebUi = new LexWebUi({ ui: { toolbarLogo: getToolbarLogo() } });

export default {
  name: 'lex-app',
  store: lexWebUi.store,
  components: { Page },
  data() {
    return {
      favIcon: getFavIcon(),
      pageTitle: 'Chalmers, from AmpleLabs',
    };
  },
};
</script>

<style>
/* @import '../node_modules/roboto-fontface/css/roboto/roboto-fontface.css'; */
/* @import '../node_modules/font-proxima-nova/style.css'; */
@import '../node_modules/typeface-noto-sans/index.css';
@import '../node_modules/material-design-icons/iconfont/material-icons.css';
@import '../node_modules/vuetify/dist/vuetify.min.css';
@import url('https://use.typekit.net/qyl8awl.css');

.material-icons {
  font-family: 'Material Icons Round'; 
}
html {
  overflow-y: auto !important;
}
</style>
