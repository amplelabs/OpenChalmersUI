/*
 Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Amazon Software License (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/asl/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
 License for the specific language governing permissions and limitations under the License.
 */

/* eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
/* eslint no-param-reassign: off */

import Vue from 'vue';
import Vuex from 'vuex';
import initialState from '@/store/state';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import actions from '@/store/actions';

Vue.use(Vuex);

export default new Vuex.Store({
  // prevent changes outside of mutation handlers
  strict: (process.env.NODE_ENV === 'development'),
  state: initialState,
  getters,
  mutations,
  actions,
});
