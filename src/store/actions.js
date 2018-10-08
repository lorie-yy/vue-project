// import { login } from 'api/getData';
// import { resolve } from 'dns';
export default {
    toggleLoadShowFullScreen({ commit }, isShow) {
        // commit('LOADSHOW', isShow);
        if (!isShow) {
            setTimeout(() => {
                commit('LOADSHOW', isShow);
            }, 600);
        } else {
            commit('LOADSHOW', isShow);
        }
    },
    toggleLoadShow({ commit }, isShow) {
        if (!isShow) {
            setTimeout(() => {
                commit('SHOW', isShow);
            }, 600);
        } else {
            commit('SHOW', isShow);
        }
    },

    showTost({ commit }, isShow) {
        if (!isShow) {
            setTimeout(() => {
                commit('SHOW_TOAST', isShow);
            }, 600);
        } else {
            commit('SHOW_TOAST', isShow);
        }
    },
    toggleLoadShow({ commit }, isShow) {
        if (!isShow) {
            setTimeout(() => {
                commit('SHOW', isShow);
            }, 0);
        } else {
            commit('SHOW', isShow);
        }
    },

    getUnfinishedCount({ commit }, count) {
        commit('GET_UNFINISHED_TASK', count);
    },

    setBookSequence({ commit }, index) {
        commit('SET_BOOK_SEQUENCE', index);
    },

    setUnitSequence({ commit }, index) {
        commit('SET_UNIT_SEQUENCE', index);
    },

    toastShow({ commit }, isShow) {
        commit('TOAST_SHOW', isShow);
    }
};