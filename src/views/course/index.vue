<template>
  <div>
    <swiper :options="swiperOption" ref="swiper" v-if="unitList && swiperOption">
      <swiper-slide v-for="(uItem, index) in unitList" :key="index" v-if="unitList">
        <div class="course-wrap" v-if="unitList">
          <div class="course-map swiper-lazy" 
            :data-background="uItem.mapUrl"
            :style="{background: 'url(' + uItem.mapUrl + ') center center / 100% 100% no-repeat'}"
          > 
            <div class="course-map-mask" />
            <div v-for="(item, idx) in uItem.chapters" :key="idx">
              <div class="course-chapter" :class="{'chapter-new': item.isNewUpdate}" :style="{left: (item.x * 100 / baseWidth) + '100%', top: (item.y * 100 / baseHeight) + '100%'}">
                <div class="course-bubble"  :class="{'lock': item.isUnitLocked}" @click="gotoAppList(item)">
                  <div class="course-chapter-state" 
                    :style="getChapterStyle(uItem, item, 1)"
                  >
                    <span class="chapter-unlock" 
                      :class="{'chapter-finish': item.isComplete, 'chapter-lock': item.isUnitLocked, 'chapter-new': item.isNewUpdate}" 
                    />
                  </div>
                  <div class="course-chapter-title" :style="getChapterStyle(uItem, item, 2)" v-width>
                    <div class="course-text">{{item.title}}</div>
                  </div>
                  <div class="course-chapter-end" 
                    :style="getChapterStyle(uItem, item, 3)"
                  />
                </div>
                <div class="course-chapter-progress" :style="{display: item.isUnitLocked ? 'none' : 'block'}">({{item.finished}}/{{item.total}})</div>
              </div>
            </div>
            <div class="course-unit"
              :style="getUnitStyle(uItem, 1)">
              <div class="course-unit-pic" :style="getUnitStyle(uItem, 3)"/>
              <span class="course-unit-title" :style="getUnitStyle(uItem, 2)">{{uItem.title}}</span>
            </div>
          </div>
        </div>
        <div v-if="!uItem.isPublished" class="course-mask nopublish" @click="showBallon">
          <div class="course-hotballon" :class="{show: showBall}"></div>
        </div>
        <div v-else/>
      </swiper-slide>
    </swiper>
    <div v-if="bookIsNull" class="course-mask nopublish" @click="showBallon">
      <div class="course-hotballon" :class="{show: showBall}"></div>
    </div>
    <div class="course-book-single">
      <div class="course-book-btn" @click="toggleBook"/>
      <div class="course-book-open"
        @click="toggleBook" 
        :style="{background: 'url(' + (bookList[bookSequence] ? bookList[bookSequence].imgUrl : '') + ') center center / 100% 100% no-repeat'}"
      />
    </div>
    <div id="courseBookBar" class="course-book-bar" :class="{'book-out': bookOut, 'book-in': bookIn}">
      <div class="course-books-outer">
        <div class="course-close-btn" @click="toggleBook" />
        <div class="course-books-inner">
          <div v-for="(item, index) in bookList" :key="index">
            <div class="course-book" 
              :class="{'current': item.sequence === bookSequence, 'finish': item.isComplete, 'new': item.isNewUpdate, 'over': item.isOver}"
              :style="{'display': getBookDisplay(item), background: 'url(' + item.imgUrl + ') center center / 100% 100% no-repeat'}"
              @click="selectBook(item, index)"
            >
            </div>
            <span v-text="sIndex" style="display: none" />
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template> 
<script>
import { mapGetters, mapMutations } from "vuex";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { setTimeout } from "timers";
import { dataFormatter } from "assets/js/formatter";
import {
  getUnFinishTask,
  getStuLearnBooks,
  updateBookState
} from "api/getData";
import { setSessionStorage } from "assets/js/storage";
import { getViewPoint } from "assets/js/utils";
import Toast from "components/toast";
import position from "views/course/position";
import cloud from "assets/image/course/img_unpublished.png";
import "assets/js/clamp";
import _ from "lodash";

