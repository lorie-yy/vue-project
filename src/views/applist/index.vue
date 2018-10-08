<template>
  <div class="container">
	   <div class="topBar">
      <div class="leftIcon icon"><img :src=backIcon alt="返回" @click="backPrevPage"></div>
     </div>
      <div class="applicationList">
        <div class="topTitle" v-if='switchData.length>1'>
          <transition name="switchBtnAnimation" mode="out-in" v-on:before-leave="switchBtnBL">
            <div class='switchBtn' @click = switchPracticeType v-bind:key="practiceType" v-font="{fontSize:46,anchor:'right center'}">
              {{switchData|nextSwitchData(practiceType).modularName}}
            </div>
          </transition>
        </div>
        <transition name="zoomFade">
          <div class="listContainer" v-bind:key="practiceType">
            <div class="listTitle" v-font="{fontSize:46,anchor:'left 50%'}"><p>{{titleA}} - {{titleB}} -  {{switchData[practiceType].modularName|strRmQuotation}}</p></div>
            <div class="listState">
              <div class="switchState">
                <img :src=switchIcon alt="已完成/未完成" @click="switchState">
              </div>
              <progressBar :totalCount="switchData[practiceType].totalCount" 
              :count="switchData[practiceType].count"></progressBar>
            </div>
            <ul class="listTab" >
              <li v-for="(link,index) in switchData[practiceType].segements" 
              :key=index @click="switchList(index)" 
              :class="{active:index=== switchData[practiceType].activeIndex}" v-font="{fontSize:40,anchor:'0% 100%'}">
                <div class="leftBg"></div>
                <div class="mainContent">{{link.title}}</div>
                <div class="rightBg"></div>
              </li>
            </ul>
            <ul class="mainList">
              <li v-for="(item,idx) in switchData[practiceType].applist" :key=idx @click="studyLesson(item)" :class="[{'hasDone':hasDoneApp.has(Number(item._id))},{'isNew':item.isNewUpdate}]" v-if="!item.isHide">
                <div class="imgWrap">        
                  <img :src="options.baseUrl+options.pathImage+item.imageName" alt="">
                </div>
                <p v-font="{fontSize:36,anchor:'left center'}">{{item.subTitle}}</p>
              </li>
            </ul>
        </div>
        </transition>
      </div>
      <loading />
  </div>
