
import { groupBy } from 'lodash';
const BOOK_LEVEL = {
    '书本': 1,
    '模块': 2,
    '单元': 3,
    '环节': 4,
    '应用': 5
};
export function dataFormatter(res) {
    let bookArr = [];
    for (let book of res) {
        book.studyExerciseAssessList = book.studyExerciseAssessList.filter(obj => {
            return !obj.isHide;
        });
        if (book.studyExerciseAssessList.length) {
            let directories = groupBy(book.studyExerciseAssessList, 'levelName');
            directories = JSON.parse(JSON.stringify(directories));
            let books = [book];
            // let books = directories[BOOK_LEVEL['书本']];
            let units = directories[BOOK_LEVEL['单元']];
            let modules = directories[BOOK_LEVEL['模块']];
            let segments = (directories[BOOK_LEVEL['应用']] || []).concat(directories[BOOK_LEVEL['环节']] || []);

            let segmentsTree = getTreeFromList(segments, '_id', 'pid');
            let unitsTree = getTreeFromList(units, '_id', 'pid');
            let booksAndUnits = books ? books.map(el => {
                //当前课本下的模块集合
                let curMoudles = modules.filter(module => module.pid === el.bookId);
                //属于当前模块集合中的单元
                el.units = mergeSameLevelTree(
                    unitsTree.filter(rootUnit => curMoudles.find(module => module._id === rootUnit.pid)),
                    'title',
                    mergeFunction);
                addTitleToChildUnit(el.units);

                return el;
            }) : [];
            
            let modulesAndSegments = groupBy(segmentsTree, 'pid');
            bookArr.push({ booksAndUnits, modulesAndSegments });
        } else {
            bookArr.push({ booksAndUnits: [book], modulesAndSegments: {} });
        }
    }

    return bookArr;
}

function addTitleToChildUnit(units) {
    if (!units || !units.length)
        return;
    for (let unit of units) {
        if (unit.children.length) {
            for (let u of unit.children) {
                u.pTitle = unit.title;
            }
        }
    }
    return units;
}

function mergeFunction(nodes) {
    let fisrtNode = nodes.shift();
    fisrtNode._id = [fisrtNode._id];
    fisrtNode.oid = [fisrtNode.oid];
    fisrtNode.children = fisrtNode.children ? fisrtNode.children : [];
    return nodes.reduce((result, cur) => {
        result.children = cur.children ? result.children.concat(cur.children) : result.children;
        result.oid = [...result.oid, cur.oid];
        result._id = [...result._id, cur._id];
        //子单元
        if (result.levelName === 3) {
            // ACT
            if (result.modularName === '课后学习') {
                result.rank = result.rank;
            }
            if (cur.modularName === '课后学习') {
                result.rank = cur.rank;
            }
        }
        return result;
    }, fisrtNode);
}

function getTreeFromList(
    list,
    keyAttr = 'key',
    pKeyAttr = 'pKey',
    childrenAttr = 'children') {
    let dec = groupBy(list, pKeyAttr, true);
    let result = [];
    for (let key in dec) {
        for (let i = 0; i < dec[key].length; i++) {
            if (isRoot(dec[key][i])) {
                result.push(dec[key][i]);
            }
            if (dec[key][i]['levelName'] !== 5) {
                if (dec[key][i]['levelName'] === 4 && dec[dec[key][i][keyAttr]]) {
                    dec[dec[key][i][keyAttr]][0]['modularName'] = dec[key][i]['modularName'];
                }
                dec[key][i][childrenAttr] = dec[dec[key][i][keyAttr]];
            }
        }
    }
    

    function isRoot(node) {
        return !list.find(el => {
            el[keyAttr] === node[pKeyAttr]
        })
    }
    return result;
}

function mergeSameLevelTree(forest, attr, mergeFunciton) {
    let newForest = merge(forest);
    return newForest;

    function merge(forest) {
        let group = groupBy(forest, attr);
        return Object.values(group).map(nodes => mergeFunciton(nodes)).map(tree => {
            tree.children = tree.children ? merge(tree.children) : [];
            return tree;
        });
    }
}