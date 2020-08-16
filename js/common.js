/**
 * ログUtil
 */
function logging(processName, message) {
    console.log('[' + processName + '] ' + message);
}

var loggingMarkCount = 0;
/**
 * ログUtil(目立つラインをつけて目印にする)
 */
function loggingMark(message) {
    console.log(++loggingMarkCount + '----------------------------------------- ' + message + ' ----------------------------------------- ');
}

/**
 * ログUtil(オブジェクトの内容出力)
 */
function loggingObj(processName, object) {
    console.log('[' + processName + '] ');
    console.dir(object);
}

/**
 * srcの読み込みを待ってからcallbackを実行する
 */
function loadScript(src, callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState ||
            this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            if (head && script.parentNode) {
                head.removeChild(script);
            }
        }
    };
}

