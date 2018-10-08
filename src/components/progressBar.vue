<template>
  <div class="progressBar">
        <div><span :style=progStyle></span></div><span>{{count}}/{{totalCount}}</span>
  </div>
</template>
<style lang="less" scoped>
 @imgBaseUrl:"../assets/image/applist";
.progressBar{
    width: 422px;
    height: 79px;
    background: url("@{imgBaseUrl}/icon_progress_bar.png") no-repeat;
    background-size:100%; 
    position: relative;
    font-size: 28px;
    color: #FFF;
    >div{
        position: absolute;
        height: 24px;
        width: 200px;
        top: 22px;
        left: 94px;
        span{
            display: block;
            height: 100%;
            border-radius: 12px;
            background: url("@{imgBaseUrl}/img_progress_center.png") repeat-x;
            background-size: contain;
        }
    }
    >span{
        display: block;
        margin-left: 310px;
        margin-top: 20px;
    }
}
</style>
<script>
export default {
  data: function() {
    return {
        
    };
  },
  computed: {
    progStyle(){
        let percent =  (this.count/this.totalCount)*100+"%"
        return {
            width:percent
        }
    }
  },
  props:{
      totalCount:Number,
      count:Number
  }
};
</script>
