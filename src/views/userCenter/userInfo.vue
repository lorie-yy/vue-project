<template>
  <transition name="slide-fade" >
    <div class="user-box">
      <img class="img-dragon" :src="imgList.img_dragon"  alt="">
      <div class="user-info">
        <div class="user-avatar">
          <img :src="userInfo.picture ?
          (userInfo.picture.includes('data:image') ? userInfo.picture: `http://api.4006688991.com/image/student/${userInfo.picture}`) :
          imgList.img_avatar"
          alt="">
        </div>
        <div class="user-name" v-font="{fontSize: 52, anchor: '0% 0%'}">
          <span class="name-eng"  >{{ userInfo.englishName }}</span>&nbsp;
          <span class="name-ch">{{ userInfo.fullName }}</span>
        </div>
        <div class="user-detail">
          <div class="user-phone"  v-font="{fontSize: 42, anchor: '0% 0%'}">
            <span class="title">手机号码：</span>
            <span  class="content">{{ userInfo.mobile }}</span>
          </div>
          <div class="user-class-info" :style="{ marignTop: userInfo.mobile?'80px':'152px'}" v-font="{fontSize: 42, anchor: '0% 0%'}">
              <span class="title">班级信息：</span>
              <div class="content-list">
                  <ul>
                    <li v-for="item in classTeacherList" :key="item.id">
                      <span class="class-type">{{ item.className }}</span>
                      <span class="class-teacher">{{ item.teacherFullName }}</span>
                    </li>
                  </ul>
              </div>
          </div>
        </div>
        <div class="user-setting" v-font="{fontSize: 38, anchor: '50% 0%', transformOrg: 'translateX(-50%)'}">
          <span class="btn" @click="toResetPhone">{{ userInfo.mobile? '更换手机号码': '绑定手机号码'}}</span>
          <span class="line"></span>
          <span class="btn" @click="toResetPassword">修改密码</span>
          <span class="line"></span>
          <span class="btn" @click="exit">退出</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapMutations } from 'vuex';
import { removeLocalStorage } from 'assets/js/storage';
import { getUserInfo } from 'api/getData';
export default {
  name: 'userInfo',
  components: {
    // ConfrimBox
  },
  data() {
    return {
      imgList: {
        img_dragon: require('assets/image/userCenter/img_dragon.png'),
        img_avatar: require('assets/image/userCenter/avatar_default.png')
      },
      classTeacherList: [],
      userInfo: {
        englishName: null,
        fullName: null,
        mobile: null,
        picture: null
      },
      userName: '',
      confrimBoxShow: false
    }
  },
  mounted() {
    this.fetchUserData();
    // console.log('渲染一次')
  },
  
  methods: {  
    ...mapMutations([
      'TOGGLE_USER_COMPONENT','SAVE_USER_MOBILE','TOGGLE_CONFIRM_BOX','SET_BOOK_SEQUENCE','SET_UNIT_SEQUENCE'
    ]),
    handleConfirm() {
      removeLocalStorage('token');
      this.SET_BOOK_SEQUENCE(0);
      this.SET_UNIT_SEQUENCE(0);
      this.$router.push({ path: '/login' })
    },
    fetchUserData() {
      getUserInfo().then((res) => {
        this.SAVE_USER_MOBILE(res.userInfo.mobile)
        Object.assign(this.userInfo, res.userInfo);
        this.classTeacherList = [...res.classTeacherList];
        // console.log(res)
      })
    },
    toResetPhone() {
      this.TOGGLE_USER_COMPONENT('changePhone')
    },
    toResetPassword() {
      this.TOGGLE_USER_COMPONENT('changePassword')
    },
    exit() {
      this.TOGGLE_CONFIRM_BOX({
        isShow: true,
        haveCancel: true,
        fullCover: false,
        btnType: 'ok',
        content: '是否确认退出？',
        fallback: this.handleConfirm
      })
    }
  }
}
</script>
<style lang="less" scoped>  
    @import '~assets/style/mixin';
    @imgUrl: '~assets/image/userCenter';
    .user-box {
      .wh(1413px, 1203px);
      position: absolute;
      .bis('@{imgUrl}/img_personal.png');
      .img-dragon {
        position: absolute;
        bottom: -7px;
        left: -86px;
        width: 402px;
        height: 188px;
      }
      .user-info {
        height: inherit;
        overflow: hidden;
        .user-avatar {
          box-sizing: border-box;
          margin: 192px 0 0 580px;
          .wh(252px,252px);
          border-radius: 50%;
          border: 6px solid #fff;
          overflow: hidden;
          // background-color: red;
          >img {
            .wh(inherit,inherit);
            border-radius:50%;
          }
        }
        .user-name {
          margin-top:30px;
          .sc(52px, #000);
        }
        .user-detail {
          margin-top: 92px;
          padding-left: 236px;
          .sc(42px, #000, left);
          // line-height: 42px;
          .user-phone,  .user-class-info {
            >.title {
              display: inline-block;
              color: #b4b4b4;
              vertical-align: text-top;
            }
            >.content {
              vertical-align: text-top;
            }
          }
          .user-class-info {
            margin-top: 80px;
            .content-list {
              display: inline-block;
              vertical-align: text-top;
              li {
                margin-bottom: 40px;
                .class-type {
                  margin-right: 48px;
                }
                &:last-of-type {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
        .user-setting {
          // position: absolute;
          .lr();
          // .flexJ();
          bottom: 132px;
          font-size: 0;
          height: 56px;
          line-height: 56px;
          .btn {
            vertical-align: middle;
            .sc(38px, #4697db);
            margin-right: 48px;
            &:last-of-type {
              margin-right: 0; 
            }
          }
          .line {
            display: inline-block;
            .wh(2px, 56px);
            margin-right: 48px;
            vertical-align: middle;
            background: rgba(70, 151, 219, .5);
          }
        }
      }
      &.slide-fade-enter-active, &.slide-fade-leave-active{
        transition: all 1s ease;
      }
      &.slide-fade-leave-to, &.slide-fade-enter{
        transform: translateY(-200%);
        opacity: 0;
      }
    }
</style>

