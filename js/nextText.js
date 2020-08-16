logging('nextText.js', 'loaded');

$(window).on('load', function() {
    nextText();
}); 

var currentDispTextIndex = 0;
function nextText() {
    logging('nextText.js', 'start');
    animate.imageEle = $('#i_image-wrap');
    loggingObj('animate.imageEle', animate.imageEle);
    animate.textEle = $('#i_subtitles');
    loggingObj('animate.textEle', animate.textEle);
    animate.formEle = $('#i_subsForm-wrap');
    loggingObj('animate.formEle', animate.formEle);

    loadScript('/quiz/js/ajaxSentence.js?query=1', function() {
        // subtitles-wrapをクリックされた場合のイベントリスナーを追加
        $('#i_subtitles-wrap').on("touchstart", mdown);
        $('#i_subtitles-wrap').on("mousedown", mdown);
    });
}

/**
 * 以降、ファンクション
 */
const dispSpeed = 50; // 1文字を表示する際のミリ秒
/**
 * アニメーション
 */
var animate = {
    // 処理中フラグ
    isRunning: false,
    // 二重起動フラグ
    isDuplicate: false,
    // 表示する情報
    pageInfo: null,
    // イメージ表示箇所
    imageEle: null,
    // テキスト表示箇所
    textEle: null,
    // フォーム表示箇所
    formEle: null,
    /*
     * アニメーションの実行手続き
     */
    run: function() {
        // 処理中フラグを立てる
        animate.isRunning = true;
        animate.dispImage();
        animate.nbspSet(animate.pageInfo.text.split(/\n/));
        logging('replStr', animate.pageInfo.text.replace(/\n/g, ''));
        animate.dispLikeTypeWriter(0, Array.from(animate.pageInfo.text.replace(/\n/g, '')));
    },

    /*
     * 画像を表示する
     */
    dispImage: function() {
        logging('dispImage: image', animate.pageInfo.image);
        if (animate.pageInfo.image != "") {
            animate.imageEle.html('<img border="0" src="/letter/img/' + animate.pageInfo.image + '" width="128" height="128" alt="イラスト1">');
            // 隠されていたイメージ要素を見せる
            setTimeout(show , 1000, animate.imageEle);
        }
    },

    /*
     * 表示する文字分だけのnbspを設定する
     */
    nbspSet: function(text_array) {
        var init_html = '';
        for (index in text_array) {
            var textByte = text_array[index].length + amountOfZenkaku(text_array[index]);
            init_html = init_html + ((index == 0) ? '' : '<br>') + ''.padStart(textByte * '&nbsp;'.length, '&nbsp;');
        }
        logging('init_html', init_html);
        // 初期表示：表示する文章と同じ文字数の半角スペースを設定
        animate.textEle.html(init_html);
    },

    /**
     * タイプライターのようにnbspを一文字ずつ置換して文字を表示させていく
     */
    dispLikeTypeWriter: function(index, replcStr) {
        // 二重起動した場合 OR 全ての表示が完了した場合
        if (animate.isDuplicate || replcStr.length == index) {
            // フォームを表示する
            animate.dispForm();
            // 処理中フラグを落とす
            animate.isRunning = false;
            return;
        }
        // "全角一文字"⇔"nbsp2つ"を置換
        if (isZenkaku(replcStr[index])) {
            animate.textEle.html(animate.textEle.html().replace('&nbsp;&nbsp;', replcStr[index]));
            // "半角一文字"⇔"nbsp1つ"を置換
        } else {
            animate.textEle.html(animate.textEle.html().replace('&nbsp;', replcStr[index]));
        }
        setTimeout(animate.dispLikeTypeWriter, dispSpeed, ++index, replcStr);
    },

    /**
     * 即時に文字を全表示する
     */
    allDisp: function() {
        animate.textEle.html(animate.pageInfo.text.replace(/\n/g, '<br>'));
        // 二重起動フラグを落とす
        animate.isDuplicate = false;
    },

    /**
     * 即時に文字を全表示する
     */
    dispForm: function() {
        switch (animate.pageInfo.form_type) {
            case TYPE.noInput:
                logging('dispForm', 'TYPE.noInput');
                break;
            case TYPE.radio:
                logging('dispForm', 'TYPE.radio');
                animate.formEle.html(animate.buildRadioForm());
                break;
            case TYPE.select:
                logging('dispForm', 'TYPE.select');
                animate.formEle.html(animate.buildSelectForm());
                break;
            case TYPE.checkBox:
                logging('dispForm', 'TYPE.checkBox');
                animate.formEle.html(animate.buildCheckBoxForm());
                break;
            case TYPE.textBox:
                logging('dispForm', 'TYPE.textBox');
                animate.formEle.html(animate.buildTextBoxForm());
                break;
            case TYPE.textArea:
                logging('dispForm', 'TYPE.textArea');
                animate.formEle.html(animate.buildTextAreaForm());
                break;
            default:
                logging('dispForm', 'TYPE is unExpected : ' + animate.pageInfo.form_type);
                throw new Error("表示情報形式不正：typeが想定外値");
                break;
        }
        addAjaxFormEvent();
        show(animate.formEle);
    },

    /**
     * ラジオボタンのHTMLコードを生成する
     */
    buildRadioForm: function() {
        // 初期値設定：開始タグ
        var sBuild = '<form id="i_subsForm" class="c_subsForm_radio">';

        // データ分繰り返し：ラジオボタン
        for (var c of animate.pageInfo.choice) {
            sBuild = sBuild + '<input name="f_radio" type="radio" value="' + c.value + '" class="c_f_radio"><label>' + c.label + '</label>';
        }
        // 閉じタグ
        return sBuild + '</form>';
    },

    /**
     * セレクトボタンのHTMLコードを生成する
     */
    buildSelectForm: function() {
        // 初期値設定：開始タグ
        var sBuild = '<form id="i_subsForm" class="c_subsForm_select"><select name="f_select">';

        // データ分繰り返し：セレクトボタン
        for (var c of animate.pageInfo.choice) {
            sBuild = sBuild + '<option value="' + c.value + '" class="c_f_select">' + c.label + '</option>';
        }
        // 閉じタグ
        return sBuild + '</select></form>';
    },

    /**
     * チェックボックスのHTMLコードを生成する
     */
    buildCheckBoxForm: function() {
        // 初期値設定：開始タグ
        var sBuild = '<form id="i_subsForm" class="c_subsForm_checkbox">';

        // データ分繰り返し：チェックボックス
        for (var c of animate.pageInfo.choice) {
            sBuild = sBuild + '<input type="checkbox" name="f_checkbox" value="' + c.value + '" class="c_f_checkbox"><label>' + c.label + '</label></input>';
        }
        // 閉じタグ
        return sBuild + '</form>';
    },


    /**
     * テキストボックスのHTMLコードを生成する
     */
    buildTextBoxForm: function() {
        // 初期値設定：開始タグ
        var sBuild = '<form id="i_subsForm" class="c_subsForm_textbox">';

        // データ分繰り返し：テキストボックス
        for (var i in animate.pageInfo.inputs) {
            // 最初のデータ以外の場合：brを入れる
            if (i != 0) sBuild = sBuild + '<br>';
            // inputタグの追加
            sBuild = sBuild + '<label>' + animate.pageInfo.inputs[i].label + '</label><input type="text" name="f_textbox" value="' + animate.pageInfo.inputs[i].initValue + '" maxlength="' + animate.pageInfo.inputs[i].maxLength + '" class="c_f_textbox"></input>';
        }
        // 閉じタグ
        return sBuild + '</form>';
    },

    /**
     * テキストエリアのHTMLコードを生成する
     */
    buildTextAreaForm: function() {
        // 初期値設定：開始タグ
        return '<form id="i_subsForm" class="c_subsForm_textarea" onsubmit="console.log(\'pushed btn\');return false;">\
        <label> ' + animate.pageInfo.label +
            '<textarea cols="' + animate.pageInfo.cols + '" rows="' + animate.pageInfo.rows + '" maxLength="' + animate.pageInfo.maxlength + '" name="f_textarea" class="c_f_textarea">' +
            animate.pageInfo.initValue +
            '</textarea></label><br>\
            <button id="i_subsForm_btn" method="get" type="submit" name="example" ajax_url="/git/letter/test/docs/template/ajaxResponse.html" value="ボタン">button</button></form>';
    }
}

