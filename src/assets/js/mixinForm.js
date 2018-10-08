import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      tooltipData: {

      },
      formData: {

      },
      sendDisabled: false,
      imgCurrent: {
        imgSubmit: null
      },
      imgList: {
        imgSubmit1: null,
        imgSubmit2: null
      }
    }
  },
  mounted() {
    for(const k in this.imgCurrent) {
      this.imgCurrent[k] = this.imgList[`${k}1`];
    }
  },
  methods: {
    ...mapMutations(['SET_HEIGHT']),
    _validateForm(formData) {
      return new Promise((resolve) => {
        for(const k in formData) {
          this._validate(k, this.tooltipData, formData);
          if(!this.tooltipData[k].pass) {
            resolve(false);
          }
        }
        resolve(true);
      });
    },
    handleFocus(name) {
      // setAppHeight();
      this.SET_HEIGHT()
      this.$refs[name].$el.classList.add('active');
      this.imgCurrent[`img_${name}`] = this.imgList[`img_${name}2`];
    },
    handleBlur(name) {
      this.$refs[name].$el.classList.remove('active');
      this.imgCurrent[`img_${name}`] = this.imgList[`img_${name}1`];      
      this._validate(name, this.tooltipData, this.formData);
    },
    _validate(){}
  },
  computed: {
    
    btnDisable() {
      return Object.values(this.formData).some(v=>!v);
    }
  },
  watch: {
    btnDisable(newVal) {
      if(newVal) {
        this.imgCurrent.imgSubmit = this.imgList.imgSubmit1;
      }else {
        this.imgCurrent.imgSubmit = this.imgList.imgSubmit2;
      }
    }
  }
}