<template>
  <div class="option_detail" v-show="taskInfo">
    <div class="option_detail_inner" @click="onClick" :style="{color: stateHandle }">
      <div class="option_image" :style="{background: 'url(' + showIcon +')', backgroundSize:'100% 100%'}" :class="{actStart: isActStart,  actComplete: isActComplete }"></div>
      <div class="option_content">
        {{ taskInfo.applicationName }}
      </div>
    </div>
  </div>
</template>

<script>
import ACT from "../../assets/image/taskApplicationList/img_ACT.png";
import ACT_not from "../../assets/image/taskApplicationList/img_ACT_not_started.png";
import HW from "../../assets/image/taskApplicationList/img_HW.png";
import HW_not from "../../assets/image/taskApplicationList/img_HW_not_started.png";
import HW_new from "../../assets/image/taskApplicationList/img_HW_new.png";
export default {
  props: ['taskInfo','learnTaskId', 'learnTaskName', 'teacherName'],
  data() {
    return {
      ACTIcon: ACT,
      ACTIconNot: ACT_not,
      HWIcon: HW,
      HWIconNot: HW_not,
      isActStart: false,
      isActComplete: false,
      optionColor: {
        green: '#61b12e',
        gray_hi: '#ad6a6e',
        gray: '#DABBAE'
      }
    };
  },
  methods: {
    onClick() {
      if (this.taskInfo.isActive || this.taskInfo.finished) {
        this.$router.push({
          path: '/interactiveStudy',
          query: {
            LearnTaskId: this.learnTaskId,
            LearnTaskName: this.learnTaskName,
            TeacherName: this.teacherName,
            ApplicationId: this.taskInfo.applicationId,
            ApplicationName: this.taskInfo.applicationName,
            type: 1,
            modularName: this.taskInfo.modularName,
          }
        })
      }
    }
  },
  computed: {
    stateHandle() {
      if (this.taskInfo.finished) {
        this.isActStart = false;
        this.isActComplete = true;
        return this.optionColor.green
      } else if (!this.taskInfo.finished && this.taskInfo.isActive) {
        this.isActStart = true;
        this.isActComplete = false;
        return this.optionColor.gray_hi
      } else {
        this.isActStart = false;
        this.isActComplete = false;
        return this.optionColor.gray
      }
    },
    showIcon() {
      if (this.taskInfo.finished || this.taskInfo.isActive) {
        return this.taskInfo.modularName === "Homework" ? this.HWIcon : this.ACTIcon
      } else {
        return this.taskInfo.modularName === "Homework" ? this.HWIconNot : this.ACTIconNot
      }
    }
  }
};
</script>

<style lang="less">
  .option_detail {
    margin-top: 32px;
    display: flex;
    align-items: center;
    padding-left: 32px;
  }
  .option_detail_inner {
    display: flex;
    align-items: center;
  }
  .option_image {
    width: 78px;
    height: 78px;
    margin-right: 32px;
    position: relative;
  }
  .option_content {
    font-size: 42px;
    font-family: "Century Gothic Regular";
    width: 1260px;
    text-align: left;
  }

.actComplete {
  color: red;
  &::after {
    content: "";
    width: 45px;
    height: 35px;
    display: block;
    transform: translate(-100%, 50%);
    position: absolute;
    top: 0;
    left: -20px;
    background: url("../../assets/image/taskApplicationList/icon_finish.png")
      no-repeat;
    background-size: 100% 100%;
  }
}
.actStart {
  &::after {
    content: "";
    width: 120px;
    height: 100px;
    display: block;
    transform: translate(-100%, -10%);
    position: absolute;
    top: 0;
    left: -8px;
    background: url("../../assets/image/taskApplicationList/btn_start.png")
      no-repeat;
    background-size: 100% 100%;
  }
}
</style>
