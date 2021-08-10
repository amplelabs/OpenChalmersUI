<template>
    <v-container fluid>
      <v-layout column>
        <v-flex xs12>
          <div :class="$vuetify.breakpoint.smAndDown ? 'mobile-modal-backdrop' : 'modal-backdrop'">
            <div class="modal">
              <div class="modal-header">
                <slot name="header"></slot>
              </div>
              <div>
                <div class="modal-body">
                  <slot name="body"></slot>
                </div>
              </div>
              <div>
                  <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
</template>
<script>
export default {
    name: 'new-base-modal'
}
</script>
<style scoped>
.modal-backdrop {
  position: absolute;
  left: calc(50% - 600px / 2 + 0.5px);
  top: 55px;
  width: 600px;
  height: fit-content;
  background: #ffffff;
  box-shadow: 0px 0px 40px rgba(26, 26, 26, 0.7);
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  grid-auto-flow: column;
  z-index: 10;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
.mobile-modal-backdrop {
  position: absolute;
  left: calc(50% - 324px / 2 + 0.5px);
  top: 55px;
  width: 324px;
  height: fit-content;
  background: #ffffff;
  box-shadow: 0px 0px 40px rgba(26, 26, 26, 0.7);
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  grid-auto-flow: column;
  z-index: 10;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
</style>