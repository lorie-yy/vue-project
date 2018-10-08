<template>
  <transition name="slide-fade" >
    <div class="passwordChange ignore">
      <group class="reset-group">
         <x-input 
          title="原密码：" 
          type="password" 
          ref="passwordOld"
          :max="18" 
          @on-focus="handleFocus('passwordOld')" 
          @on-blur="handleBlur('passwordOld')" 
          v-model.trim="formData.passwordOld" 
          placeholder="请输入原密码">
        </x-input>
        <x-input
          title="新密码：" 
          type="password" 
          ref="passwordNew" 
          :max="18"
          @on-focus="handleFocus('passwordNew')"
          @on-blur="handleBlur('passwordNew')" 
          v-model.trim="formData.passwordNew"
          placeholder="请输入新密码">
        </x-input>
        <x-input
          title="确认密码："  
          type="password" 
          ref="passwordAgain"
          :max="18" 
          @on-focus="handleFocus('passwordAgain')" 
          @on-blur="handleBlur('passwordAgain')" 
          v-model.trim="formData.passwordAgain" 
          placeholder="再次输入新密码">
        </x-input>
      </group>
      <div class="toolTipList">
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.passwordOld.show?'visible':'hidden'}"
         v-font="{fontSize: 36, anchor: '0 0'}">{{ tooltipData.passwordOld.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.passwordNew.show?'visible':'hidden'}"
         v-font="{fontSize: 36, anchor: '0 0'}">{{ tooltipData.passwordNew.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.passwordAgain.show?'visible':'hidden'}"
         v-font="{fontSize: 36, anchor: '0 0'}" >{{ tooltipData.passwordAgain.msg }}</span>
      </div>
      <div class="submit-btn">
        <img @click="handleSubmit" :src="imgCurrent.imgSubmit" alt="">
      </div>
    </div>  
  </transition>
</template>
<script>
// import { XInput, Group, Toast } from 'vux';
import formConfig from 'assets/js/mixinForm';
import { changePassword } from 'api/getData';
import { mapMutations } from 'vuex';
import { setInputFont } from 'assets/js/utils';
import { setTimeout } from 'timers';
export default {
  name: 'resetPhone',
  mixins: [formConfig],
  components: {
    // XInput, Group, Toast
  },
  data() {
    return {
      formData: {
        passwordOld: null,
        passwordNew: null,
        passwordAgain: null
      },
      tooltipData: {
        passwordOld: {
          show: false,
          msg: '',
          pass: false
        },
        passwordNew: {
          show: false,
          rule: (pas, pasAgain) => {
            if(pasAgain && pasAgain !== pas) {
              return {
                testRes: false,
                msg: '两次填写的密码不一致'
              }
            }
            return {
              testRes: true,
              msg: ''
            }
          },
          pass: false
        },
        passwordAgain: {
          show: false,
          rule: (pasAgain, pas) => {
            return {
              testRes: pasAgain === pas,
              msg: '两次填写的密码不一致'
            }
          },
          pass: false
        }
      },
      // imgCurrent: {
      //   imgSubmit: null
      // },
      imgList: {
        imgSubmit1: require('assets/image/public/btn_save_disable.png'),
        imgSubmit2: require('assets/image/public/btn_save_normal.png')
      },
      sendDisabled: false
    }
  },
  mounted() {
    setInputFont('.reset-group')
    this.setInputLabelFont();
  },
  methods: {
     ...mapMutations([
     'TOGGLE_USER_COMPONENT'
    ]),
    _validate(name,tooltipData, formData) {
      // 防止blur事件先于input清除事件发生
      setTimeout(() => {
        let tooltip = tooltipData[name],
          value = formData[name];
        if(!value) {
          return;
        }
        let res;
        if(tooltip.rule) {
          if(tooltip.rule instanceof Function) {
            res = tooltip.rule(formData.passwordNew, formData.passwordAgain);
          }else if (tooltip.rule instanceof RegExp) {
            res = {testRes: tooltip.rule.test(value), msg: tooltip.msg};
          }
          if(!res.testRes) {
            tooltip.msg = res.msg;
            tooltip.show = true;
            tooltip.pass = false;
            // setTimeout(()=>{tooltip.show = false;},2000)
          }else {
            tooltip.pass = true;
          }
        }else {
          tooltip.pass = true;
        }
      },100)
    },
    handleSubmit() {
      if(this.btnDisable) {
        return;
      }
      this._validateForm(this.formData).then((res) => {
        if(res) {
          changePassword({
            userId: "",
            oldPassword: this.formData.passwordOld,
            newPassword: this.formData.passwordNew,
          }).then((res) => {
            if(res) {
              this.$vux.toast.text('密码更改成功');
              this.TOGGLE_USER_COMPONENT('userInfo');
            }
          },err => {
            this.tooltipData.passwordOld.show = true
            this.tooltipData.passwordOld.msg = err
          });
        }
      })
    },
    setInputLabelFont() {
      const classSelector = '.reset-group .vux-x-input .weui-cell__hd label'
      let inputLabel = document.querySelectorAll(classSelector)
      const targetFont = window.innerHeight * 46/1536;
      const scale = targetFont/12
      Array.from(inputLabel).forEach((item) => {
        if (targetFont < 12 && item.offsetHeight !== 0) {
          // item.style.fontSize = '3.125vh'
          item.style.transform = 'scale(' + scale + ')';
          item.style.transformOrigin = '0% 0%';
          // item.style.lineHeight = item.style.height = `${item.offsetHeight/scale}px`
          item.style.width = `${item.offsetWidth/scale}px`
        }
      })
    }
  },
  computed: {
    passwordOldShow() { return this.tooltipData.passwordOld.show },
    passwordNewShow() { return this.tooltipData.passwordNew.show },
    passwordAgainShow() { return this.tooltipData.passwordAgain.show }
  },
  watch: {
    passwordOldShow(val) {
      if(val) setTimeout(() => { this.tooltipData.passwordOld.show = false },2000)
    },
    passwordNewShow(val) {
      if(val) setTimeout(() => { this.tooltipData.passwordNew.show = false },2000)
    },
    passwordAgainShow(val) {
      if(val) setTimeout(() => { this.tooltipData.passwordAgain.show = false },2000)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~assets/style/mixin';
  @imgUrl: '~assets/image/userCenter';
  .passwordChange {
    position: absolute;
    // top:246px;
    top:1.201rem;
    .flexJ();
    // .wh(1203px, 994px);
    .wh(5.874rem, 4.854rem);
    background:url('@{imgUrl}/img_modify_password.png') no-repeat center/100%;
    &.slide-fade-enter-active, &.slide-fade-leave-active {
      transition: all 1s ease;
    }
    &.slide-fade-enter, &.slide-fade-leave-to {
      transform: translateX(200%);
      opacity: 0;
    }
    .reset-group {
      // width: 800px;
      // padding-top: 310px;
      width: 3.906rem;
      // padding-top: 310px;
      padding-top: 1.514rem;
    }
    .toolTipList {
      // .toolTipList(274px, -334px);
      .toolTipList(1.338rem, -1.631rem);
    }
    .submit-btn {
      // .btn-submit(97px);
      .btn-submit(.474rem);
    }
  }
  @media screen and (max-width: 960px){
    .passwordChange.ignore {
      top: 60px;
      .wh(294px, 243px);
      .reset-group {
        width: 195px;
        padding-top: 76px;
      }
      .toolTipList {
        .toolTipListMedia(67px, -82px);
      }
      .submit-btn {
        .btn-submit(24px, 76px, 26px);
      }
    }
  }
</style>

