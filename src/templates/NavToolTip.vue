<template>
  <v-container>
    <div class='modal' :class="buttonName">
      <header class="modal-header">
        <slot name="header"></slot>
      </header>
      <body>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </body>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
    <div class="modal-overlay" :class="buttonName"></div>
  </v-container>
</template>
<script>
export default {
  name: 'navToolTip',
  props: ['buttonName']
};
</script>
<style scoped>

.modal-overlay {
  overflow: hidden;
  z-index: 10;
}

.modal {
  position: absolute;
  background: #ffffff;
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  grid-auto-flow: column;
  z-index: 11;
  width: 324px;
  min-height: 310px;
  right: 37px;
}
.free-services {
  top: 99px;
}
.give-feedback {
  top: 140px;
}
.how-to-use-chalmers {
  top: 181px;
}
/* for upsidedown triangle */
.modal::before {
  content: "";
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid #ffffff;  
  border-right:20px solid transparent;
  border-left:20px solid transparent;
  position: absolute;
  top: -30px; 
  border-radius: 12px;
  right: 45px;
}

@media (max-width: 400px) {
  .modal {
    left: calc(50% - 324px / 2 + 0.5px);
  }
}
/* overlay circle */
.modal-overlay::before {
  content: '';
  position: absolute;
  z-index: 10;
  top: 20px;
  width: 259px;
  height: 259px;
  border-radius: 100%;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  right: 30px;
}

</style>
