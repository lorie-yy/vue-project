<template>
  <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="modal-box">
                <slot name="modalContent">你已完成</slot>
            </div>
            <div class="btn-center">
              <span :class="[centerBtn(),'modal-close']" @click="back">
                  <slot name="modalback"></slot>
              </span>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@imgBaseUrl: "../assets/image/public";
.modal {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 99999;
  .modal-content {
    width: 1057px;
    height: 742px;
    background: url("@{imgBaseUrl}/img_popup.png") no-repeat;
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 0;
    opacity: 0;
    transform: translateX(-50%);
    animation: slideDown 1s forwards;
    .modal-box {
      width: 945px;
      height: 380px;
      margin: 0 auto;
      margin-top: 56px;
    }
    .btn-center {
      margin-top: 74px;
      text-align: center;
      span{
        width: 310px;
        height: 107px;
        display: inline-block;
        line-height: 107px;
      }
    }
    .modal-btn-group {
      margin-top: 74px;
      > span {
        width: 310px;
        height: 107px;
        display: inline-block;
        text-align: center;
        line-height: 107px;
        &:last-child {
          margin-left: 35px;
        }
        &:first-child {
          margin-right: 35px;
        }
      }
    }
  }
  .modal-background {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.67);
  }
  @keyframes slideDown {
    from {
      top: 0;
      opacity: 0;
    }
    to {
      top: 25%;
      opacity: 1;
    }
  }
}

.close-btn-link {
  background: url(../assets/image/public/btn_back_unit.png) no-repeat;
}
.next-btn-link {
  background: url(../assets/image/public/btn_next_group.png) no-repeat;
}
.close-btn-task {
  background: url(../assets/image/public/btn_back_task.png) no-repeat;
}
.next-btn-again {
  background: url(../assets/image/public/btn_again.png) no-repeat;
}
.close-btn-cancel {
  background: url(../assets/image/public/btn_cancel.png) no-repeat;
}
.confirm-btn {
  background: url(../assets/image/public/btn_ok.png) no-repeat;
}

.modal-close {
  background-size: cover;
}
.modal-submit {
  background-size: cover;
}
</style>
<script>
export default {
  data: function() {
    return {};
  },
  computed: {},
  props: ["type"],
  methods: {
    centerBtn(){
      switch (this.type){
        case 1:
          return "close-btn-link";
        case 2:
          return "close-btn-task";
      }
    },
    back(){
      this.$emit('back',this.type)
    }
  }
};
</script>
