<template>  
  <keep-alive>
    <div class="box-wrapper" :class="confirmBoxFullCover?'fullCover':''" v-if="confrimBoxShow">
      <transition name="slide">
        <div v-show="builtInBoxShow" class="confirm-box ignore" :class="confirmBoxBtnType">
          <h3 id="confirmText" class="confirm-text">{{ confrimBoxContent }}</h3>
          <div class="btn-box">
            <span v-if="confirmBoxFallback" @click="confrim" class="btn-ok" :class="'btn-' + confirmBoxBtnType"></span>
            <span v-if="confirmBoxHaveCancel" @click="cancel" class="btn-cancel"></span>
          </div>
        </div>
      </transition>
    </div>
  </keep-alive>  
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'confirmBox',
  data() {
    return {
      builtInBoxShow: false
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_CONFIRM_BOX']),
    confrim() {
      this.TOGGLE_CONFIRM_BOX({isShow: false});
      this.confirmBoxFallback();
    },  
    cancel() {
      this.TOGGLE_CONFIRM_BOX({isShow: false});
    },
    setTextWrap() {
      let str = this.$store.state.confrimBox.content;
      let text = document.getElementById('confirmText');
      text.innerHTML = str.replace(/\n/g, '<br/>');
    }
  },
  computed: {
    ...mapGetters([
      'confrimBoxShow',
      'confirmBoxHaveCancel',
      'confirmBoxBtnType',
      'confrimBoxContent',
      'confirmBoxFallback',
      'confirmBoxFullCover'
    ])
  },
  watch: {
    confrimBoxShow(newVal,val) {
      if(newVal) {
        setTimeout(() => {
          this.builtInBoxShow = true;
          this.$nextTick(() => {
            this.setTextWrap();
          });
        },0)
      }else {
        this.builtInBoxShow = false;
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .box-wrapper {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, .65);
    .confirm-box {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      // width: 1057px;
      width: 5.161rem;
      height: 3.623rem;
      padding-top: 1.221rem;
      overflow: hidden;
      background: url(~assets/image/public/img_sign_out.png) no-repeat center/cover;
      backface-visibility: hidden;
      color: #000;
      font-size: .244rem;
      text-align: center;
      &.slide-enter-active, &.slide-leave-active {
        transition: all .6s;
      }
      &.slide-enter, &.slide-leave-to {
        transform: translateY(-200%);
      }
      .confirm-text {
        font-size: inherit;
        line-height: 70px;
      }
      .btn-box {
        position: absolute;
        bottom: .61rem;
        // bottom: 125px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        > span {
          // display:inline-block;
          // width: 310px;
          // height: 107px;
          width: 1.514rem;
          height: .522rem;
          background: url(~assets/image/public/btn_ok.png) no-repeat center/cover;
          &.btn-ok {
            background: url(~assets/image/public/btn_ok.png) no-repeat center/cover;
          }
          &.btn-cancel {
            margin-left: .342rem;
            background: url(~assets/image/public/btn_cancel.png) no-repeat center/cover;
          }
          &.btn-done {
            background: url(~assets/image/public/btn_done.png) no-repeat center/cover;
          }
        }
      }
    }
    // .confirm-box {
    //   box-sizing: border-box;
    //   display: inline-block;
    //   position: relative;
    //   width: 1057px;
    //   height: 742px;
    //   padding-top: 250px;
    //   overflow: hidden;
    //   background: url(~assets/image/public/img_sign_out.png) no-repeat center/cover;
    //   backface-visibility: hidden;
    //   color: #000;
    //   font-size: 50px;
    //   text-align: center;
    //   &.slide-enter-active, &.slide-leave-active {
    //     transition: all .6s;
    //   }
    //   &.slide-enter, &.slide-leave-to {
    //     transform: translateY(-200%);
    //   }
    //   .confirm-text {
    //     font-size: inherit;
    //   }
    //   .btn-box {
    //     position: absolute;
    //     bottom: 125px;
    //     left: 50%;
    //     transform: translateX(-50%);
    //     display: flex;
    //     justify-content: center;
    //     > span {
    //       // display:inline-block;
    //       width: 310px;
    //       height: 107px;
    //       background: url(~assets/image/public/btn_ok.png) no-repeat center/cover;
    //       &.btn-ok {
    //         background: url(~assets/image/public/btn_ok.png) no-repeat center/cover;
    //       }
    //       &.btn-cancel {
    //         margin-left: 70px;
    //         background: url(~assets/image/public/btn_cancel.png) no-repeat center/cover;
    //       }
    //     }
    //   }
    // }
    @media screen and (max-width: 960px){
      .confirm-box.ignore {
        width: 258px;
        height: 181px;
        padding-top: 61px;
        font-size: 12px;
        .btn-box {
          bottom: 31px;
          > span {
            width: 76px;
            height: 26px;
            &.btn-cancel {
              margin-left: 17px;
            }
            &.btn-done {
              background: url(~assets/image/public/btn_done.png) no-repeat center/cover;
            }
          }
        }
      }
    }
  }
  .fullCover {
    background-color: #fff;
    z-index: 999;
    // position: fixed;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // z-index: 999;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // text-align: center;
    // background: url('~assets/image/login/img_forgetPassword_bg.png') no-repeat center/cover;
  }
</style>