export default {
  name: "course",
  components: {
    swiper,
    swiperSlide,
    Toast
  },
  data() {
    return {
      cloud,
      bookIsNull: false,
      baseWidth: 2048,
      baseHeight: 1536,
      bookOut: true,
      bookIn: false,
      aLock: false,
      bookList: [
        {
          isNull: false
        }
      ],
      unitList: [],
      showMask: false,
      showBall: false,
      remainPos: [...position],
      chapterObj: {},
      sIndex: 0,
      swiperOption: {
        observer: true,
        observeParents: true,
        resistanceRatio: 0,
        lazy: {
          loadPrevNext: true
        },
        on: {
          slideChange: this.handleChangeSlide
        }
      }
    };
  },
  computed: {
    ...mapGetters(["tShow", "bookSequence", "unitSequence"]),
    swiper() {
      return this.$refs.swiper.swiper;
    }
  },
  created() {
    //获取课本所有数据
    getStuLearnBooks().then(res => {
      localStorage.setItem("jsonId", JSON.stringify(res[0].jsonId));
      res = res[0].books.filter(book => {
        let name = book.teachingMaterialName.toLowerCase();
        return name.indexOf("island") !== -1 || name.indexOf("funfair") !== -1;
      });
      let data = dataFormatter(res);
      data = this.sortFormatter(data);
      this.setToLocalStorage(data);
      if (!data.length) {
        this.SET_SERVICE_OPEN(false);
        this.TOGGLE_CONFIRM_BOX({
          isShow: true,
          btnType: "done",
          haveCancel: false,
          content: "你的互动课本服务未开通\n请联系本班老师",
          fallback: this.handleConfirm
        });
        return;
      }
      let bookIndex = this.$store.state.bookSequence;
      let bookList = this.arrayAssign(data);
      let unfinish = this.getUnHomeWork(bookList);

      getUnFinishTask(2).then(res => {
        res = parseInt(res) + unfinish;
        if (parseInt(res) > 99) res = 99;
        setSessionStorage("restTasks", res);
        this.GET_UNFINISHED_TASK(res);
      });
      this.bookList = bookList;
      this.bookIsNull = bookList[bookIndex].isNull;
      this.unitList = bookList[bookIndex].units || [];
      this.$nextTick(() => {
        this.swiper.activeIndex = this.$store.state.unitSequence;
        this.changeFilterBackground();
      });
    });
  },

  mounted() {},
  methods: {
    ...mapMutations([
      "GET_UNFINISHED_TASK",
      "SET_ALL_BOOKS",
      "TOGGLE_CONFIRM_BOX",
      "SET_SERVICE_OPEN",
      "TOAST_SHOW",
      "SET_BOOK_SEQUENCE",
      "SET_UNIT_SEQUENCE"
    ]),
    handleConfirm() {
      this.$router.push({ path: "/userCenter" });
    },
    getUnHomeWork(data) {
      let number = 0;
      for (let book of data) {
        if (!book.units) continue;
        for (let unit of book.units) {
          if (!unit.children.length) continue;
          for (let u of unit.children) {
            if (!u.isComplete && !u.isUnitLocked && u.total) number++;
          }
        }
      }
      return number;
    },
    showToast() {
      let isLock = this.bookList[this.$store.state.bookSequence].units[
        this.$store.state.unitSequence
      ].isUnitLock;
      if (!isLock) return;
      if (!this.tShow) {
        this.aLock = true;
        this.TOAST_SHOW(true);
        setTimeout(() => {
          this.aLock = false;
          this.TOAST_SHOW(false);
        }, 3000);
      }
    },
    setToLocalStorage(data) {
      let books = {};
      for (let book of data) {
        books[book.booksAndUnits[0].bookId] = book;
      }
      localStorage.setItem("books", JSON.stringify(books));
      this.SET_ALL_BOOKS(books);
    },
    gotoAppList(item) {
      if (this.aLock) return;
      if (item.isUnitLocked) {
        if (!this.tShow) {
          this.TOAST_SHOW(true);
          setTimeout(() => {
            this.TOAST_SHOW(false);
          }, 3000);
        }
        return;
      }
      if (item.isNewUpdate) {
        // 接口
        item.isNewUpdate = false;
      }
      item.backUrl = {
        path: this.$route.path,
        query: this.$route.query,
        params: this.$route.params
      };
      this.$router.push({
        path: "/applist",
        query: item
      });
    },
    gotoTask() {
      this.$router.push("/taskCenter");
    },
    gotoPersonal() {
      this.$router.push("/userCenter");
    },
    handleChangeSlide() {
      this.sIndex = this.swiper.activeIndex;
      this.SET_UNIT_SEQUENCE(this.swiper.activeIndex);
      this.aLock = false;
      this.TOAST_SHOW(false);
      this.$nextTick(() => {
        this.changeFilterBackground();
      });
    },
    //切换毛玻璃背景图片
    changeFilterBackground() {
      let bgUrl = cloud;
      let book = this.bookList[this.$store.state.bookSequence];
      if (!book.isNull) {
        bgUrl = book.units[this.$store.state.unitSequence].mapUrl;
      }
      let style = document.createElement("style");
      document.head.appendChild(style);
      let sheet = style.sheet;

      sheet.addRule(
        ".course-book-bar::before",
        "background: url(" + bgUrl + ") 0 0 / 100% 100% fixed"
      ); // 兼容IE浏览器
      sheet.insertRule(
        ".course-book-bar::before { background: url(" +
          bgUrl +
          ") 0 0 / 100% 100% fixed}",
        0
      ); // 支持非IE的现代浏览器
    },
    getBookDisplay(item) {
      let display;
      if (!item.isPublished) {
        display = "none";
        if (item.isNull) display = "block";
      } else {
        display = "block";
      }
      return display;
    },
    /**
     * 获取单元A的大小和位置
     * @params unit 单元A
     * @params type 1-牌子 2-标题 3-图片
     */
    getUnitStyle(unit, type) {
      let bookIndex = this.$store.state.bookSequence;
      let style = {};
      switch (type) {
        case 1:
          style = {
            width: getViewPoint(unit.width),
            height: getViewPoint(unit.height),
            left: unit.x * 100 / this.baseWidth + "100%",
            top: unit.y * 100 / this.baseHeight + "100%",
            background:
              "url(" +
              this.bookList[bookIndex].unitUrl +
              ") center center / 100% 100% no-repeat"
          };
          break;
        case 2:
          style = {
            marginLeft: getViewPoint(unit.chapter.ml + 115)
          };
          break;
        case 3:
          style = {
            marginLeft: getViewPoint(unit.chapter.ml),
            marginTop: getViewPoint(unit.chapter.mt),
            background: unit.imageName
              ? "#ffffff url(" +
                unit.imgUrl +
                ") center center / 94.6903% 92.3077% no-repeat"
              : "#ffffff"
          };
          break;
        default:
          break;
      }
      return style;
    },
    /**
     * 获取单元B的大小和位置
     * @params unit 单元A
     * @params chapter 单元B
     * @params type 气泡的三段
     */
    getChapterStyle(unit, chapter, type) {
      let style = {};
      switch (type) {
        case 1:
          style = {
            width: getViewPoint(unit.chapter.lw),
            height: getViewPoint(unit.chapter.h),
            left: unit.x * 100 / this.baseWidth + "100%",
            top: unit.y * 100 / this.baseHeight + "100%",
            background:
              "url(" +
              (chapter.isUnitLocked
                ? unit.chapter.leftLockUrl
                : unit.chapter.leftUrl) +
              ") center center / 100% 100% no-repeat"
          };
          break;
        case 2:
          style = {
            color: unit.chapter.color,
            background:
              "url(" +
              (chapter.isUnitLocked
                ? unit.chapter.middleLockUrl
                : unit.chapter.middleUrl) +
              ") center center / 100% 100% no-repeat"
          };
          break;
        case 3:
          style = {
            height: getViewPoint(unit.chapter.h),
            width: getViewPoint(unit.chapter.rw),
            background:
              "url(" +
              (chapter.isUnitLocked
                ? unit.chapter.rightLockUrl
                : unit.chapter.rightUrl) +
              ") center center / 100% 100% no-repeat"
          };
          break;
        default:
          break;
      }
      return style;
    },
    //切换book的点击样式
    changeBookStyle(curIndex) {
      let books = document.getElementsByClassName("course-book");
      for (let i = 0; i < books.length; i++) {
        if (i === curIndex) {
          let clsName = books[i].className.split(" ");
          let clsNames = [...clsName, ...["current"]];
          let set = new Set(clsNames);
          let newCls = Array.from(set);
          books[i].className = newCls.join(" ");
        } else {
          books[i].className = books[i].className.replace("current", " ");
        }
      }
    },
    selectBook(book, index) {
      this.SET_BOOK_SEQUENCE(index);
      this.SET_UNIT_SEQUENCE(0);
      this.swiper.activeIndex = 0;
      this.unitList = this.bookList[index].units;
      this.bookIsNull = !!book.isNull;

      this.$nextTick(() => {
        this.changeBookStyle(index);
        this.changeFilterBackground();
      });

      // 课本new状态更新为非new
      if (book.isNewUpdate) {
        updateBookState({ bookObjectId: book.bookOid }).then(res => {
          book.isNewUpdate = false;
        });
      }
    },
    toggleBook() {
      this.bookIn = !this.bookIn;
      this.bookOut = !this.bookOut;
    },
    showBallon() {
      if (!this.showBall) {
        this.showBall = true;
        setTimeout(() => {
          this.showBall = false;
        }, 3000);
      }
    },
    //统计子单元下应用：已完成/全部
    calcApps(ids, modulesAndSegments, child) {
      let total = 0;
      let finished = 0;
      let isPublished = false;
      ids.forEach(id => {
        let segments = modulesAndSegments[id];
        if (segments)
          segments.forEach(segment => {
            if (segment.children) {
              let children = segment.children;
              children.forEach(item => {
                if (item.levelName === 5) {
                  //ACT
                  if (child && item.modularName === '课后学习') {
                    child['isACT'] = true;
                  } 
                  total += 1;
                  finished += item.isComplete ? 1 : 0;
                  isPublished = true;
                }
              });
            }
          });
      });
      return { finished, total, isPublished };
    },
    calcUnitPublish(unit, modulesAndSegments) {
      let isPublished = false;
      let ids = [];
      unit.children.forEach(child => {
        ids = [...ids, ...child._id];
      });
      return this.calcApps(ids, modulesAndSegments).isPublished;
    },
    calcLockStatus(children) {
      let status = true;
      for (let child of children) {
        if (!child.isUnitLocked) {
          status = false;
        }
      }
      return status;
    },
    //先显示act课后学习再展示hw拓展练习再rank排序
    sortFormatter(data) {
      if (data && data.length)
        data.forEach(item => {
          if (item.booksAndUnits && item.booksAndUnits.length)
            item.booksAndUnits.forEach(book => {
              if (book.units && book.units.length)
                book.units = _.sortBy(book.units, ["rank"]);
                book.units.forEach(unit => {
                  let children = unit.children;
                  children.forEach(child => this.calcApps(child._id, item.modulesAndSegments, child));
                  let act = children.filter(
                    child => child.isACT
                  );
                  let hw = children.filter(
                    child => !child.isACT
                  );
                  act = _.sortBy(act, ["rank"]);
                  hw = _.sortBy(hw, ["rank"]);
                  unit.children = [...act, ...hw];
                });
            });
        });
      return data;
    },

    //数据和位置合并
    arrayAssign(data) {
      let bookArr = [];
      let newArr = [];
      let chapter = {};
      let curPos;
      let newData = JSON.parse(JSON.stringify(data));
      for (let b = 0; b < newData.length; b++) {
        let newArr = [...newData[b].booksAndUnits];
        let book = newArr[0];
        let tempCurPos = this.getPos(book.teachingMaterialName)[0];
        if (tempCurPos) {
          curPos = tempCurPos;
        }
        book.sequence = b;
        //课本图片
        book.imgUrl =
          "http://ilab.4006688991.com/upload/Image/" + book.imageName;
        if (!book.units) {
          book.isNull = true;
          bookArr.push(newArr[0]);
          continue;
        }
        //单元标牌图片
        book.unitUrl = curPos.unitUrl;
        book.isPublished = !!book.units.length; //true已发布，没有单元:未发布
        if (!book.units.length) return;

        for (let u = 0; u < book.units.length; u++) {
          let unit = book.units[u];

          unit.isUnitLock = this.calcLockStatus(unit.children); //单元A下所有单元B加锁状态
          //单元A地图图片
          unit.mapUrl = curPos["units"][u].imgUrl;
          //单元A图片
          unit.imgUrl =
            "http://ilab.4006688991.com/upload/Image/" + unit.imageName;

          //单元B三段图片
          unit["chapter"] = { ...curPos["units"][0].chapter };

          unit.x = curPos["units"][u].x;
          unit.y = curPos["units"][u].y;
          unit.width = curPos.width;
          unit.height = curPos.height;
          unit.chapters = [...unit.children];
          unit.isPublished = this.calcUnitPublish(
            unit,
            data[b].modulesAndSegments
          ); //true已发布，单元A->单元B->没有应用:未发布

          //子单元目前最多8个
          // if (unit.chapters.length > 8) {
          //   unit.chapters.length = 8;
          // }
          for (let c = 0; c < unit.chapters.length; c++) {
            let chapter = unit.chapters[c];
            let obj = this.calcApps(chapter._id, data[b].modulesAndSegments);

            chapter.finished = obj.finished;
            chapter.total = obj.total;

            if (!chapter.total) {
              unit.chapters.splice(c, 1);
              c--;
            }
            if (curPos["units"][u]["chapters"][c]) {
              chapter.x = curPos["units"][u]["chapters"][c].x;
              chapter.y = curPos["units"][u]["chapters"][c].y;
            }
          }
        }
        bookArr.push(newArr[0]);
      }
      return bookArr;
    },
    getPos(teachingName) {
      let index = this.remainPos.findIndex(
        p => teachingName.toLowerCase().indexOf(p.name.toLowerCase()) !== -1
      );
      let pos = [];
      if (index !== -1) {
        pos = this.remainPos.splice(index, 1);
      }
      return pos;
    }
  }
};
</script>
<style scoped lang="less">
@imgUrl: "~assets/image/course/";
@font: "Gentury Gothic";
@baseWidth: 2048px;
@baseHeight: 1536px;

