<template>
  <div id="app">
    <!-- <div>学练测项目</div> -->
    <loading></loading>
    <entrance-btn></entrance-btn>
    <confrim-box></confrim-box>
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
// 这里要变
import loading from '@/components/loading.vue';
import EntranceBtn from 'components/EntranceBtn';
import ConfrimBox from 'components/confirmBox';
import { mapState,mapMutations } from "vuex";

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState(["loadShow", 'show'])
  },
  watch: {
    $route(newVal) {
      console.log(newVal);
    }
  },
  methods: {
    ...mapMutations(['SAVE_HEIGHT', 'TOGGLE_CONFIRM_BOX']),
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    },
    handleConfirm() {
      console.log('待商讨');
    },
    // 处理横屏
    handleLandscape () {
      
        this.TOGGLE_CONFIRM_BOX({ isShow: false });
        // console.log(window.innerHeight, '横屏')
        // this.handleAppHeight();
      
    },
    // 处理竖屏
    handlePortrait() {
      if(window.orientation === 0 || window.orientation === 180) {
        this.TOGGLE_CONFIRM_BOX({
          isShow: true,
          haveCancel: false,
          fullCover: true,
          btnType: 'done',
          content: '本应用不支持竖屏操作',
          fallback: null,
        })
      }
    },
    handleOrientationChange() {
      if(window.orientation === 90 || window.orientation === -90) {
        // console.log('横屏', window.innerWidth, window.innerHeight)
        this.handleLandscape();
        this.SAVE_HEIGHT(window.innerHeight);
      }else if(window.orientation === 0 || window.orientation === 180) {
        this.handlePortrait();
        this.SAVE_HEIGHT(window.innerWidth);
        // console.log('数屏', window.innerWidth, window.innerHeight)
      }
      window.addEventListener('orientationchange', () => {
        if(window.orientation === 90 || window.orientation === -90) {
          this.handleLandscape();
        }else if(window.orientation === 0 || window.orientation === 180) {
          this.handlePortrait();
        }
      })
    },
    handleAppHeight() {
      const windowHeight = window.innerWidth;   
      console.log(windowHeight) 
      this.SAVE_HEIGHT(windowHeight)
      // window.addEventListener('resize', () => {
      //   const windowHeight = window.innerHeight;    
      //   this.SAVE_HEIGHT(windowHeight)
      // })
    }
  },
  mounted() {
    // this.handleAppHeight();
    this.handleOrientationChange();
  },
  components: {
    loading, EntranceBtn, ConfrimBox
  }
}
</script>

<style>
#app {
  height: inherit;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
canvas {
  position: absolute;
  top: 0;
}
</style>
