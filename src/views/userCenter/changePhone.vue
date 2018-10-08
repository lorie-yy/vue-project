<template>
  <transition name="slide-fade">
    <div v-if="mobile" class="phoneChange ignore">
      <group class="reset-group">
        <x-input 
          type="password" 
          ref="password"
          :max="18" 
          @on-focus="handleFocus('password')" 
          @on-blur="handleBlur('password')" 
          v-model.trim="formData.password" 
          placeholder="请输入密码（用于验证你的身份）">
          <img class="input-icon" slot="label" :src="imgCurrent.img_password"  alt="">
        </x-input>
        <x-input 
          type="tel" 
          ref="phone" 
          :max="11"
          @on-focus="handleFocus('phone')"
          @on-blur="handleBlur('phone')" 
          v-model.trim="formData.phone"
          placeholder="请输入新的手机号码">
          <img class="input-icon" slot="label" :src="imgCurrent.img_phone"  alt="">
        </x-input>
        <x-input 
          type="tel" 
          ref="verification"
          :max="6" 
          @on-focus="handleFocus('verification')" 
          @on-blur="handleBlur('verification')" 
          v-model.trim="formData.verification" 
          placeholder="请输入验证码"
          class="verification-area">
          <img class="input-icon" slot="label" :src="imgCurrent.img_verification"  alt="">
          <x-button 
          class="btn-verify" 
          slot="right" 
          :plain="true" 
          v-font="{fontSize: 38, anchor: '100% 0', isVCenter: true}"
          :text="verificationText" 
          type="primary" 
          @click.native="sendVer"
          :disabled="sendDisabled"></x-button>
        </x-input>
      </group>
      <div class="toolTipList">
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.password.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.password.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.phone.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.phone.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.verification.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.verification.msg }}</span>
      </div>
      <div class="submit-btn">
        <img @click="handleSubmit" :src="imgCurrent.imgSubmit" alt="">
      </div>
    </div>

    <div v-else  class="phoneBind ignore">
      <group class="reset-group">
        <x-input 
          type="password" 
          ref="password"
          :max="18" 
          @on-focus="handleFocus('password')" 
          @on-blur="handleBlur('password')" 
          v-model.trim="formData.password" 
          placeholder="请输入密码（用于验证你的身份）">
          <img class="input-icon" slot="label" :src="imgCurrent.img_password"  alt="">
        </x-input>
        <x-input 
          type="tel" 
          ref="phone" 
          :max="11"
          @on-focus="handleFocus('phone')"
          @on-blur="handleBlur('phone')" 
          v-model.trim="formData.phone"
          placeholder="请输入手机号码">
          <img class="input-icon" slot="label" :src="imgCurrent.img_phone"  alt="">
        </x-input>
        <x-input 
          type="tel" 
          ref="verification"
          :max="6" 
          @on-focus="handleFocus('verification')" 
          @on-blur="handleBlur('verification')" 
          v-model.trim="formData.verification" 
          placeholder="请输入验证码"
          class="verification-area">
          <img class="input-icon" slot="label" :src="imgCurrent.img_verification"  alt="">
          <x-button 
          class="btn-verify" 
          slot="right" 
          :plain="true" 
          v-font="{fontSize: 38, anchor: '100% 0', isVCenter: true}"
          :text="verificationText" 
          type="primary" 
          @click.native="sendVer"
          :disabled="sendDisabled"></x-button>
        </x-input>
      </group>
      <div class="toolTipList">
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.password.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.password.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.phone.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.phone.msg }}</span>
        <span 
        class="tooltip" 
        :style="{visibility:tooltipData.verification.show?'visible':'hidden'}"
        v-font="{fontSize: 36, anchor: '0 0', isVCenter: true}" >
        {{ tooltipData.verification.msg }}</span>
      </div>
      <div class="submit-btn">
        <img @click="handleSubmit" :src="imgCurrent.imgSubmit" alt="">
      </div>
    </div>  
  </transition>
