<template>
  <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="modal-box">
                <slot name="modalContent">你已完成</slot>
            </div>
            <div class="modal-btn">
                <span class="modal-close" @click="$emit('back')">
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
    width: 1191px;
    height: 1170px;
    background: url("@{imgBaseUrl}/img_congratulate.png") no-repeat;
    background-size: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    .modal-box {
      margin: 0 auto;
      margin-top: 868px;
      color: #fff;
      text-align: center;
    }
    .modal-btn {
      position: absolute;
      bottom: -107px;
      left: 50%;
      transform: translateX(-50%);
      > span {
        width: 310px;
        height: 107px;
        display: inline-block;
        text-align: center;
        line-height: 107px;
        color: #fff;
        &:last-child {
          margin-left: 35px;
        }
        &:first-child {
          margin-right: 35px;
        }
      }
      .modal-close {
        background: url("@{imgBaseUrl}/btn_back_task.png");
        background-size: contain;
      }
    }
  }
  .modal-background {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.67);
  }
}
</style>
<script>
export default {
  data: function() {
    return {};
  },
  computed: {}
};
</script>
