<template>
  <div class="login-bg ignore">
    <div class="login-box ignore">
      <group class="login-group ignore">
        <x-input  
          ref="account" 
          @on-focus="handleFocus('account')"
          @on-blur="handleBlur('account')" 
          v-model.trim="loginInfo.account"
          placeholder="请输入账号">
          <img class="input-icon" slot="label" :src="imgCurrent.img_account"  alt="">
        </x-input>
        <x-input 
          type="password" 
          ref="password" 
          @on-focus="handleFocus('password')" 
          @on-blur="handleBlur('password')" 
          v-model.trim="loginInfo.password" 
          placeholder="请输入密码">
          <img class="input-icon" slot="label" :src="imgCurrent.img_password"  alt="">
        </x-input>
        <div class="forget-password" v-font="{fontSize: 36, anchor: '0% 0%'}">
          <router-link to="login/reset" >忘记密码？</router-link>
        </div>
      </group>
      <div class="btn-submit">
        <img @click="handleLogin" :src="imgCurrent.img_btn" alt="">
      </div>
      <!-- <div v-font="{fontSize: 36, anchor: '100% 0'}" > -->
        <span 
        class="tooltip" 
        v-font="{fontSize: 36, anchor: '100% 0'}"
        :style="{visibility:!validInfo.pass?'visible':'hidden'}">{{ validInfo.msg }}</span>
      <!-- </div> -->
      
    </div> 
    <div class="logo ignore"></div>
    <transition name="fade" mode="out-in">
      <router-view ></router-view>
    </transition>
  </div>
