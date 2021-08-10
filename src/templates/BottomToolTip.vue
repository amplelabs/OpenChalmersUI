<template>
  <v-container>
    <div class='modal'>
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
    <div class="modal-overlay"></div>
  </v-container>
</template>
<script>
export default {
  name: 'bottomToolTip'
};
</script>
<style scoped>

.modal-overlay {
  overflow: hidden;
  z-index: 10;
}

.modal {
  position: absolute;
  bottom: 71px;
  background: #ffffff;
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  grid-auto-flow: column;
  z-index: 11;
  left: calc(50% - 600px / 2 + 0.5px);
  bottom: 71px;
  width: 600px;
  min-height: 310px;
}
/* for upsidedown triangle */
.modal::before {
  content: "";
  width: 0;
  height: 0;
  border-top: 20px solid #ffffff;
  border-bottom: 20px solid transparent;  
  border-right:20px solid transparent;
  border-left:20px solid transparent;
  position: absolute;
  bottom: -30px; 
  left: calc(50% - 20px);
  border-radius: 12px;
}

@media (max-width: 959px) {
  .modal {
    left: calc(50% - 324px / 2 + 0.5px);
    bottom: 71px;
    width: 324px;
  }
}
/* overlay circle */
.modal-overlay::after {
  content: '';
  align-content: center;
  position: absolute;
  z-index: 10;
  top: 80%;
  left: -10vw;
  right: 0;
  width: 120vw;
  height: 40vw;
  border-radius: 100%;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
@media (max-width: 959px) {
  .modal-overlay::after {
    height: 80vw;
  }
}
@media (max-width: 599px) {
  .modal-overlay::after {
    height: 120vw;
  }
}
</style>
