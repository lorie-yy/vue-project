<template>
  <div >
    <div id="topBar" v-transform="{width:2048,height:76,fontSize:38,anchor:'50% 0%'}" v-if="!!detail">
      <span><img :src="isHW?homeworkIcon:activityIcon" alt=""></span>
      {{detail}}
    </div>
    <!-- <div class="progress" v-transform="{width:2048,height:40,fontSize:38,anchor:'50% 100%'}">
      {{activeIndex+1}}/{{appCount}}
    </div> -->
    <con-modal v-if="showUnitDone" @fireClose="showUnitDone = false" @back="backPrevPage">
      <div slot="modalContent" class="modalText">
        <p>你已完成</p>
        <p>{{unitAName}} {{unitBName}}</p>
      </div>
    </con-modal>
    <cus-modal v-if="showLinksDone" @fireClose="showLinksDone=false" @back="backPrevPage" :type="1">
      <div slot="modalContent">
        <p class="contentTip">你已完成</p>
        <div class="taskName"><p>{{linkName}}</p></div>
      </div> 
    </cus-modal>
    <cus-modal v-if="showTaskDone" @fireClose="showTaskDone=false" @back="backPrevPage" :type="2">
      <div slot="modalContent">
        <p class="contentTip">你已完成 {{teacherName}}的任务:</p>
        <p class="taskName">“{{taskName}}”</p>
      </div> 
    </cus-modal>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {CourseFinished, CourseExit, strRmQuotation,jsonToUrl} from 'assets/js/utils.js';
import conModal from 'components/conModal';
import cusModal from 'components/cusModal';
import confirmBox from 'components/confirmBox';
import {setTimeout} from 'timers';
import {setSessionStorage, getLocalStorage,setLocalStorage,removeLocalStorage,getSessionStorage} from 'assets/js/storage.js';
import {applicationDone, taskUpdate} from 'api/getData.js';
import $ from 'jquery';
import { debug } from 'util';