</template>
<script>
  // import { XInput,Group, } from 'vux';
  import { mapState, mapMutations } from 'vuex';
  import { login } from 'api/getData';
  import { removeLocalStorage,setLocalStorage } from 'assets/js/storage';
  import { setInputFont, setAppHeight } from 'assets/js/utils';
  export default { 
    name: 'login',
    components: {
      // XInput, Group, P
    },
    data() {
      return {
        loginInfo: {
          account: null,
          password: null
        },
        validInfo: {
          msg: '学生账号或密码错误',
          pass: true,
        },
        imgCurrent: {
          img_account:null,
          img_password: null,
          img_btn: null,
        },
        imgList: {
          img_account1: require('assets/image/public/icon_user_normal.png'),
          img_account2: require('assets/image/public/icon_user_current.png'),
          img_password1: require('assets/image/public/icon_password_normal.png'),
          img_password2: require('assets/image/public/icon_password_current.png'),
          img_btn1: require('assets/image/public/btn_login_disable.png'),
          img_btn2: require('assets/image/public/btn_login_normal.png')
        }
      }
    },
    mounted() {
      setInputFont('.login-group');
      this.height = window.innerHeight;
      this.imgCurrent.img_account = this.imgList.img_account1;
      this.imgCurrent.img_password = this.imgList.img_password1;
      this.imgCurrent.img_btn = this.imgList.img_btn1;
    },
    methods: {
      ...mapMutations(['SET_HEIGHT']),
      _validateForm(formData) {
        return new Promise((resolve) => {
          for(const k in formData) {
            if(!formData[k]) {
              resolve(false);
            }
          }
          resolve(true);
        });
      },
      handleFocus(name) {
        // console.log(window.innerHeight)
        // this.SAVE_HEIGHT(window.innerHeight)
        // setAppHeight();
        // this.HANDLE_KEYBOARD_UP();
        this.SET_HEIGHT()
        var dom = document.querySelector('.login-box');
        this.$refs[name].$el.classList.add('active');
        this.imgCurrent[`img_${name}`] = this.imgList[`img_${name}2`];
      },
      handleBlur(name) {
        this.$refs[name].$el.classList.remove('active');
        this.imgCurrent[`img_${name}`] = this.imgList[`img_${name}1`];
      },
      handleLogin() {
        this._validateForm(this.loginInfo).then((res) => {
          if(res) {
            login({userName: this.loginInfo.account, password: this.loginInfo.password})
              .then((res) => {
                console.log(res);
                const token = res.token;
                setLocalStorage('token', token);
                this.$router.push('/course');
              },(err) => {
                this.validInfo.pass = false
                setTimeout(() => {
                  this.validInfo.pass = true;
                },2000);
                this.validInfo.msg = err;
              })
          }
        })
      }
    },
    computed: {
      btnDisable() {
        return !(this.loginInfo.account && this.loginInfo.password)
      }
    },
    watch: {
      btnDisable(newVal, oldVal) {
        if(newVal) {
          this.imgCurrent.img_btn = this.imgList.img_btn1
        }else {
          this.imgCurrent.img_btn = this.imgList.img_btn2
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      next(() => {
        removeLocalStorage('books');
      })
    }
  }
</script> 
<style scoped lang="less">
  @import '~assets/style/mixin';
  @imgUrlCur: '~assets/image/login';
  @imgUrlPub: '~assets/image/public';
  .fade-enter-active, .fade-leave-active {
    transition: all .8s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .login-bg {
    position: relative;
    .flexJ();
    .wh(10rem,inherit);
    // height: inherit;
    background: url("@{imgUrlCur}/img_board.png") no-repeat bottom center/100% 5.527rem,
      url("@{imgUrlCur}/img_login_bg.png") no-repeat center/100% 100%;
    @media screen and (max-width: 960px) {
      &.ignore {
        background: url("@{imgUrlCur}/img_board.png") no-repeat bottom center/100% 280px,
          url("@{imgUrlCur}/img_login_bg.png") no-repeat center/100% 100%;
      }
    }
    .login-box {
      position: absolute;
      // bottom: 458px;
      bottom: 2.227rem;
      // transform: translateX(-8px);
      transform: translateX(-.039rem);
      .flexJ();
      // .wh(950px, 610px);
      .wh(4.639rem, 2.979rem);
      background-color: transparent;  
      .login-group {
        width: 3.32rem;
        // width: 680px;
        // padding-top: 84px;
        padding-top: .41rem;
        .forget-password {
          margin-top: .322rem;
          // margin-top:66px;
          text-align: left;
          >a {
            // .sc(36px, #4697db);
            .sc(.176rem, #4697db)
          }
        }
      }
      .btn-submit {
        .btn-submit();
      }
      .tooltip {
        position: absolute;
        box-sizing: border-box;
        top: .488rem;
        // top:100px;
        // right:-400px;
        right: -1.953rem;
        // transform: translateX(100%);
        // width: 500px;
        // height: 100px;
        // line-height: 100px;
        // padding-left: 56px;
        width: 2.441rem;
        height: .488rem;
        line-height: .488rem;
        padding-left: .273rem;
        .bis("@{imgUrlPub}/img_hint.png");
        // .sc(36px, #e60012,left);
        .sc(.176rem, #e60012,left);
      }
    }
    @media screen and (max-width: 960px){
      .login-box.ignore {
        bottom: 113px;
        transform: translateX(-0.039rem);
        .wh(4.639rem, 151px);
        .login-group {
          width: 3.32rem;
          padding-top: 21px;
          .forget-password {
            margin-top: .322rem;
            >a {
              .sc(.176rem, #4697db)
            }
          }
        }
        .btn-submit {
          .btn-submit(15px, 76px, 26px);
        }
        .tooltip {
          top:25px;
          right:-98px;
          .wh(122px,24px);
          // width: 122px;
          // height: 24px;
          line-height: 24px;
          padding-left: 14px;
          .sc(.176rem, #e60012,left);
        }
      }
    }
    
    .logo {
      position: absolute;
      bottom: 30px;
      .wh(452px, 32px);
      .bis("@{imgUrlCur}/img_logo.png");
    }
    @media screen and (max-width: 960px){
      .logo.ignore {
        bottom: 7px;
        .wh(110px, 8px);
      }  
    }
    
  }

   
</style>
