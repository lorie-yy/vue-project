<template>
  <div class="reset">
    <div class="btn-back" @click="back"></div>
    <div class="reset-box ignore">
      <group class="reset-group">
        <x-input 
          ref="account"
          :max="11"
          @on-focus="handleFocus('account')"
          @on-blur="handleBlur('account')" 
          v-model.trim="formData.account"
          placeholder="请输入学生账号">
          <img class="input-icon" slot="label" :src="imgCurrent.img_account"  alt="">
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
          class="btn-verify ignore" 
          slot="right"
          :plain="true" 
          v-font="{fontSize: 38, anchor: '100% 0',isVCenter: true}"
          :text="verificationText" 
          type="primary" 
          @click.native="sendVer"
          :disabled="sendDisabled"></x-button>
        </x-input>
        <x-input 
          type="password" 
          ref="passwordNew"
          :max="18" 
          @on-focus="handleFocus('passwordNew')" 
          @on-blur="handleBlur('passwordNew')" 
          v-model.trim="formData.passwordNew" 
          placeholder="请输入新密码">
          <img class="input-icon" slot="label" :src="imgCurrent.img_passwordNew"  alt="">
        </x-input>
        <x-input 
          type="password" 
          ref="passwordAgain"
          :max="18" 
          @on-focus="handleFocus('passwordAgain')" 
          @on-blur="handleBlur('passwordAgain')" 
          v-model.trim="formData.passwordAgain" 
          placeholder="请再次输入密码">
          <img class="input-icon" slot="label" :src="imgCurrent.img_passwordAgain"  alt="">
        </x-input>
      </group>
      <div class="toolTipList ignore" >
        <span 
          v-font="{fontSize: 36, anchor: '0 0'}" 
          class="tooltip" 
          :style="{visibility:tooltipData.account.show?'visible':'hidden'}" >
          {{ tooltipData.account.msg }}
        </span>
        <span 
          v-font="{fontSize: 36, anchor: '0 0'}" 
          class="tooltip" 
          :style="{visibility:tooltipData.verification.show?'visible':'hidden'}" >
          {{ tooltipData.verification.msg }}</span>
        <span 
          v-font="{fontSize: 36, anchor: '0 0'}" 
          class="tooltip" 
          :style="{visibility:tooltipData.passwordNew.show?'visible':'hidden'}" >
          {{ tooltipData.passwordNew.msg }}</span>
        <span 
          v-font="{fontSize: 36, anchor: '0 0'}" 
          class="tooltip" 
          :style="{visibility:tooltipData.passwordAgain.show?'visible':'hidden'}" >
          {{ tooltipData.passwordAgain.msg }}</span>
      </div>
      <div class="submit-btn ignore">
        <img @click="handleSubmit" :src="imgCurrent.imgSubmit" alt="">
      </div>
    </div>
    <div class="alert-box ignore" v-show="alertBoxShow">
      <div class="alert-wrapper"></div>
      <transition name="slide">
        <div class="alert-content" v-show="builtInBoxShow">
          <span @click="closeAlertBox" class="btn-close"></span>
          <div class="alert-msg">
            <span v-font="{fontSize: 50, anchor: '50% 50%', isVCenter: true}">此账号未绑定手机</span>
            <span v-font="{fontSize: 50, anchor: '50% 50%', isVCenter: true}">请找本班级老师协助找回密码</span>
            </div>
          <span @click="closeAlertBox" class="btn-confirm"></span>
        </div>
      </transition>
      
    </div>
  </div>  
</template>
<script>

