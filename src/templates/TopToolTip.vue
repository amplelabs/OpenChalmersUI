<template>
  <v-container>
    <div class='modal' :class="direction">
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
    <div class="modal-overlay" :class="direction"></div>
  </v-container>
</template>
<script>
export default {
  name: 'topToolTip',
  props: ['direction']
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
  top: 61px;
  width: 324px;
  min-height: 310px;
}
.modal.right {
  right: 37px;
}
.modal.left {
  left: 37px;
  min-height: 268px;
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
}
.modal.right::before {
  right: 45px;
}
.modal.left::before {
  left: 45px;
}

@media (max-width: 400px) {
  .modal.left, .modal.right {
    left: calc(50% - 324px / 2 + 0.5px);
  }
}
/* overlay circle */
.modal-overlay::before {
  content: '';
  position: absolute;
  z-index: 10;
  bottom: 90%;
  width: 225px;
  height: 225px;
  border-radius: 100%;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
.modal-overlay.left::before {
  left: -40px;
}
.modal-overlay.right::before {
  right: -40px;
}
</style>
