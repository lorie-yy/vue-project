export default {
    // 确认取消框
    TOGGLE_CONFIRM_BOX(state, boxData) {
      if (boxData.isShow) {
          state.confrimBox = Object.assign({}, state.confrimBox, boxData)
      } else {
          state.confrimBox.isShow = boxData.isShow;
      }
    },
    LOADSHOW(state, isShow) {
      state.loadShowFullScreen = isShow;
    },
    SHOW(state, isShow) {
      state.loadShow = isShow;
    },

    TOGGLE_USER_COMPONENT(state, componentName) {
      state.userCenterCom = componentName;
    },
    SAVE_USER_MOBILE(state, mobile) {
      state.mobile = mobile
    },

    // 存储所有书籍
    SET_ALL_BOOKS(state, books) {
      state.books = books
    },
    GET_UNFINISHED_TASK(state, count) {
      state.unFinishedTask = count;
    },
    SET_BOOK_SEQUENCE(state, index) {
      state.bookSequence = index;
    },
    SET_UNIT_SEQUENCE(state, index) {
      state.unitSequence = index;
    },

    TOAST_SHOW(state, isShow) {
      state.tShow = isShow;
    },

    SET_SERVICE_OPEN(state, isOpen) {
      state.isOpenService = isOpen;
    },
    SAVE_HEIGHT(state, height) {
      state.appHeight = height
    },
    SET_HEIGHT(state) {
      document.getElementsByTagName('body')[0].style.height = state.appHeight + 'px';
    }
};