</template>
<script>
import backIcon from '../../assets/image/public/btn_back.png';
import mapIcon from '../../assets/image/public/btn_map.png';
import taskIconP from '../../assets/image/public/btn_task_press.png';
import taskIconN from '../../assets/image/public/btn_task_normal.png';
import personalIcon from '../../assets/image/public/btn_personal_normal.png';
import switchState1 from '../../assets/image/applist/btn_without.png';
import switchState0 from '../../assets/image/applist/btn_all.png';
import progressBar from '@/components/progressBar';
import containerBg1 from '@/assets/image/applist/img_HW.png';
import containerBg0 from '@/assets/image/applist/img_ACT.png';
import {
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
  removeSessionStorage,
} from '@/assets/js/storage.js';
import {groupBy, strRmQuotation, nextSwitchData} from '@/assets/js/utils.js';
import Options from '../../../config/options.js';
import loading from '@/components/loading';
import {mapActions} from 'vuex';
import {defaultCoreCipherList} from 'constants';
export default {
  name: 'applist',
  components: {
    progressBar,
    loading,
  },
  data() {
    return {
      backIcon: backIcon,
      mapIcon: mapIcon,
      taskIcon: taskIconP,
      personalIcon: personalIcon,
      switchIcon: switchState0,
      titleA: '',
      titleB: '',
      practiceType: 0,
      options: Options.Options,
      switchData: [{}, {}],
      allList: true, //是否展示全部列表
      containerBg: containerBg0,
      showModal: false,
      activeSegements: [],
      homeworkSegements: [],
      unitBArr: [],
      bookOId: '',
      hasDoneApp: new Set(),
      backUrl: '',
      historyPoint:{}//存取操作点记录
    };
  },
  created() {
    this.hasDoneApp = new Set(getSessionStorage('hasDoneApp') || []); //获取localStorage中已完成的app
    let modularIndex = getSessionStorage('modularIndex')//获取之前
    let historyPoint = getSessionStorage('historyPoint');
    this.practiceType = modularIndex||0; //获取模块index
    this.toggleLoadShowFullScreen(true);
    this.loadImg(
      [containerBg1, containerBg0, switchState0, switchState1],
      () => {
        this.toggleLoadShowFullScreen(false);
      }
    );
    let query = this.$route.query;
    setSessionStorage('applistQuery', query);
    this.titleB = query.title;
    this.titleA = query.pTitle;
    this.unitBArr = [].concat(query.oid).join(',');
    this.dailyTaskId = query.dailyTaskId;
    let unitBIds = [].concat(query._id).map(item => +item);
    //init data
    let bookId = query.bookId,
      allBookData = getLocalStorage('books'),
      currBookData = allBookData[bookId];
    if (!currBookData) return;
    let booksAndUnits = currBookData['booksAndUnits'],
      segments = currBookData['modulesAndSegments'];

    this.bookOId = booksAndUnits[0].bookOid;
    this.bookId = bookId;
    let allSegements = [];
    let keys = Object.keys(segments).map(item => +item);
    keys.forEach(key => {
      if (unitBIds.indexOf(key) >= 0) {
        allSegements = allSegements.concat(segments[key]);
      }
    });
    let allSegementsByGroup = groupBy(allSegements, 'modularName');
    var that = this;
    let switchData = [];
    Object.keys(allSegementsByGroup).forEach((key, index) => {
      if(strRmQuotation(key)=='课后学习'&&modularIndex===""){//首次进入显示课后学习
        this.practiceType = index
      }
      let segements = allSegementsByGroup[key];
      let allApplications = [];
      segements.map(sege => {
        allApplications = allApplications.concat(sege.children || []);
      });
      let o = {
        segements: segements,
        activeIndex: 0,
        modularName: strRmQuotation(key),
        totalCount: allApplications.length,
        count: allApplications.filter(item => {
          if (item.isComplete) {
            this.hasDoneApp.add(Number(item._id));
            setSessionStorage('hasDoneApp', [...this.hasDoneApp]);
            return true;
          } else {
            if (this.hasDoneApp.has(Number(item._id))) {
              return true;
            }
          }
        }).length,
      };
      Object.defineProperty(o, 'applist', {
        get() {
          return that.allList
            ? o.segements[o.activeIndex].children
            : o.segements[o.activeIndex].children.filter(item => {
                return !that.hasDoneApp.has(item._id);
              });
        },
      });
      switchData.push(o);
    });
    switchData.length
      ? (this.switchData = switchData)
      : (this.switchData = [{}, {}]);
    switchData[this.practiceType].activeIndex = historyPoint[this.practiceType]||0;
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let routes = ['/course', '/taskCenter'];
      if (routes.indexOf(from.path) >= 0) {
        let backUrl = {
          path:from.path,
          query:from.query,
          params:from.params
        }
        setSessionStorage('backUrl', backUrl);
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    let toSet = new Set(['/interactiveStudy']);
    if (!toSet.has(to.path)) {
      removeSessionStorage('modularIndex');
      removeSessionStorage('historyPoint');
      removeSessionStorage('hasDoneApp')
    }
    next();
  },
  filters: {
    strRmQuotation,
    nextSwitchData,
  },
  methods: {
    ...mapActions(['toggleLoadShowFullScreen']),
    loadImg(imgUrl, cb) {
      //预加载图片
      let count = 0;
      imgUrl.forEach(url => {
        let img = new Image();
        img.src = url;
        img.onload = () => {
          count++;
          if (count === imgUrl.length) {
            typeof cb === 'function' && cb();
          }
        };
      });
    },
    switchList(index) {
      this.switchData[this.practiceType]['activeIndex'] = index;
      this.historyPoint[this.practiceType] = index
      setSessionStorage('historyPoint', this.historyPoint);
    },
    switchState() {
      this.allList = !this.allList;
      this.switchIcon = this.allList ? switchState0 : switchState1;
    },
    switchPracticeType() {
      this.practiceType++;
      if (this.practiceType > this.switchData.length - 1) {
        this.practiceType = 0;
      }
      this.historyPoint[this.practiceType] = this.switchData[this.practiceType].activeIndex
      setSessionStorage('historyPoint', this.historyPoint);
      setSessionStorage('modularIndex',this.practiceType)
    },
    backPrevPage() {
      let backUrl = getSessionStorage('backUrl') || {path: '/course'};
      this.$router.push(backUrl);
    },
    studyLesson(item) {
      let currentData = this.switchData[this.practiceType],
        currentLink = currentData.segements[currentData.activeIndex];
      let appIds = currentLink.children.map(i => {
        return {
          applicationId: i._id,
          applicationName: i.title,
          modularName: i.modularName,
          applicationOId: i.oid,
        };
      }); //当前环节下的所有应用
      setLocalStorage('appIds', appIds);
      this.$router.push({
        name: 'interactiveStudy',
        path: '/interactiveStudy',
        query: {
          type: 0,
          unitIds: this.unitBArr, //合并后单元
          unitATitle: this.titleA, //单元A titel
          unitBTitle: this.titleB, //单元B title
          ApplicationId: item._id,
          ApplicationName: item.title,
          applicationOId: item.oid,
          linkOId: currentLink.oid,
          linkName: currentLink.title,
          bookOId: this.bookOId,
          bookId: this.bookId,
          modularName: currentData.modularName,
          dailyTaskId: this.dailyTaskId, //任务id
        },
      });
    },
    switchBtnBL(el) {
      el.style.zIndex = 900;
    },
  },
};
</script>

<style lang="less" scoped>
@imgBaseUrl: '../../assets/image/applist';
html,
body {
  height: 100%;
}
.imgResponsive() {
  img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    height: auto;
  }
}
//子元素浮动
.childFloat(@direction) {
  > * {
    float: @direction;
  }
}
//外发光
.outShine {
  box-shadow: 0 0 25px 2px rgba(18, 145, 228, 0.6);
}
.icon {
  display: inline-block;
  width: 100px;
  height: 100px;
  .imgResponsive;
}
.leftIcon {
  float: left;
  margin-left: 70px;
  position: relative;
  z-index: 1000;
}
.rightIcon {
  float: right;
  margin-right: 70px;
  span {
    float: left;
    margin-left: 40px;
  }
}
.commonFont(@size,@color) {
  font-family: 'Century Gothic';
  font-weight: bold;
  font-size: @size;
  color: @color;
}
.topBar {
  padding-top: 60px;
  position: relative;
  z-index: 555;
}

