<template>
  <div class="taskList_wrapper" v-if="taskDataObj">
    <div class="header">
      <div class="left">
        <div class="back image_size" @click="onBack">
        </div>
        <div class="taskList_hourglas" v-if="isShowTime" :style="{background: 'url(' + countDownOpenIcon + ')', backgroundSize: '100% 100%'}">
          <CountDown v-if="taskEndTime" :isStop="isStopWrap" :startTime="(new Date()).getTime()" :endTime="taskEndTime" v-on:end_callback="countDownE"></countdown>
        </div>
      </div>
    </div>
    <div class="taskList_content" v-show="taskDataObj">
      <div class="taskList_bg">
        <div class="content_header">
          <div class="title">
            {{ taskDataObj.learnTaskName }}
          </div>
          <div class="taskList_progress">
            <div class="progress_inner">
              <x-progress :percent="percent" :show-cancel="false"></x-progress>
            </div>
            <P class="progress_num_taskList">{{ taskDataObj.finishedCount }}/{{ taskDataObj.appCount }}</P>
          </div>
        </div>
        <div class="taskList_info" v-show="taskOptionObj">
          <div class="taskList_inner">
            <div class="taskList_inner_content">
              <!-- 一次循环 -->
              <div class="fordetail" v-for="(task, index) in taskOptionObj" :key= "index">
                <div :class="{title_gray_hi: task.isAllFinish}" class="title_gray" :style="{color:task.isAllFinish?optionColor.gray_hi:optionColor.gray}">
                  {{ task.unitAName }} - {{ task.unitBName }}
                </div>
                <!-- 二次循环 -->
                <template>
                  <listInfo :learnTaskId="taskDataObj.learnTaskId" v-for="(innerItem, index) in task.children" :taskInfo="innerItem" :key= "index" 
                  :learnTaskName="taskDataObj.learnTaskName" :teacherName="teacherName"></listInfo>
                </template>
              </div>
            </div>
            <div class="state_completeIcon" v-show="taskDataObj.finished">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import back1 from "../../assets/image/public/btn_back.png";
