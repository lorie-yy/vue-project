import 'assets/js/clamp';

export function btnCountdown(vueObj, { btnDisable, btnText, allowChangeStatus }) {
    // console.log('进来了');
    vueObj[btnDisable] = true;
    vueObj[allowChangeStatus] = false;
    let countDown = 60;
    let timer;
    timer = setInterval(() => {
        countDown--;
        if (countDown === 0) {
            clearInterval(timer);
            vueObj[btnText] = '重新获取';
            vueObj[btnDisable] = false;
            vueObj[allowChangeStatus] = true;
        } else {
            vueObj[btnText] = `(${countDown}s)重新获取`;
        }
    }, 1000);
}

export function groupBy(array, attr) {
    const groups = {};
    array.map(item => {
        const group = JSON.stringify(item[attr]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
    });
    return groups;
}

export function CourseFinished() {

}
export function CourseExit() {

}
export function strRmQuotation(str) {
    if (!str) return '';
    return str.replace(/\"/g, '');
}
export function nextSwitchData(dataArr, index) {
    index++;
    let idx = index >= dataArr.length ? 0 : index;
    return index - 1 == idx ? {} : dataArr[idx];
}

export function setFontSize(e, size) {
    // console.log(e)
    let clientHeight = document.documentElement.clientHeight;
    let minHeight = 1536 * 12 / size;
    let ratio = 1;
    if (clientHeight < minHeight) {
        ratio = clientHeight / minHeight;
    }
    // console.log(ratio)
    return {
        transform: 'scale(' + ratio + ')'
    };
}
export function setInputFont(parentClass) {
    const classSelector = `${parentClass} .vux-x-input .weui-cell__bd`
    let addInput = document.querySelectorAll(classSelector)
    const targetFont = window.innerHeight * 46 / 1536;
    const scale = targetFont / 12
    Array.from(addInput).forEach((item) => {
        if (targetFont < 12 && item.offsetHeight !== 0) {
            item.style.transform = 'scale(' + scale + ')';
            item.style.transformOrigin = '0% 50%';
            item.style.height = `${item.offsetHeight/scale}px`
            item.style.width = `${item.offsetWidth/scale}px`
        }
    })
}

export function jsonToUrl(json) {
    if (!json instanceof Object) return "";
    let arr = [];
    Object.keys(json).forEach(key => {
        arr.push(`${key}=${encodeURIComponent(json[key]).replace(/'/g,'%27')}`)
    })
    return arr.join('&')
}

export function setAppHeight() {
  // console.log(window.innerHeight);
  document.getElementsByTagName('body')[0].style.height = window.innerHeight + 'px';
}
function toFixed(number, precision) {
    let multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
}

export function getViewPoint(pixels, clientHeight = 1536) {
    return toFixed(pixels * 100 / clientHeight, 3) + 'vh';
}

export function setBubbleWidth(el) {
    let text = el.children[0];
    let pixels = el.getBoundingClientRect().width.toFixed(2);
    let vw = parseFloat(getViewPoint(pixels, document.documentElement.clientHeight));
    let maxVw = parseFloat(getViewPoint(350));
    
    if (vw > maxVw) {
        el.style.width = getViewPoint(350);
        text.style.fontSize = getViewPoint(30);
        text.style.lineHeight = getViewPoint(80);
        if (vw * 0.75 > maxVw) {
            text.style.paddingTop = getViewPoint(13);
            text.style.paddingBottom = getViewPoint(4);
            text.style.lineHeight = getViewPoint(36);
            text.style.wordWrap = 'break-word';
            $clamp(text, { clamp: 2 });
        } else {
            text.style.paddingTop = getViewPoint(14);
        }
    }
}