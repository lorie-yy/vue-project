<template>
  <div class="userCenter">
    <!-- <entrance-btn></entrance-btn> -->
    <div class="btn-back" v-if="userCenterCom!=='userInfo'" @click="back"></div>
      <keep-alive :include="'userInfo'">
        <component 
        :is="userCenterCom"
        ref="userInfo" 
        >
        </component>
      </keep-alive>
  </div>  
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
// import EntranceBtn from 'components/EntranceBtn';
export default {
  name: 'userCenter',
  components: {
    changePhone: () => import('./changePhone'),
    userInfo: () => import('./userInfo'),
    changePassword: () => import('./changePassword'),
    // EntranceBtn: EntranceBtn
  },
  data() {
    return {
      imgList: {
        img_task: require('assets/image/public/btn_task_normal.png'),
        img_map: require('assets/image/public/btn_map.png'),
        img_user: require('assets/image/public/btn_personal_press.png')
      },
      userName: '你是大坏蛋',
      confrimShow: false
    }
  },
  mounted() {
    this.TOGGLE_USER_COMPONENT('userInfo')
  },
  methods: {
    ...mapMutations([
      'TOGGLE_USER_COMPONENT'
    ]),
    changePhone() {
      // console.log('受到了召唤')
      this.TOGGLE_USER_COMPONENT('changePhone')
    },
    changePassword() {
      this.TOGGLE_USER_COMPONENT('changePassword')
    },
    back() {
      this.TOGGLE_USER_COMPONENT('userInfo')
    }
    
  },
  computed: {
    ...mapGetters([ 'userCenterCom' ])
  },
  watch: {
    userCenterCom(val,oldVal) {
      if(oldVal && val === 'userInfo') {
        this.$nextTick(() => {
          this.$refs.userInfo.fetchUserData()
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~assets/style/mixin';
  @imgUrlCur: '~assets/image/userCenter';
  @imgUrlPub: '~assets/image/public';
  .userCenter {
    position: relative;
    height: inherit;  
    background: url('@{imgUrlCur}/img_personal_bg.png') no-repeat center/100% 100%;
    .flexC();
    .btn-list {
      position: fixed;
      width: 380px;
      height: 180px;
      top: 60px;
      right: 70px;
      font-size: 0;
      a {
        display: inline-block;
        margin-right: 40px;
        img {
          .wh(100px, 100px);
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    } 
  }
</style>