import back0 from "../../assets/image/public/btn_back.png";
import map1 from "../../assets/image/public/btn_map.png";
import map0 from "../../assets/image/public/btn_map.png";
import task1 from "../../assets/image/public/btn_task_normal.png";
import task0 from "../../assets/image/public/btn_task_press.png";
import personal1 from "../../assets/image/public/btn_personal_normal.png";
import personal0 from "../../assets/image/public/btn_personal_press.png";
import countDownClose from "../../assets/image/taskApplicationList/img_countdown_overdue.png";
import countDownOpen from "../../assets/image/taskApplicationList/img_countdown.png";
// import { XProgress, Box } from "vux";
import CountDown from "@/components/countdown.vue";
import axios from "axios";
import listInfo from "./listInfo.vue";
import { mapActions } from 'vuex';
import { setTimeout } from 'timers';
import { changeTaskListJson } from 'assets/js/publicMethods.js';
import { getTaskList } from "api/getData";
export default {
  data() {
    return {
      timeData:[
        { isStopWrap: false },
        { isStopWrap: false }
      ],
      isActComplete: true,
      isActStart: false,
      taskEndTime: '',
      learnTaskId: '',
      countDownCloseIcon: countDownClose,
      countDownOpenIcon: countDownOpen,
      backIcon: back1,
      taskIcon: task0,
      mapIcon: map1,
      personalIcon: personal1,
      isStopWrap: false,
      taskDataObj: {},
      stopValue: false,
      taskOptionObj: '',
      teacherName: '',
      optionColor: {
        gray_hi: '#ad6a6e',
        gray: '#DABBAE'
      }
    };
  },
  components: {
    // XProgress,
    // Box,
    CountDown,
    listInfo
  },
  methods: {
    ...mapActions(['toggleLoadShow']),
    onBack() {
      this.$router.push({
        path: '/taskCenter'
      })
    },
    countDownE() {
      if(!this.taskDataObj.isOverdue) {
        this.getData();
      }
    },
    clickMap() {
      this.mapIcon = map0;
      this.$router.push({
        path: '/course'
      })
    },
    clickTask() {
      this.taskIcon = task0;
    },
    clickPersonal() {
      this.personalIcon = personal0;
      this.$router.push({
        path: '/userCenter'
      })
    },
    getData() {
      this.teacherName = this.$route.query.teacherName;
      //this.toggleLoadShow(true)
      getTaskList(this.learnTaskId).then(data => {
        this.taskDataObj = data
        let newArr = new changeTaskListJson(this.taskDataObj.learnTaskApplicationList, this.taskDataObj.isOverdue);
        this.taskOptionObj = newArr.dataObj;
        this.taskEndTime = this.taskDataObj.isOverdue ? 1234850649252 : new Date(this.taskDataObj.endTime).getTime();
        //this.toggleLoadShow(false)
      })
    }
  },
  computed: {
    percent() {
      return (this.taskDataObj.finishedCount / this.taskDataObj.appCount)*100
    },
    isShowTime() {
      if (this.taskDataObj.isOverdue) {
        return true;
      } else {
        if (this.taskDataObj.finished) {
          return false
        } else {
          return true
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.learnTaskId) {
      this.learnTaskId = this.$route.query.learnTaskId;
      localStorage.setItem('learnTaskId', JSON.stringify(this.learnTaskId))
    } else {
      this.learnTaskId = JSON.parse(localStorage.getItem('learnTaskId'));
    }
    this.getData();
  }
};
</script>

<style scoped lang="less">
@font: "Gentury Gothic";
.taskList_wrapper {
  height: 100%;
  width: 100%;
  background: url("../../assets/image/taskcenter/bg.png") no-repeat;
  background-size: 100%;
}
.header {
  padding: 60px 70px 0 70px;
  display: flex;
  margin-bottom: 50px;

  .left {
    display: flex;
    align-items: center;
  }

  .back {
    background: url("../../assets/image/public/btn_back.png") no-repeat;
    background-size: 100%;
    margin-right: 70px;
  }

  .taskList_hourglas {
    height: 100px;
    font-size: 40px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0 40px 0 90px;
  }

  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  .public_image_left {
    margin-right: 40px;
  }
}
.image_size {
  height: 100px;
  width: 100px;
}
.taskList_content {
  height: 1304px;
  display: flex;
  justify-content: center;

  .taskList_bg {
    height: 1304px;
    width: 1950px;
    background: url("../../assets/image/taskApplicationList/img_link.png")
      no-repeat;
    background-size: 100%;
  }
}
.content_header {
  padding: 0 60px 0 120px;
  height: 142px;
  display: flex;

  .title {
    width: 1260px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;
    color: #ffffff;
    font-size: 46px;
    margin-top: 62px;
  }
  .taskList_progress {
    margin-left: auto;
    margin-top: 50px;
    height: 79px;
    width: 422px;
    background: url("../../assets/image/taskApplicationList/icon_progress.png")
      no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 9px 30px 0 92px;
    display: flex;

    p {
      margin-top: 10px;
      font-size: 28px;
      color: #ffffff;
    }
  }
}
.taskList_info {
  box-sizing: border-box;
  height: 1163px;
  padding: 0 25px 25px 25px;
  position: relative;

  .state_completeIcon {
    height: 203px;
    width: 268px;
    background: url("../../assets/image/taskApplicationList/img_task_finish.png")
      no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    right: 50px;
  }
}
.taskList_inner {
  height: 100%;
  width: 100%;
  overflow-y: auto;

  .taskList_inner_content {
    width: 1444px;
    margin-left: 240px;
  }
}
.fordetail {
  padding: 60px 0 40px 0;
  border-bottom: 2px solid #f7e7df;

  .title_gray {
    font-family: @font;
    font-weight: bold;
    font-size: 42px;
    display: flex;
    align-items: center;
  }
  .title_gray:before {
    width: 16px;
    height: 16px;
    content: "";
    display: block;
    border-radius: 100%;
    background-color: #DABBAE;
    margin-right: 32px;
  }

  .title_gray_hi {
    font-size: 42px;
    display: flex;
    align-items: center;
  }
  .title_gray_hi:before {
    width: 16px;
    height: 16px;
    content: "";
    display: block;
    border-radius: 100%;
    background-color: #ad6a4e;
    margin-right: 32px;
  }
}
</style>
 
<style lang="less">

.progress_inner {
  width: 200px;
  .weui-progress {
    height: 50px;
    width: 205px;
  }
}
.weui-progress > .weui-progress__bar {
  height: 25px;
  background: #965f28;
  border-radius: 10px;
}
.weui-progress__bar > .weui-progress__inner-bar {
  height: 25px;
  background: #c8cd23;
  border-radius: 10px;
}
.progress_num_taskList {
  margin-left: auto;
}
</style>