import formConfig from 'assets/js/mixinForm';
import { btnCountdown } from 'assets/js/utils';
import { getVerifyCode, resetPassword } from 'api/getData';
import { setInputFont } from 'assets/js/utils';
const RESET_MOBILE_VERIFY_TYPE = 1;
export default {
  name: 'reset',
  mixins: [formConfig],
  components: {
    
  },
  data() {
    return {
      formData: {
        account: null,
        verification: null,
        passwordNew: null,
        passwordAgain: null
      },
      tooltipData: {
        account: {
          show: false,
          msg: '',
          // rule: /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[678]))+\d{8}$/,
          pass: false
        },
        verification: {
          show: false,
          msg: '验证码错误'
        },
        passwordNew: {
          show: false,
          // msg: '密码格式不正确',
          rule: (pas, pasAgain) => {
            // if(!(/^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i).test(pas)) {
            //   return {
            //     testRes: false,
            //     msg: '密码格式不正确',
            //   }
            // }
            if(pasAgain && pas !== pasAgain) {
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
          // msg: '两次填写的密码不一致',
          rule: (pas, pasAgain) => {
            return {
              testRes: pas === pasAgain,
              msg: '两次填写的密码不一致'
            }
          },
          pass: false
        }
      },
      imgCurrent:{
        img_account: null,
        img_verification: null,
        img_passwordNew: null,
        img_passwordAgain: null,
        imgSubmit: null
      },
      imgList: {
        img_account1: require('assets/image/public/icon_user_normal.png'),
        img_account2: require('assets/image/public/icon_user_current.png'),
        img_verification1: require('assets/image/public/icon_captcha_normal.png'),
        img_verification2: require('assets/image/public/icon_captcha_current.png'),
        img_passwordNew1: require('assets/image/public/icon_password_normal.png'),
        img_passwordNew2: require('assets/image/public/icon_password_current.png'),
        img_passwordAgain1: require('assets/image/public/icon_confirm_normal.png'),
        img_passwordAgain2: require('assets/image/public/icon_confirm_current.png'),
        imgSubmit1: require('assets/image/public/btn_submit_disable.png'),
        imgSubmit2: require('assets/image/public/btn_submit_normal.png')
      },
      verificationText: '获取验证码',
      sendDisabled: true,
      allowChangeStatus: true, // 控制统一提交表单时控制验证码的disable
      alertBoxShow: false,
      builtInBoxShow: false
    }
  },
  mounted() {
    setInputFont('.reset-group')
  },
  methods: {
    _validate(name,tooltipData, formData) {
      setTimeout(() => {
        let tooltip = tooltipData[name],
          value = formData[name];
        if(!value) {
          if(name === 'account') {
            this.sendDisabled = true;
          }
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
            setTimeout(()=>{tooltip.show = false;},2000)
          }else {
            tooltip.pass = true;
          }
        }else {
          if(name === 'account'  && this.allowChangeStatus) {
            // console.log(1112)
            this.sendDisabled = false;
          }
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
          // console.log('你到了')
          resetPassword({
            mobile:this.formData.account,
            code: this.formData.verification,
            newPassword: this.formData.passwordNew
          }).then((res) => {
            this.$vux.toast.text('密码重置成功');
            this.$router.push('/login');
            console.log(res)
          },(err) => {
            console.log(err)
            if(/用户/.test(err)) {
              this.tooltipData.account.show = true;
              this.tooltipData.account.msg = err;
            }else if(/验证码/.test(err)){
              this.tooltipData.verification.show = true
              this.tooltipData.verification.msg = err;
            }
          })
        }
      })
    },
    sendVer() {
      if(!this.tooltipData.account) {
        return;
      }
      getVerifyCode({ mobile: this.formData.account,code: '', type: RESET_MOBILE_VERIFY_TYPE })
        .then(res => {
          btnCountdown(this, {
            btnDisable: 'sendDisabled',
            btnText: 'verificationText',
            allowChangeStatus: 'allowChangeStatus'
          });
        },err => {
          console.log(err)
          if(/手机号/.test(err)) {
            // console
            this.alertBoxShow = true;
          }
        })
    },
    closeAlertBox() {
      this.alertBoxShow = false;
    },
    back() {
      this.$router.go(-1);
    }
  },
  computed: {
    account() { return this.tooltipData.account.show },
    verification() { return this.tooltipData.verification.show },
    passwordNew() { return this.tooltipData.passwordNew.show },
    passwordAgain() { return this.tooltipData.passwordAgain.show }
  },
  watch: {
    alertBoxShow(newVal) {
      if(newVal) {
        setTimeout(() => {
          this.builtInBoxShow = true;
        },100)
      }else {
        this.builtInBoxShow = false;
      }
    },
    account(val) {
      if(val) setTimeout(() => { this.tooltipData.account.show = false },2000)
    },
    verification(val) {
      if(val) setTimeout(() => { this.tooltipData.verification.show = false },2000)
    },
    passwordNew(val) {
      if(val) setTimeout(() => { this.tooltipData.passwordNew.show = false },2000)
    },
    passwordAgain(val) {
      if(val) setTimeout(() => { this.tooltipData.passwordAgain.show = false },2000)
    },
  }
}
</script>
<style lang="less" scoped>
  @import '~assets/style/mixin';
  @imgUrlCur: '~assets/image/login';
  @imgUrlPub: '~assets/image/public';
  .reset {
    .allCover();
    .wh(10rem, inherit);
    .bis("@{imgUrlCur}/img_forgetPassword_bg.png");
    .reset-box {
      .lr();
      // .wh(1203px, 994px);
      .wh(5.874rem, 4.854rem);
      .flexJ();
      // top: 246px;
      top: 1.201rem;
      .bis("@{imgUrlCur}/img_reset.png");
      .reset-group {
        // width: 803px;
        // padding-top: 245px;
        width: 3.921rem;
        padding-top: 1.196rem;
        .verification-area {
          width: 2.344rem;
          // width: 480px;
          position: relative;
        }
        .btn-verify {
          position: absolute;
          // top: -20px;
          // right: -310px;
          // .wh(280px, 90px);
          // .sc(38px, #4697db);
          // padding: 0 42px;
          // border-radius: 10px;
          top: -0.098rem;
          right: -1.514rem;
          .wh(1.367rem, .439rem);
          .sc(.186rem, #4697db);
          padding: 0 .205rem;
          border-radius: .049rem;
          border-color: #4697db;
          &.weui-btn_plain-disabled {
            // padding: 0 20px;
            padding: 0 .098rem;
            border:none;
            background: #dcdcdc;
            color: #666;
          }
        }
      }
      .toolTipList {
        // .toolTipList(212px, -334px);
        .toolTipList(1.035rem, -1.631rem);
      }
      .submit-btn {
        // .btn-submit(97px);
        .btn-submit(.474rem);
      }
    }
    .alert-box {
      .allCover();
      .flexC();
      .alert-wrapper {
        .allCover();
        background: rgba(0, 0, 0, .65);
      }
      .alert-content {
        .flexJ();
        position: relative;
        box-sizing: border-box;
        // padding-top: 260px;
        padding-top: 1.27rem;
        // .wh(1057px,742px);
        .wh(5.161rem,3.623rem);
        .bis("@{imgUrlCur}/img_forget.png");
        .btn-close {
          position: absolute;
          // top:94px;
          // right: 104px;
          // .wh(70px, 70px);
          top: .459rem;
          right: .508rem;
          .wh(.342rem, .342rem);
          .bis("@{imgUrlCur}/icon_close.png");
        }
        .alert-msg {
          // width: 700px;
          width: 3.418rem;
          line-height: 1.5;  
          .sc(50px, '#000');
          // letter-spacing: 2px;
          letter-spacing: .01rem;
          > span {
            display: block;
          }
        }
        .btn-confirm {
          .lr();
          // top: 510px;
          // .wh(310px, 107px);
          top: 2.49rem;
          .wh(1.514rem, .522rem);
          .bis("@{imgUrlPub}/btn_done.png");
        }
        &.slide-enter-active, &.slide-leave-active {
          transition: all .6s;
        }
        &.slide-enter, &.slide-leave-to {
          transform: translateY(-200%);
        }
      }
    }
  }


  @media screen and (max-width: 960px){
    .reset {
      .reset-box.ignore {
        .wh(294px, 243px);
        top: 60px;
        .reset-group {
          width: 196px;
          padding-top: 60px;
          .verification-area {
            width: 117px;
          }
          .btn-verify {
            top: -5px;
            right: -75px;
            .wh(68px, 22px);
            padding: 0 10px;
            border-radius: .049rem;
            .sc(.186rem, #4697db);
            &.weui-btn_plain-disabled {
              padding: 0 5px;
              color: #666;
            }
          }
        }
        .submit-btn {
          .btn-submit(24px, 76px, 26px);
        }
      }
      .alert-box.ignore {
        .alert-content {
          // padding-top: 260px;
          padding-top: 63px;
          // .wh(1057px,742px);
          .wh(247px, 181px);
          .btn-close {
            position: absolute;
            // top:94px;
            top: 23px;
            // right: 104px;
            right: 25px;
            .wh(17px, 17px);
          }
          .alert-msg {
            // width: 700px;
            width: 3.418rem;
            // .sc(.244rem, '#000');
          }
          .btn-confirm {
            // top: 510px;
            top: 125px;
            // .wh(310px, 107px);
            .wh(76px, 26px);
          }
        }
      }
      .toolTipList.ignore {
        // .toolTipList(212px, -334px);
        .toolTipListMedia(52px, -82px)
      }
    } 
  }
</style>