.container {
  width: 100%;
  height: 100%;
  background-image: url('@{imgBaseUrl}/img_application_list_bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.applicationList {
  position: absolute;
  top: 94px;
  bottom: 38px;
  width: 1950px;
  height: 1404px;
  left: 50%;
  transform: translateX(-50%);
  background: url('@{imgBaseUrl}/img_list_bg.png') left bottom;
  background-repeat: no-repeat;
  background-size: 100%;
  .listContainer {
    background: url('@{imgBaseUrl}/img_ACT.png') no-repeat;
    background-size: 100%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .topTitle {
    width: 1220px;
    height: 80px;
    background: url('@{imgBaseUrl}/img_small.png') no-repeat;
    background-size: 100%;
    position: absolute;
    left: 164px;
    top: 46px;
    .switchBtn {
      width: 230px;
      height: 100%;
      float: right;
      font-size: 40px;
      color: #ad6a4e;
      padding-right: 40px;
      font-weight: bold;
      line-height: 80px;
      text-align: right;
      z-index: 1000;
      position: relative;
      &.myFadeOut {
        animation: myFadeOut 1s;
      }
    }
  }
  .listTitle {
    color: #fff;
    font-size: 46px;
    font-weight: bold;
    line-height: 60px;
    font-family: 'Century Gothic';
    width: 880px;
    margin-left: 220px;
    margin-top: 76px;
    p {
      text-align: left;
      display: inline-block;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
  }
  .listTab {
    position: absolute;
    left: 105px;
    right: 105px;
    top: 242px;
    overflow-x: scroll;
    > li {
      float: left;
      height: 90px;
      line-height: 88px;
      font-size: 40px;
      font-family: 'Century Gothic';
      color: #ad6a4e;
      position: relative;
      div {
        float: left;
        &.leftBg {
          background: transparent url('@{imgBaseUrl}/btn_normal_left.png')
            no-repeat;
          background-size: 100%;
          width: 41px;
          height: 100%;
        }
        &.rightBg {
          background: url('@{imgBaseUrl}/btn_normal_right.png') no-repeat;
          background-size: 100%;
          width: 41px;
          height: 100%;
          margin-left: -1px;
        }
        &.mainContent {
          background: url('@{imgBaseUrl}/btn_normal_center.png') repeat-x;
          background-size: contain;
          height: 100%;
          margin-left: -1px;
        }
      }
      &.active {
        div {
          &.rightBg {
            background: url('@{imgBaseUrl}/btn_current_right.png') no-repeat;
            background-size: 100%;
          }
          &.leftBg {
            background: url('@{imgBaseUrl}/btn_current_left.png') no-repeat;
            background-size: 100%;
          }
          &.mainContent {
            background: url('@{imgBaseUrl}/btn_current_center.png') repeat-x;
            background-size: contain;
          }
        }
      }
    }
  }
  .mainList {
    position: absolute;
    top: 330px;
    width: 100%;
    height: 1047px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 60px 70px 0;
    box-sizing: border-box;
    overflow-y: scroll;
    li {
      width: 416px;
      height: 416px;
      margin-bottom: 40px;
      border: 6px solid #4697db;
      border-radius: 30px;
      position: relative;
      overflow: hidden;
      .imgWrap {
        width: 100%;
        height: 282px;
        overflow: hidden;
        .imgResponsive;
      }
      &.hasDone {
        .outShine;
      }
      &.hasDone:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('@{imgBaseUrl}/img_finish.png') no-repeat;
        background-size: cover;
      }
      &.isNew:before {
        content: '';
        position: absolute;
        bottom: 137px;
        left: 0;
        background: url('@{imgBaseUrl}/img_application_new.png') no-repeat;
        background-size: cover;
        width: 80px;
        height: 80px;
      }
      &.isHide {
        display: none;
      }
      &.current {
        .outShine;
      }
      p {
        .commonFont(36px,#1291e4);
        height: 134px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &:not(:nth-of-type(4n + 1)) {
        margin-left: 32px;
      }
    }
  }
  .listState {
    float: right;
    position: absolute;
    top: 148px;
    right: 0;
    z-index: 9999;
    .childFloat(right);
    .switchState {
      width: 258px;
      height: 88px;
      margin-right: 63px;
      .imgResponsive;
    }
    .progressBar {
      margin: 12px 60px 0 0;
    }
  }
  @keyframes myFadeOut {
    50% {
      margin-right: 400px;
      opacity: 0.7;
    }
    90% {
      opacity: 0;
    }
  }

  .zoomFade-leave-active {
    animation: zoomOut 1s;
  }
  .zoomFade-leave-to {
    opacity: 0;
  }
  .zoomFade-enter {
    z-index: 998;
    opacity: 0.5;
  }
  .zoomFade-enter-active {
    animation: contentIn 1s;
  }
  .switchBtnAnimation-enter-active {
    transition: opacity 0.5s;
  }
  .switchBtnAnimation-enter {
    opacity: 0;
  }
  .switchBtnAnimation-enter-to {
    opacity: 1;
  }
  .switchBtnAnimation-leave-active {
    z-index: 900;
    animation: tabFadeOut 0.5s ease;
  }
  @keyframes tabFadeOut {
    0% {
      margin-right: 0;
    }
    100% {
      margin-right: 400px;
    }
  }
  @keyframes zoomOut {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
      transform: scale(0.2);
      transform-origin: 10% top;
    }
  }
  @keyframes contentIn {
    0% {
      z-index: 998;
      opacity: 0.6;
    }
    100% {
      z-index: 998;
      opacity: 1;
    }
  }
}
</style>
