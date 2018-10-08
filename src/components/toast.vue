<template>
  <div class="toast" :class="{show: tShow}">
    {{msg}}
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";
import { defaultCipherList } from 'constants';

export default {
  name: "toast",
  props: {
    msg: {
      type: String,
      default: "请等待老师解锁..."
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["tShow"])
  },
  methods: {
    ...mapMutations(["TOAST_SHOW"])
  }
};
</script>
<style scoped lang="less">
@font: "Gentury Gothic";

.toast {
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 250px);
  width: 500px;
  height: 300px;
  border-radius: 20px;
  background: rgba(68, 68, 68, 1);
  font-size: 50px;
  font-family: @font;
  color: #ffffff;
  text-align: center;
  line-height: 300px;
  word-break: break-word;
  z-index: 2;
  display: none;
  &.show {
    display: block;
  }
}
</style>
