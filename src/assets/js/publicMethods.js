let _ = require('lodash');
class changeTaskCenterJson {
  constructor(StuLearnBooksData, PersonalCenterData, taskListData) {
    this.StuLearnBooksData = StuLearnBooksData;
    this.PersonalCenterData = PersonalCenterData;
    this.taskListData = taskListData;
    this.newHomeWordData = [];
    this.parseHomeWork();
    this.bindUnitBData();
    this.bindTaskData();
    let concatArr = this.newHomeWordData.concat(this.taskListData);
    this.orderSequentialDataFun(concatArr);
    this.UncompleteDataFun(concatArr);
  }

  orderSequentialDataFun(concatArr) {
    let unCompeletData = [];
    let compeletData = [];
    for (let item of concatArr) {
      if (item.appCount && item.appCount !==0) {
        if (!item.isComplete && !item.finished) {
          unCompeletData.push(item)
        } else {
          compeletData.push(item)
        }
      }

    }
    this.cardDetailData = (_.orderBy(unCompeletData, ['beginTime'], ['desc'])).concat(_.orderBy(compeletData, ['beginTime'], ['desc']))
  }

  parseHomeWork() {
    for (let bookId in this.StuLearnBooksData) {
      for (let boolksObj of this.StuLearnBooksData[bookId].booksAndUnits) {
        if (boolksObj.units && boolksObj.units.length > 0) {
          for (let unitA of boolksObj.units) {
            for (let unitB of unitA.children) {
              unitB.teachingMaterialName = boolksObj.teachingMaterialName;
              unitB.uncertainName = boolksObj.title;
              unitB.pTitle = unitA.title;
              unitB.classId = boolksObj.classId;
              unitB.children = this.addUnitBChildren(unitB, this.StuLearnBooksData[bookId].modulesAndSegments)
              unitB.isUnitLocked ? undefined : this.newHomeWordData.push(unitB);
            }
          }
        }
      }
    }
  }
  addUnitBChildren(unitB, moduleAndSegments) {
    //this.localApplicationIdArr = JSON.parse(sessionStorage.getItem('hasDoneApp'))
    let applicationArr = [];
    for(let unitBid of unitB._id) {
      for (let idKey in moduleAndSegments) {
        if (Number(idKey) === Number(unitBid)){
          let segmentArr = moduleAndSegments[idKey]
          for (let segment of segmentArr) {
            if (segment.children) {
              for (let application of segment.children) {
                //this.judgeLocalAllpicationFun(application)
                applicationArr.push(application)
              }
            }
          }
        }
      }
    }
    return applicationArr
  }

  judgeLocalAllpicationFun(application) {
    if (this.localApplicationIdArr) {
      for (let localId of this.localApplicationIdArr) {
        if (Number(application._id) === Number(localId)) {
          application.isComplete = true;
        };
      }
    }
  }


  bindUnitBData() {
    for (let homeWorkItem of this.newHomeWordData) {
      let i = 0;
      for (let item of homeWorkItem.children) {
        if (item.isComplete) {
          i++;
        }
      }
      homeWorkItem.appCount = homeWorkItem.children.length;
      homeWorkItem.finishedCount = i;
      homeWorkItem.isHomeWork = true;
      homeWorkItem.beginTime ? homeWorkItem.beginTime = (new Date(homeWorkItem.beginTime)).getTime() : undefined;
      homeWorkItem.completeTime ? homeWorkItem.completeTime = (new Date(homeWorkItem.completeTime)).getTime() : undefined;
      for (let PersonalItem of this.PersonalCenterData.classTeacherList) {
        if (Number(homeWorkItem.classId) === Number(PersonalItem.classId)) {
          homeWorkItem.className = PersonalItem.className;
        }
      }
    }
  }

  bindTaskData() {
    for (let item of this.taskListData) {
      item.publishTime ? item.beginTime = (new Date(item.publishTime)).getTime() : undefined;
      item.finished ? item.completeTime = (new Date(item.finishTime)).getTime() : item.completeTime = false;
      item.endTime ? item.endTime = (new Date(item.endTime)).getTime() : undefined;
    }
  }

  UncompleteDataFun(concatArr) {
    let unOrderData = [];
    for (let item of concatArr) {
      if (!item.isComplete && !item.finished && item.appCount !==0) {
        unOrderData.push(item)
      }
    }
    this.UncompleteData = _.orderBy(unOrderData, ['beginTime'], ['desc'])
  }
}

class changeTaskListJson {
  constructor(oldArr, isOverdue) {

    this.oldArr = oldArr;
    this.isOverdue = isOverdue;
    this.removeMultArrFun();
    this.saveLocalFun();
  }

  removeMultArrFun () {
    let multUnitArr = [];
    this.oldArr.forEach(item => {
      multUnitArr.push(item.unitBObjectId);
    });
    this.unitArr =  Array.from(new Set(multUnitArr));
    this.setObjFun();
  }

  setObjFun() {
    this.dataObj = {};
    this.unitArr.forEach(item => {
      this.dataObj[item] = {};
      this.dataObj[item].children = [];
    });
    return this.addDataFun();
  }

  addDataFun() {
    this.oldArr.forEach(item => {
      for(let key in this.dataObj) {
        if (item.unitBObjectId === key) {
          this.dataObj[key].children.push(item);
        }
      }
    });
    this.bindActiveArrFun();
    this.bindDataFun();
  }

  bindActiveArrFun() {
    this.activeArr = [];
    for(let key in this.dataObj) {
      if (Array.isArray(this.dataObj[key].children)) {
        for(let item of this.dataObj[key].children) {
          this.activeArr.push(item);
        }
      }
    }

    for(let item of this.activeArr) {
      if (!item.finished) {
        item.isActive = true;
        this.activeData = item.applicationId;
        return;
      }
    }
  }

  bindDataFun() {
    for (let key in this.dataObj) {
      if (this.dataObj[key].children && this.dataObj[key].children[0]) {
        this.dataObj[key].unitAName = this.dataObj[key].children[0].unitAName;
        this.dataObj[key].unitBName = this.dataObj[key].children[0].unitBName;
        this.bindDataObjActiveFun();
        this.dataObj[key].isAllFinish = this.AllFinishFun(this.dataObj[key].children);
      } else {
        console.log('没有单元B的子集');
      }
    }
    this.dataObj;
  }

  AllFinishFun(childrenArr) {
    let sign = false; 
    childrenArr.forEach(item => {
      if (item.finished || item.isActive) {
        sign = true;
      }
    });
    return sign;
  }

  bindDataObjActiveFun() {
    for (let key in this.dataObj) { 
      this.dataObj[key].children.forEach(item => {
        if(Number(item.applicationId) === Number(this.activeData)) {
          item.isActive = true;
        }
      });
    }
  }

  saveLocalFun() {
    let localArr = []
    for (let unitBkey in this.dataObj) {
      this.dataObj[unitBkey].children.forEach(unitBItem => {
        let Obj = {};
        Obj.applicationId = unitBItem.applicationId;
        Obj.applicationName = unitBItem.applicationName;
        Obj.modularName = unitBItem.modularName;
        localArr.push(Obj)
      })
    }
    localStorage.setItem('appIds', JSON.stringify(localArr));
  }
}
export {
  changeTaskCenterJson,
  changeTaskListJson
};