export default {
  name: 'interactiveStudy',
  components: {
    conModal,
    cusModal,
    confirmBox,
  },
  data() {
    return {
      applicationId: 0,
      applicationOId: '',
      bookId: 0,
      unitAName: '',
      unitBName: '',
      modularName: '',
      linkId: '',
      linkName: '',
      unitsIds: '',
      dailyTaskId: '',
      showUnitDone: false,
      showLinksDone: false,
      showTaskDone: false,
      taskName: '',
      teacherName: '',
      sendData: {
        send: () => {},
      },
      type: -1,
      homeworkIcon: require('@/assets/image/applistDetail/img_HW.png'),
      activityIcon: require('@/assets/image/applistDetail/img_ACT.png'),
      activeIndex:0,
      applicationName:"",
      detail:'',
      isHW:false,//是否是homework
      backQuery:""
    };
  },
  created() {
    let query = this.$route.query;
    this.type = query.type;
    this.appIds = getLocalStorage('appIds');
    this.hasDoneApp = getSessionStorage('hasDoneApp')||[];
    this.applicationId = Number(getLocalStorage('appId')||query.ApplicationId);
    this.backQuery = getSessionStorage('applistQuery')
    this.restTasks = getSessionStorage('restTasks');
    this.appIds.forEach((element,index) => {
      if(element.applicationId==this.applicationId){
        this.activeIndex = index
      }
    });
    if (query.type == 1) {//任务列表进入
      this.learnTaskId = query.LearnTaskId;
      this.taskName = query.LearnTaskName;
      this.teacherName = query.TeacherName;
      this.sendData.send = this.taskUpdate;
    }
    if (query.type == 0) {//作业进入
      this.unitAName = query.unitATitle;
      this.unitBName = query.unitBTitle;
      this.linkOId = query.linkOId;
      this.linkName = query.linkName;
      this.unitsIds = query.unitIds;
      this.bookId = query.bookId;
      this.bookOId =query.bookOId;
      this.sendData.send = this.lessonFinish;
      this.dailyTaskId = query.dailyTaskId;
      this.applicationOId = query.applicationOId;
      this.modularName = query.modularName;
    }
    this.applicationName = this.appIds[this.activeIndex].applicationName//当前应用title
    this.applicationOId = this.appIds[this.activeIndex].applicationOId
    this.stepInToVC();
    window.exitCourse = {
      exit: () => {
        this.backPrevPage();
        //存入当前正在学的应用
        setSessionStorage('currentId', this.applicationId);
      }
    };
    window.nowSocket = this.sendData;

  },
  beforeRouteLeave(to,from,next){
    removeLocalStorage('appId')
    this.removeCourseware();
    next()
  },
  methods: {
    removeCourseware() {
      if (window.nowCourseware) {
        window.nowCourseware.destroy();
        window.nowCourseware = undefined;
        $('#CoursewareDiv').remove();
        $('canvas').remove();
        $('#progressText').remove();
      }
    },
    stepInToVC() {
      this.removeCourseware();
      let jsonId = getLocalStorage('jsonId');
      $.getJSON(
        `https://s3.cn-north-1.amazonaws.com.cn/imagine-cn/${jsonId}/${
          this.applicationId
        }.json`,
        data => {
          let code = course[data.js_name];
          this.detail = data.json.detail;
          if(code.toLowerCase().indexOf('hwtpl')>=0){
            this.isHW = true
          }
          new VCCoursewareEntry(code, data.json);
        }
      );
    },
    lessonFinish(data) {
      let lessonData = JSON.parse(data.match(/\{.+\}/)[0]);
      let books = getLocalStorage('books')
      let body = {
        bookId: this.bookOId,
        unitAName: this.unitAName,
        unitBName: this.unitBName,
        modularName: this.modularName,
        linkId: this.linkOId,
        linkName: this.linkName,
        applicationId: this.applicationOId,
        applicationName: this.applicationName,
        unitIds: this.unitsIds,
        dailyTaskId: this.dailyTaskId,
        learningDuration: lessonData.CurrentTimeSpans,
        correctNumbers: lessonData.CorrectPoints,
        totalNumbers: lessonData.SumPoints,
        StudyExerciseProgressId:books[this.bookId]['booksAndUnits'][0]['_id']
      };
      applicationDone(body).then(data => {
        //存数据
        let isNeed = this.hasDoneApp.indexOf(Number(this.applicationId))<0;
        this.setAppComplete();
        if (isNeed&&data.unitIsFinished) {
          this.showUnitDone = true;
          setSessionStorage('restTasks', this.restTasks-1)
        } else if (isNeed&&data.linkIsFinished) {
          setSessionStorage('restTasks', this.restTasks-1)
          this.showLinksDone = true;
        } else {
          this.stepIntoNextVc()
        }
      });
    },
    taskUpdate(data) {
      let lessonData = JSON.parse(data.match(/\{.+\}/)[0]);
      let totalNumber = lessonData.SumPoints,
        wrongNumber = totalNumber - lessonData.CorrectPoints;
      taskUpdate({
        LearnTaskId: this.learnTaskId,
        ApplicationId: this.applicationId,
        TotalNumber: totalNumber,
        WrongNumber: wrongNumber
      }).then(data => {
        //TODO:返回结果待处理
        if (data.taskFinished) {
          this.showTaskDone = true;
          setSessionStorage('restTasks', this.restTasks-1)
        }else{
          this.stepIntoNextVc()
        }
      });
    },
    jump(url) {
      this.$router.push(url);
    },
    stepIntoNextVc() {
      if(++this.activeIndex<this.appIds.length){
        let nextAppId = this.appIds[this.activeIndex].applicationId
        //存储下一个应用id
        setLocalStorage('appId',nextAppId);
        location.reload();
      }else{
        this.backPrevPage()
      }
    },
    backPrevPage() {//退出互动学习，返回
      if(this.type==0){
        this.$router.replace({
          path:'/applist',
          query:this.backQuery
        })
      }else if(this.type==1){
         this.$router.replace({
            path:'/taskList',
            query:{
              teacherName:this.teacherName,
              learnTaskId:this.learnTaskId
            }
          })
      }else{
        this.$router.replace({
          path:'/course'
        })
      }
    },
    setAppComplete(){
      this.hasDoneApp.push(Number(this.applicationId));
      setSessionStorage('hasDoneApp',this.hasDoneApp)
    }
  },
}; 
</script> 
<style scoped lang="less">
#topBar {
  position: fixed;
  width: 100%;
  height: 76px;
  background: url(../../../src/assets/image/applistDetail/img_top_bar.png)
    no-repeat;
  text-align: left;
  line-height: 76px;
  font-size: 38px;
  color: #000;
  z-index: 999;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  span {
    display: inline-block;
    width: 3.7%;
    height: 100%;
    margin-left: 42px;
    margin-right: 20px;
    vertical-align: middle;
    img {
      width: 100%;
    }
  }
}
.progress{
  position: absolute;
  z-index: 9999;
  color: #000;
  text-shadow:0 4px 2px #fff;
  transform: translateX(-50%);
  left: 50%;
  bottom: 40px;
  text-align: left;
  text-indent: 60px;
  pointer-events: none
}
.modalText {
  > p:first-child {
    font-size: 50px;
  }
  > p:last-child {
    font-size: 66px;
    margin-top: 30px;
    font-family: 'Century Gothic';
    font-weight: bold;
  }
}
.contentTip {
  font-size: 48px;
  padding-top: 120px;
}
.taskName {
  font-size: 56px;
  font-family: 'century gothic';
  margin: 0 auto;
  margin-top: 50px;
  max-width: 820px;
  line-height: 80px;
  text-align: center;
  p{
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-align: left;
    display: inline-block
  }
}
</style>