.seq() {
  position: absolute;
  top: 8px;
  right: 15px;
  width: 15px;
  height: 15px;
  border: 1px solid #ffffff;
  border-radius: 100%;
  background-color: #299bc0;
  font-size: 18px;
  font-family: @font;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  line-height: 15px;
}

.swiper-wrapper {
  .swiper-slide {
    // margin-right: -1px;
    height: 100vh;
  }
}
.course-wrap {
  position: absolute;
  width: 100vw;
  height: 100vh;

  .course-map {
    position: relative;
    width: 100%;
    height: 100%;

    .course-map-mask {
      position: absolute;
      width: 100vw;
      height: 100vh;
      background: url("@{imgUrl}img_mask.png");
      background-size: 100% 100%;
      z-index: 2;
    }

    .course-chapter {
      position: absolute;
      font-size: 0;
      z-index: 2;

      .course-bubble {
        display: inline-flex;

        .course-chapter-state {
          margin-right: -1px;
          &.lock {
            padding-right: 0;
            margin-right: 0;
          }
          .chapter-unlock {
            position: absolute;
            transform: translateX(-40%) translateY(40%);
            width: 44px;
            height: 54px;
            background: url("@{imgUrl}icon_unlock.png");
            background-size: 100% 100%;
          }
          .chapter-finish {
            position: absolute;
            top: -60px;
            transform: translateX(-40%);
            width: 73px;
            height: 136px;
            background: url("@{imgUrl}icon_finish.png");
            background-size: 100% 100%;
          }
          .chapter-lock {
            position: absolute;
            transform: translateX(-40%) translateY(40%);
            width: 44px;
            height: 54px;
            background: url("@{imgUrl}icon_lock.png");
            background-size: 100% 100%;
          }
          // .chapter-new {
          //   position: absolute;
          //   right: 8px;
          //   transform: translateY(57px);
          //   width: 60px;
          //   height: 44px;
          //   background: url("@{imgUrl}img_unit_new.png");
          //   background-size: 100% 100%;
          // }
        }
        .course-chapter-title {
          margin-right: -1px;
          font-size: 40px;
          font-weight: bold;
          font-family: @font;
          text-align: left;

          .course-text {
            line-height: 100px;
            padding-right: 1px;
          }
          &.lock {
            padding-right: 0;
            margin-right: 0;
          }
        }
        &.lock {
          .course-chapter-state {
            margin-right: 0;
          }
          .course-chapter-title {
            margin-right: 0;
          }
        }
      }
      .course-chapter-progress {
        margin-top: -15px;
        font-size: 28px;
        font-family: @font;
        color: #ffffff;
      }

      &.chapter-new::before {
        content: " ";
        position: absolute;
        display: block;
        right: 8px;
        transform: translateY(57px);
        width: 60px;
        height: 44px;
        background: url("@{imgUrl}img_unit_new.png");
        background-size: 100% 100%;
      }
    }
    .course-unit {
      position: absolute;
      .course-unit-pic {
        width: 226px;
        height: 156px;
        border-radius: 2px;
      }

      .course-unit-title {
        float: left;
        margin-top: 18px;
        transform: translateX(-50%);
        font-size: 30px;
        font-family: @font;
        font-weight: bold;
        color: #ffffff;
        line-height: 30px;
        white-space: nowrap;
      }
    }
  }
}
.course-mask {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  z-index: 2;
  &.islocked {
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
    &.show {
      display: block;
    }
  }
  &.nopublish {
    display: block;
    width: 100vw;
    height: 100vh;
    background: url("@{imgUrl}img_unpublished.png") center no-repeat;
    background-size: 100% 100%;
    .course-hotballon {
      position: absolute;
      left: percentage(401 / @baseWidth);
      top: percentage(344 / @baseHeight);
      display: none;
      width: 1029px;
      height: 688px;
      background: url("@{imgUrl}img_unpublished_popup.png") center no-repeat;
      background-size: 100% 100%;
      &.show {
        display: block;
      }
    }
  }
}

