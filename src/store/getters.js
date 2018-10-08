let getters = {
    show: state => state.loadShow,
    loadShow: state => state.loadShowFullScreen,
    userCenterCom: state => state.userCenterCom,
    haveBooks: state => state.books && Object.values(state.books),
    unFinishedTask: state => state.unFinishedTask,
    bookSequence: state => state.bookSequence,
    unitSequence: state => state.unitSequence,
    mobile: state => state.mobile,
    tShow: state => state.tShow,
    isOpenService: state => state.isOpenService,


    confrimBoxShow: state => state.confrimBox.isShow,
    confirmBoxBtnType: state => state.confrimBox.btnType,
    confirmBoxHaveCancel: state => state.confrimBox.haveCancel,
    confrimBoxContent: state => state.confrimBox.content,
    confirmBoxFallback: state => state.confrimBox.fallback,
    confirmBoxFullCover: state => state.confrimBox.fullCover
};

export default getters;