</template>
<script>
// import { XInput, Group, , Toast } from 'vux';
import formConfig from 'assets/js/mixinForm';  
import { btnCountdown,setInputFont } from 'assets/js/utils';
import { changePhone, getVerifyCode } from 'api/getData';
import { mapMutations, mapGetters } from 'vuex';
const CHANGE_MOBILE_VERIFY_TYPE = 2;
export default {
  name: 'resetPhone',
  mixins: [formConfig],
  components: {
    // XInput, Group, XButton, Toast
  },
  data() {
    return {
      formData: {
        phone: null,
        verification: null,
        password: null
      },
      tooltipData: {
        phone: {
          show: false,
          msg: '请输入正确的手机号码',
          rule: /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[678]))+\d{8}$/,
          pass: false
        },
        verification: {
          show: false,
          msg: '验证码错误',
          pass: false
        },
        password: {
          show: false,
          msg: '密码错误',
          pass: false
        }
      },
      imgCurrent: {
        img_phone: null,
        img_password: null,
        img_verification: null,
        imgSubmit: null
      },
      imgList: {
        img_phone1: require('assets/image/public/icon_phone_normal.png'),
        img_phone2: require('assets/image/public/icon_phone_current.png'),
        img_verification1: require('assets/image/public/icon_captcha_normal.png'),
        img_verification2: require('assets/image/public/icon_captcha_current.png'),
        img_password1: require('assets/image/public/icon_password_normal.png'),
        img_password2: require('assets/image/public/icon_password_current.png'),
        imgSubmit1: require('assets/image/public/btn_done_disable.png'),
        imgSubmit2: require('assets/image/public/btn_done.png')
      },
      verificationText: '获取验证码',
      sendDisabled: true,
      allowChangeStatus: true // 控制统一提交表单时控制验证码的disable
    }
  },
  mounted() {
    console.log(this.mobile)
    setInputFont('.reset-group');
    this.changeBg();
  },
  methods: {
    ...mapMutations([
     'TOGGLE_USER_COMPONENT'
    ]),
    _validate(name, tooltipData, formData) {
      setTimeout(() => {
        let tooltip = tooltipData[name],
          value = formData[name];
        if(!value) {
          if(name === 'phone') {
            this.sendDisabled = true;
          }
          return;
        }
        if(tooltip.rule) {
          if(!tooltip.rule.test(value)) {
            tooltip.show = true;
            tooltip.pass = false;
            setTimeout(()=>{tooltip.show = false;},2000)
          }else {
            if(name === 'phone' && this.allowChangeStatus) {
              this.sendDisabled = false;
            }
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
          changePhone({
            userId: "",
            password: this.formData.password,
            mobile: this.formData.phone,
            code: this.formData.verification
          }).then((res)=> {
            if(res) {
              this.$vux.toast.text('手机号更改成功');
              this.TOGGLE_USER_COMPONENT('userInfo');
            }
          }, (err) => {
            if(/密码/.test(err)) {
              this.tooltipData.password.show = true;
              this.tooltipData.password.msg = err;
            }else if(/验证码/.test(err)) {
              this.tooltipData.verification.show = true;
              this.tooltipData.verification.msg = err;
            }
          })
        }
      })
    },
    sendVer() {
      if(!this.tooltipData.phone.rule.test(this.formData.phone)) {
        this.tooltipData.phone.show = true;
        return;
      }
      getVerifyCode({ mobile: this.formData.phone,code: '', type: CHANGE_MOBILE_VERIFY_TYPE })
        .then((res) => {
          if(res) {
            btnCountdown(this, {
              btnDisable: 'sendDisabled',
              btnText: 'verificationText',
              allowChangeStatus: 'allowChangeStatus'
            });
          }
          console.log(res);
        },err => {
          if(/手机/.test(err)) {
            this.tooltipData.phone.show = true;
            this.tooltipData.phone.msg = err;
          }else if(/频繁/.test(err)) {
            this.tooltipData.verification.show = true;
          }
        })
    },
    changeBg() {
      // console.log(document.querySelector('.phoneChange'))
      // const bgDom = document.querySelector('.phoneChange');
      // bgDom.style.backgroundImage = "url(assets/image/userCenter/img_binding_phone_number.png)"
    }
  },
  computed: {
    ...mapGetters(['mobile']),
    passwordShow(){ return this.tooltipData.password.show },
    verificationShow(){ return this.tooltipData.verification.show },
    phoneShow(){ return this.tooltipData.phone.show }
  },
  watch: {
    passwordShow(val) {
      if(val) {
        setTimeout(() => { this.tooltipData.password.show = false },2000);
      }
    },
    verificationShow(val) {
      if(val) {
        setTimeout(() => { this.tooltipData.verification.show  = false },2000);
      }
    },
    phoneShow(val) {
      if(val) {
        setTimeout(() => { this.tooltipData.phone.show  = false },2000);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~assets/style/mixin';
  @imgUrl: '~assets/image/userCenter';
  .phoneChange, .phoneBind {
    position: absolute;
    // top:246px;
    top: 1.201rem;
    .flexJ();
    // .wh(1203px, 994px);
    .wh(5.874rem, 4.854rem);
    background:url('@{imgUrl}/img_change_phone_number.png') no-repeat center/100%;
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
      padding-top: 1.514rem;
      .verification-area {
        // width: 480px;
        width: 2.344rem;
        position: relative;
      }
      .btn-verify {
        position: absolute;
        // top: -20px;
        // right: -310px;
        // padding: 0 42px;
        // .wh(280px, 90px);
        // .sc(38px, #4697db);
        // border: 1px solid #ccc;
        // border-radius: 10px;
        // border-color: #4697db;

        position: absolute;
        top: -0.098rem;
        right: -1.514rem;
        padding: 0 .205rem;
        .wh(1.367rem, .439rem);
        .sc(.186rem, #4697db);
        border: 1px solid #ccc;
        border-radius: .049rem;
        border-color: #4697db;
        &.weui-btn_plain-disabled {
          padding: 0 .098rem;
          border:none;
          background: #dcdcdc;
          color: #666;
        }
      }
    }
    .toolTipList {
      .toolTipList(1.348rem, -1.631rem);
    }
    .submit-btn {
      .btn-submit(.474rem);
    }
  }
  .phoneBind {
    background:url('@{imgUrl}/img_binding_phone_number.png') no-repeat center/100%;
  }
  @media screen and (max-width: 960px){
    .phoneChange.ignore, .phoneBind.ignore {
      top: 60px;
      .wh(294px, 243px);
      .reset-group {
        width: 195px;
        padding-top: 76px;
        .verification-area {
          width: 117px;
          position: relative;
        }
        .btn-verify {
          position: absolute;
          top: -5px;
          right: -76px;
          padding: 0 10px;
          .wh(68px, 22px);
          .sc(.186rem, #4697db);
          border: 1px solid #ccc;
          border-radius: 2px;
          border-color: #4697db;
          &.weui-btn_plain-disabled {
            padding: 0 5px;
            border:none;
            background: #dcdcdc;
            color: #666;
          }
        }
      }
      .toolTipList {
        // .toolTipList(276px, -334px);
        .toolTipListMedia(67px, -82px);
      }
      .submit-btn {
        .btn-submit(24px, 76px, 26px);
      }
    }
  }
</style>