.course-book-single {
  display: inline-flex;
  position: absolute;
  top: 60px;
  left: 30px;
  width: 209px;
  height: 115px;
  z-index: 2;

  .course-book-btn {
    margin: 40px 0;
    width: 30px;
    height: 30px;
    background: url("@{imgUrl}icon_open.png") center no-repeat;
    background-size: 100% 100%;
  }
  .course-book-open {
    margin-left: 8px;
    width: 171px;
    height: 115px;
  }
  .course-book-seq {
    .seq();
    top: 5px;
    right: 8px;
    // padding: 3px;
    width: 12px;
    height: 12px;
    font-size: 12px;
    line-height: 12px;
  }
}

.course-book-bar {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  height: 100vh;
  width: 460px;
  z-index: 2;
}

.course-book-bar::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-filter: blur(20px);
  -moz-filter: blur(20px);
  -o-filter: blur(20px);
  -ms-filter: blur(20px);
  filter: blur(20px);
  margin: -30px;
}

.course-book-bar {
  &.book-in {
    transform: translateX(0px);
    transition: all 0.5s ease-in-out;
  }
  &.book-out {
    transform: translateX(-460px);
    transition: all 0.5s ease-in-out;
  }
  .course-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 26px;
    height: 26px;
    background: url("@{imgUrl}icon_close.png") center no-repeat;
    background-size: 100% 100%;
  }
}
.course-books-outer {
  position: fixed;
  top: 0;
  left: 0;
  width: 460px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.3);
  z-index: 2;

  .course-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: url("@{imgUrl}icon_close.png") center no-repeat;
    background-size: 100% 100%;
  }
  .course-books-inner {
    margin-top: 56px;
    width: 460px;
    height: 1426px;
    overflow: auto;

    .course-book {
      position: relative;
      margin: 0 auto;
      margin-top: 48px;
      width: 300px;
      height: 202px;
      background-size: 100% 100%;

      .course-book-seq {
        .seq();
      }

      //当前课本
      &.current {
        box-shadow: -20px 0px 20px rgba(255, 255, 255, 0.3),
          0px -20px 20px rgba(255, 255, 255, 0.3),
          20px 0px 20px rgba(255, 255, 255, 0.3),
          0px 20px 20px rgba(255, 255, 255, 0.3);
      }
      //已完成课本
      &.finish::after {
        content: "";
        position: absolute;
        display: block;
        margin: 122px 0 0 205px;
        width: 145px;
        height: 110px;
        background: url("@{imgUrl}img_book_finish.png") center no-repeat;
        background-size: 100% 100%;
      }
      &.over::after {
        content: "";
        position: absolute;
        display: block;
        width: 300px;
        height: 202px;
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.3) url("@{imgUrl}img_over.png") no-repeat;
        background-position: 0 122px;
        background-size: 27%;
      }
      &.new {
        box-shadow: -20px 0px 20px rgba(255, 255, 255, 0.3),
          0px -20px 20px rgba(255, 255, 255, 0.3),
          20px 0px 20px rgba(255, 255, 255, 0.3),
          0px 20px 20px rgba(255, 255, 255, 0.3);
      }
      &.new::after {
        content: "";
        position: absolute;
        display: block;
        margin: 158px 0 0 -2px;
        width: 60px;
        height: 44px;
        background: url("@{imgUrl}img_book_new.png") center no-repeat;
        background-size: 100% 100%;
      }
    }
    div:first-child {
      .course-book {
        margin-top: 14px;
      }
    }
  }
}

.course-toolbar {
  position: relative;
  position: absolute;
  top: 60px;
  right: 70px;
  width: 240px;
  height: 100px;
  z-index: 3;

  div {
    width: 100px;
    height: 100px;
    z-index: 2;
  }

  .course-task {
    position: absolute;
    background: url("@{imgUrl}btn_task_normal.png") center no-repeat;
    background-size: 100% 100%;
  }

  .course-personal {
    position: absolute;
    left: 140px;
    background: url("@{imgUrl}btn_personal_normal.png") center no-repeat;
    background-size: 100% 100%;
  }

  //override vux
  .vux-badge {
    float: right;
    width: 34px;
    height: 34px;
    border-radius: 100%;
    background-color: #e60012;
    font-size: 24px;
    font-family: @font;
    line-height: 34px;
  }
}
</style>