/**
 * 指定位置の文字を入れ替える
 */
function repalaceAt(str, index, char) {
    return str.slice(0, index) + char + str.slice(index + 1, str.length);
}

// マウスダウンした時に発火
function mdown(event) {
    logging('mdown', 'start by ' + event.type);
    loggingObj('mdown : gl_sentence' , gl_sentence);
    // 二重起動中は何もしない
    if (animate.isDuplicate) {
        return;
    }
    // アニメーションが実行中の場合
    else if (animate.isRunning) {
        // 二重起動フラグを立てる
        animate.isDuplicate = true;
        // 全ての文字を即時表示させる
        // ※アニメーションの処理中であることを考慮し、ループ時間+αミリ秒だけ待機してから実行する
        setTimeout(animate.allDisp, dispSpeed + 100);
    }
    // 上記以外
    else {
        // 現在の表示が文章の最後だった場合は処理終了
        if (gl_sentence.tPageList.length == currentDispTextIndex) return;
        // イメージ要素を初期化
        initWhenClicked(animate.imageEle);
        // フォーム要素を初期化
        initWhenClicked(animate.formEle);
        // 次の表示情報を設定する
        animate.pageInfo = gl_sentence.tPageList[currentDispTextIndex++];
        // 表示処理を実行する
        animate.run();
    }
}

/**
 * 以降、Util
 */
function amountOfZenkaku(str) {
    logging('amountOfZenkaku : str', str);
    logging('amountOfZenkaku : han_Len', str.replace(/[^\x01-\x7E\xA1-\xDF]/g, '').length);
    return str.length - str.replace(/[^\x01-\x7E\xA1-\xDF]/g, '').length;
}

/**
 * 対象タグの初期化を行う
 * ・コンテンツを空にする
 * ・対象タグのshowクラスを削除する
 * ・対象タグを隠す
 */
function initWhenClicked(_$) {
    logging('init : _$.html', _$.html());
    // 内容を空に更新する
    _$.html('');
    logging('init : _$.html', _$.html());
    // showクラスを削除する
    _$.removeClass('show');
    // タグを隠す
    hide(_$);
}

/**
 * 対象タグを隠す
 */
function hide(_$) {
    _$.addClass('hide');
}


/**
 * 隠れていた対象タグを表示する
 */
function show(_$) {
    _$.removeClass('hide');
    _$.addClass('show');
}

function isZenkaku(char) {
    return (char.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) ? true : false;
}
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