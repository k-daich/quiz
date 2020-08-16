logging('ajaxSentence.js', 'loaded');

var TYPE = {
    noInput: 1,
    radio: 2,
    select: 3,
    checkBox: 4,
    textBox: 5,
    textArea: 6
}

// ajaxの結果オブジェクトを格納する変数
var gl_sentence;

/**
 * フォームのAjax送信処理
 */
(function () {
    logging('loadSentence', 'start');
    var ajax_res;

    // TODO : get from GET param
    var _url = '/app/letter?sentence_id=903';

    // 送信
    $.ajax({
        type: 'GET',
        url: _url,
        // ajaxレスポンスオブジェクトをリターンさせたいので非同期で実施する
        async: false,

        // 送信前
        beforeSend: function(xhr, settings) {
            logging('loadSentence : ajax', 'beforeSend');
        },
        // 応答後
        complete: function(xhr, textStatus) {
            logging('loadSentence : ajax', 'complete');
        },

        // 通信成功時の処理
        success: function(result, textStatus, xhr) {
            logging('loadSentence : ajax', 'success');
            // 入力値を初期化
            loggingObj('loadSentence : result', result);
            gl_sentence = result;
        },

        // 通信失敗時の処理
        error: function(xhr, textStatus, error) {
            logging('ajaxForm : ajaxError', error);
        }
    });
})();