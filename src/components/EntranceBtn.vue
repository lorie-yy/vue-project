<template>
  <div>
    <div class="btn-list ignore"  :style="{visibility: btnGroupShow ? 'visible': 'hidden'}">
      <!-- v-show="btnGroupShow" -->
      <router-link to="/userCenter" ><img :src="imgCur.img_user_cur" alt=""></router-link>
      <router-link to="/taskCenter" :style="{visibility: btnGroupShow && haveBooksData ? 'visible': 'hidden'}">
       <!-- v-show="haveBooksData" -->
        <img :src="imgCur.img_task_cur" alt="">
        <!-- :style="{visibility:$route.path === '/course'?'visible':'hidden'}" -->
        <span
          class="badge"
          ref="badge"
          v-text="restTasks"
          :style="{visibility: btnGroupShow && restTasks && restTasks!==0 ? 'visible': 'hidden'}"
          >
        </span>
      </router-link>
      <router-link to="/course" v-show="$route.path!=='/course' && haveBooksData" ><img :src="imgList.img_map" alt=""></router-link>
    </div>
  </div>  
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { getUnFinishTask } from "@/api/getData";
  import { getLocalStorage,setSessionStorage,getSessionStorage } from 'assets/js/storage';
  export default {
    name: 'entranceBtn',
    components: {
    },
    data() {
      return {
        imgCur: {
          img_task_cur: null,
          img_user_cur: null
        },
        imgList: {
          img_task_normal: require('assets/image/public/btn_task_normal.png'),
          img_task_press: require('assets/image/public/btn_task_press.png'),
          img_map: require('assets/image/public/btn_map.png'),
          img_user_press: require('assets/image/public/btn_personal_press.png'),
          img_user_normal: require('assets/image/public/btn_personal_normal.png')
        },
        // btnGroupShow: false,
        btnMapShow: false,
        allowShowModule: ['userCenter', 'course', 'taskCenter', 'taskList', 'applist']
      }
    },
    mounted() {
      setTimeout(() => {
        this.setDotFont();
        // this.handleBtnShow(this.$route.name);
      },200)
    },
    methods: {
      ...mapMutations(['GET_UNFINISHED_TASK']),
      handleBtnShow(routeName) {
        const finalModule = this.allowShowModule.filter(item=>item === routeName)
        const btnGroupShow = finalModule.length!==0;   
        // console.log(routeName)
        if(routeName === 'course') {
          // getUnFinishTask(2).then(res => {
          //   if (parseInt(res) > 99)
          //     res = 99;
          //   setSessionStorage('restTasks', res);
          //   this.GET_UNFINISHED_TASK(res);
          // });
          this.btnMapShow = false
        }else {
          this.btnMapShow = true
        }
        if(/(taskCenter)|(taskList)/.test(routeName)) {
          this.imgCur.img_task_cur = this.imgList.img_task_press;
          this.imgCur.img_user_cur = this.imgList.img_user_normal;
        }else if(/userCenter/.test(routeName)) {
          this.imgCur.img_task_cur = this.imgList.img_task_normal;
          this.imgCur.img_user_cur = this.imgList.img_user_press;
        }else {
          this.imgCur.img_task_cur = this.imgList.img_task_normal;
          this.imgCur.img_user_cur = this.imgList.img_user_normal;
        }
        return btnGroupShow
      },
      setDotFont() {
        const badge = this.$refs.badge;
        const initialHeight = badge.clientHeight;
        const initialWidth = badge.clientHeight;
        const targetFont = window.innerHeight * 24 / 1536;
        const scale = targetFont / 12;
        if (targetFont < 12 && initialHeight !== 0) {
          badge.style.transform = 'scale(' + scale + ')';
          badge.style.transformOrigin = '100% 0%';
          badge.style.lineHeight = badge.style.height = `${ initialHeight/scale }px`;
          badge.style.width = `${initialWidth/scale}px`;
        }
      }
    },
    computed: {
      ...mapGetters([ 'unFinishedTask', 'haveBooks' ]),
      haveBooksData() {
        const getBooks = getLocalStorage('books');
        const booksToArr = getBooks && Object.values(getBooks);
        return this.haveBooks && this.haveBooks.length > 0 || booksToArr && booksToArr.length > 0;
      },
      btnGroupShow() {
        return this.handleBtnShow(this.$route.name)
      },
      restTasks() {
        return this.unFinishedTask || getSessionStorage('restTasks')
      }
    },
    watch: {
      // $route(newVal) {
      //   this.$nextTick(() => {
      //     this.setDotFont();
      //   })
      // }
    }
  }  
</script>
<style lang="less" scoped>
  @import '~assets/style/mixin';
  @imgUrl: "~assets/image/course/";
  .btn-list {
    z-index: 200;
    position: fixed;
    // width: 380px;
    width: 1.855rem;
    // top: 60px;
    // right: 70px;
    top: .293rem;
    right: .342rem;
    // font-size: 0;
    a {
      position: relative;
      float: right;
      font-size: 0;
      // display: inline-block;
      // margin-right: 40px;
      margin-right: .195rem;
      img {
        // .wh(100px, 100px);
        .wh(.488rem, .488rem);
      }
      &:first-of-type {
        margin-right: 0;
      }
    }
  } 
  .badge {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0;
    width: .166rem;
    height: .166rem;
    line-height: .166rem;
    border-radius: 100%;
    background-color: #e60012;
    color: #fff;
    font-size: .117rem;
    // font-size: 24px;
    // line-height: 34px;
  }

  @media screen and (max-width: 960px) {
    .btn-list.ignore {
      width: 93px;
      top: 15px;
      right: 17px;
      // font-size: 0;
      a {
        margin-right: 9px;
        img {
          // .wh(100px, 100px);
          .wh(25px, 25px);
        }
        &:first-of-type {
          margin-right: 0;
        }
      }
      .badge {
        font-size: 12px;
        width: 9px;
        height: 9px;
      }
    } 
  }
</style>
