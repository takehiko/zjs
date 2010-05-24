//////// 自由に書き換えてください:ここから ////////
var bell = new Array( // ベルセット(デフォルト)
    { 
        // [0] 予鈴1
        "ring": 1,          // 0:使用しない, 1:使用する
        "etime": 5 * 1000,  // 鳴らす時間(開始からのミリ秒)
        "wavtype": 1        // ベルの種類
    }, {
        // [1] 予鈴2
        "ring": 1,          // 0:使用しない, 1:使用する
        "etime": 10 * 1000, // 鳴らす時間(開始からのミリ秒)
        "wavtype": 1        // ベルの種類
    }, {
        // [2] 発表終了の鈴
        "ring": 1,          // 1:使用する
        "etime": 15 * 1000, // 鳴らす時間(開始からのミリ秒)
        "wavtype": 2        // ベルの種類
    }, {
        // [3] 討論終了の鈴
        "ring": 1,          // 0:使用しない, 1:使用する
        "etime": 20 * 1000, // 鳴らす時間(開始からのミリ秒)
        "wavtype": 3        // ベルの種類
    });

var timeColorLabelArray1 = new Array( // ラベルセット1
    {
        // [0] 開始前
        "timeColor": "#0f0",
        "statusLabel": "停止中"
    }, {
        // [1] 予鈴1まで
        "timeColor": "#0f0",
        "statusLabel": "発表残り時間"
    }, {
        // [2] 予鈴2まで
        "timeColor": "#6f0",
        "statusLabel": "発表残り時間"
    }, {
        // [3] 発表終了まで
        "timeColor": "#cf0",
        "statusLabel": "発表残り時間"
    }, {
        // [4] 質疑中
        "timeColor": "#ff0",
        "statusLabel": "質疑経過時間"
    }, {
        // [5] 質疑時間超過
        "timeColor": "#f33",
        "statusLabel": "質疑時間超過"
    }, {
        // [6] 発表時間超過
        "timeColor": "#f33",
        "statusLabel": "発表時間超過"
    });

var timeColorLabelArray2 = new Array( // ラベルセット2
    {
        // [0] 開始前
        "timeColor": "#0f0",
        "statusLabel": "停止中"
    }, {
        // [1] 予鈴1まで
        "timeColor": "#0f0",
        "statusLabel": "発表時間"
    }, {
        // [2] 予鈴2まで
        "timeColor": "#6f0",
        "statusLabel": "発表時間"
    }, {
        // [3] 発表終了まで
        "timeColor": "#cf0",
        "statusLabel": "発表時間"
    }, {
        // [4] 質疑中
        "timeColor": "#ff0",
        "statusLabel": "質疑時間"
    }, {
        // [5] 質疑時間超過
        "timeColor": "#f33",
        "statusLabel": "質疑時間超過"
    }, {
        // [6] 発表時間超過
        "timeColor": "#f33",
        "statusLabel": "発表時間超過"
    });

var titleArray = new Array( // タイトルバー
    "zjs: 発表時間はカウントダウン、質疑時間はカウントアップ",
    "zjs: 発表・質疑の合計時間をカウントアップ",
    "zjs"
);

var debugMode = false; // trueならデバッグモード
var noRing = false; // trueならベルを鳴らさない
var noKey = false; // trueならキー入力([5]など)無効
var noMouseOnClock = true; // trueなら時間の上のクリック(開始/停止/再開)無効
var noChangeTitle = false; // trueならタイトルバーは「zjs」固定

var bellwav = new Array(null, "chime1.wav", "chime2.wav", "chime3.wav"); // ベルのファイル

var digitScale = 21; // 文字表示の拡大率(ウィンドウ幅に対する割合，パーセンテージ; 0は拡大しない)
var minsecLabelScale = 3; // 「分」「秒」表示の拡大率(ウィンドウ幅に対する割合，パーセンテージ; 0は拡大しない)
//////// 自由に書き換えてください:ここまで ////////

var clockTick = false; // 時計が進んでいるならtrue
var etime1; // 経過時間1(ミリ秒)
var etime2; // 経過時間2(ミリ秒; 停止ボタンで0になる)
var etimeLastMark; // 経過時間(ミリ秒; 前回記録した時間)
var timeStart; // 計測開始時刻
var timeColorLabelArrayArray = new Array(timeColorLabelArray1, timeColorLabelArray2, timeColorLabelArray1);
var timeColorLabelArrayIndex = 2; // 時刻表示モード(0,1,2)
var timeColorLabelArray = timeColorLabelArrayArray[timeColorLabelArrayIndex]; // ラベルセット
var timeColor = timeColorLabelArray[0].timeColor; // 時刻表示の色
var statusLabel = timeColorLabelArray[0].statusLabel; // 時計状態の表示内容
var scrWidth; // 画面幅
var scrHeight; // 画面高さ
var myInterval = null; // setInterval保存
var readmeToggle = false; // readmeを表示しているならtrue
var timeTypeEsc = null; // Escapeを押した時刻(2度押しリセット用)
var logMessage = ""; // ログメッセージ(HTML)
var logToggle = false; // logを表示しているならtrue
var countMark = 0; // 経過時間の記録回数
var focusingText = false; // テキスト領域をフォーカスしていたらtrue
var keybindToggle = false; // keybindを表示しているならtrue
var timeTypeRing = null; // ベルキーを押した時刻(2度押し用)
var typeRing = 0; // 押したベルキー(2度押し用)

// スタイル変更
function changeStyle(id, style, value) {
    var obj = document.getElementById(id);
    if (obj) {
        obj.style[style] = value;
    }
}

// 時刻表示の色変更
function setTimeColor() {
    var timeColorLabelStatus;

    // bell[?].ring は 0:使用しない, 1:まだ鳴らしていない, 2:すでに鳴らした
    if (bell[3].ring == 2) {
        timeColorLabelStatus = 5;
    } else if (bell[2].ring == 2) {
        timeColorLabelStatus = (bell[3].ring == 0 ? 6 : 4);
    } else if (bell[1].ring == 2) {
        timeColorLabelStatus = 3;
    } else if (bell[0].ring == 2) {
        timeColorLabelStatus = 2;
    } else if (etime1 + etime2 > 0) {
        timeColorLabelStatus = 1;
    } else {
        timeColorLabelStatus = 0;
    }

    timeColor = timeColorLabelArray[timeColorLabelStatus].timeColor;
    statusLabel = timeColorLabelArray[timeColorLabelStatus].statusLabel;
    if (timeColorLabelStatus != 0 && !clockTick) {
        statusLabel = timeColorLabelArray[0].statusLabel;
    }

    changeStyle("time", "color", timeColor);
    document.getElementById("timestatus").innerHTML = statusLabel;
    changeStyle("timestatus", "color", timeColor);
}

// 時計表示
function displayTime(etime) {
    var dtime; // 経過時間(ミリ秒)

    if (timeColorLabelArrayIndex == 1) {
        dtime = etime; // 経過時間
    } else if (etime <= bell[2].etime) {
        dtime = bell[2].etime - etime; // 発表残り時間(ミリ秒)
    } else {
        dtime = etime - bell[2].etime; // 討論経過時間(ミリ秒)
    }
    var esec = Math.floor(dtime / 1000); // 表示する秒
    var emin = Math.floor(esec / 60); // 表示する分
    esec = esec % 60;

    eminStr = (emin < 10 ? "0" : "") + emin;
    esecStr = (esec < 10 ? "0" : "") + esec;
    document.getElementById("timemin").innerHTML = eminStr;
    document.getElementById("timesec").innerHTML = esecStr;
    setTimeColor();

    if (etime % 1000 >= 600) {
        changeStyle("timeminlabel", "color", "black");
    } else {
        changeStyle("timeminlabel", "color", timeColor);
    }
}

// ログに出力する
function log(message, flag) {
    if (flag) {
        message += " (" + (new Date()).toLocaleString() + ")";
    }
    logMessage += message + "<br>\n";
    document.getElementById("log").innerHTML = logMessage;
}

// 初期化
function init() {
    if (debugMode) { // デバッグモード
        document.getElementById("debugmessage").style.display = "block";
    }
    if (noRing) { // ベルを鳴らさない
        bellwav = new Array();
        document.getElementById("readmering").innerHTML = "した上で、このファイルの中の「var noRing = true;」を「var noRing = false;」に書き換えれば";
        document.getElementById("belltest").style.display = "none";
        for (var i = 0; i <= 3; i++) {
            document.getElementById("bellsort" + i).style.display = "none";
        }
    }
    if (!noKey) { // キー入力有効
        document.onkeyup = eventKeyUp;
    }
    if (noMouseOnClock) { // 時間の上のクリック無効
        document.getElementById("time").onclick = null;
    }
    getTimeByURI();

    for (var i = 0; i <= 3; i++) {
        if (bell[i].ring == 0) {
            document.getElementById("timetr" + i).style.display = "none";
        }
    }
    if (bell[0].ring != 0 && bell[1].ring == 0) {
        chopYorei1();
    }

    changeFontSize();
    doHold();
    changeTimeColorLabel(timeColorLabelArrayIndex);
    resetClock();
    setForm();
}

// URIをもとに時間変更
function getTimeByURI() {
    // URIの最後の「/」からあとが対象
    var path = location.href;
    if (path.match(/\//)) {
        path = path.replace(/^.*\//, "");
    }

    if (path.match(/p=?(\d+)([a-z]?)/)) {
        var num = myParseInt(RegExp.$1);
        var opt = RegExp.$2;
        if (num == 5) { // p5: 予鈴2分30秒, 発表終了3分, 質疑終了5分
            presetBell();
            bell[0].etime = (2 * 60 + 30) * 1000;
            bell[2].etime = 3 * 60 * 1000;
            bell[3].etime = 5 * 60 * 1000;
        } else if (num == 10) { // p10: 予鈴7分, 発表終了8分, 質疑終了10分
            presetBell();
            bell[0].etime = 7 * 60 * 1000;
            bell[2].etime = 8 * 60 * 1000;
            bell[3].etime = 10 * 60 * 1000;
        } else if (num == 15) { // p15: 予鈴8分, 発表終了10分, 質疑終了15分
            presetBell();
            bell[0].etime = 8 * 60 * 1000;
            bell[2].etime = 10 * 60 * 1000;
            bell[3].etime = 15 * 60 * 1000;
        } else if (num == 20) { // p20: 予鈴12分, 発表終了15分, 質疑終了20分
            presetBell();
            bell[0].etime = 12 * 60 * 1000;
            bell[2].etime = 15 * 60 * 1000;
            bell[3].etime = 20 * 60 * 1000;
        } else if (num == 30) { // p30またはp30a
            presetBell();
            if (opt == "a") { // p30a: 予鈴20分, 発表終了25分, 質疑終了30分
                bell[0].etime = 20 * 60 * 1000;
                bell[2].etime = 25 * 60 * 1000;
                bell[3].etime = 30 * 60 * 1000;
            } else { // p30: 予鈴15分, 発表終了20分, 質疑終了30分
                bell[0].etime = 15 * 60 * 1000;
                bell[2].etime = 20 * 60 * 1000;
                bell[3].etime = 30 * 60 * 1000;
            }
        }
    }
    if (path.match(/m=?(\d\d)(\d\d)(\d\d)(\d\d)/)) {
        // m07000810: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringMin(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4);
    } else if (path.match(/m=?(\d*)[_\-, ](\d*)[_\-, ](\d*)[_\-, ](\d*)/)) {
        // m7,0,8,10: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringMin(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4);
    } else if (path.match(/m=?(\d\d)(\d\d)(\d\d)/)) {
        // m070810: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringMin(RegExp.$1, "0", RegExp.$2, RegExp.$3);
    } else if (path.match(/m=?(\d*)[_\-, ](\d*)[_\-, ](\d*)/)) {
        // m7,8,10: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringMin(RegExp.$1, "0", RegExp.$2, RegExp.$3);
    }
    if (path.match(/s=?(\d\d\d\d)(\d\d\d\d)(\d\d\d\d)(\d\d\d\d)/)) {
        // s0420000004800600: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringSec(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4);
    } else if (path.match(/s=?(\d*)[_\-, ](\d*)[_\-, ](\d*)[_\-, ](\d*)/)) {
        // s420,0,480,600: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringSec(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4);
    } else if (path.match(/s=?(\d\d\d\d)(\d\d\d\d)(\d\d\d\d)/)) {
        // s042004800600: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringSec(RegExp.$1, "0", RegExp.$2, RegExp.$3);
    } else if (path.match(/s=?(\d*)[_\-, ](\d*)[_\-, ](\d*)/)) {
        // s420,480,600: 予鈴7分, 発表終了8分, 質疑終了10分
        setBellByStringSec(RegExp.$1, "0", RegExp.$2, RegExp.$3);
    }
    // ToDo
    // b1123: ベルの種類が予鈴1は1，予鈴2は1，発表終了は2，質疑終了は3
    // B1011: 予鈴1，発表終了，質疑終了でベルを鳴らす（予鈴2では鳴らさない）
}

// 予鈴2不使用にする
function presetBell() {
    bell[0].ring = 1;
    bell[0].wavtime = 1;
    bell[1].ring = 0;
    bell[2].ring = 1;
    bell[2].wavtime = 2;
    bell[3].ring = 1;
    bell[3].wavtime = 3;
    //chopYorei1();
}

// 予鈴1, 予鈴2, 発表終了, 質疑終了の分（文字列）をもとにbellに設定する
function setBellByStringMin(min1, min2, min3, min4) {
    var secs = new Array(myParseInt(min1) * 60,
                         myParseInt(min2) * 60,
                         myParseInt(min3) * 60,
                         myParseInt(min4) * 60);
    setBellByArray(secs);
}

// 予鈴1, 予鈴2, 発表終了, 質疑終了の秒（文字列）をもとにbellに設定する
function setBellByStringSec(sec1, sec2, sec3, sec4) {
    var secs = new Array(myParseInt(sec1),
                         myParseInt(sec2),
                         myParseInt(sec3),
                         myParseInt(sec4));
    setBellByArray(secs);
}

// 予鈴1, 予鈴2, 発表終了, 質疑終了の秒（整数）の配列をもとにbellに設定する
function setBellByArray(secs) {
    for (var i = 0; i < 4; i++) {
        bell[i].etime = secs[i] * 1000;
        if (secs[i] == 0) {
            bell[i].ring = 0;
        } else {
            bell[i].ring = 1;
        }
    }
}

// 「予鈴1」を「予鈴」に変更
function chopYorei1() {
    var obj = document.getElementById("cfglabel0");
    var label = obj.innerHTML;
    if (label.match(/1$/)) {
        obj.innerHTML = label.replace(/1$/, "");
    }
}

// フォントサイズ変更
function changeFontSize() {
    var scrWidth = document.body.clientWidth;
    var scrHeight = document.body.clientHeight;

    if (debugMode) {
        document.getElementById("debugmessage").innerHTML = "test: width=" + scrWidth + ", height=" + scrHeight;
    }

    if (digitScale > 0) {
        var fs = scrWidth * digitScale * 0.01;
        changeStyle("timemin", "fontSize", "" + fs + "pt");
        changeStyle("timesec", "fontSize", "" + fs + "pt");
    }

    if (minsecLabelScale > 0) {
        var fs = scrWidth * minsecLabelScale * 0.01;
        changeStyle("timeminlabel", "fontSize", "" + fs + "pt");
        changeStyle("timeseclabel", "fontSize", "" + fs + "pt");
        changeStyle("timestatus", "fontSize", "" + fs + "pt");
    }
}

// 計時開始
function startClock() {
    if (!clockTick) {
        if (etime1 == 0) {
            log("start", true);
        }

        myInterval = setInterval("updateClock()", 100);
        timeStart = (new Date()).getTime();
        doTick();
        document.getElementById("buttonstart").style.display = "none";
        document.getElementById("buttonstop").style.display = "inline";
        document.getElementById("buttonreset").style.display = "none";
    }
}

// 計時停止
function stopClock() {
    if (clockTick) {
        doHold();
        if (myInterval != null) {
            clearInterval(myInterval);
            myInterval = null;
        }
        updateClock();
        etime1 = etime1 + etime2;
        etime2 = 0;

        document.getElementById("buttonstart").style.display = "inline";
        document.getElementById("buttonstart").value = "再開";
        document.getElementById("buttonstop").style.display = "none";
        document.getElementById("buttonreset").style.display = "inline";
        changeStyle("timeminlabel", "color", timeColor);

        if (debugMode) {
            document.getElementById("debugmessage").innerHTML = "etime1:" + etime1 + ", etime2:" + etime2;
        }
    }
}

// 計時開始/停止
function toggleClock() {
    if (clockTick) {
        stopClock();
        if (countMark > 0) { // 1回以上[.]を押して経過時間を計っているときに限る
            markLapTime(); // 経過時間（ラップタイム）の記録
        }
    } else {
        startClock();
    }
}

// 計時リセット
function resetClock() {
    if (!clockTick) {
        for (var i = 0; i <= 3; i++) {
            if (bell[i].ring == 2) {
                bell[i].ring = 1;
            }
        }
        etime1 = 0;
        etime2 = 0;
        etimeLastMark = 0;
        countMark = 0;
        displayTime(0);

        if (timeColorLabelArrayIndex == 0) {
            changeTimeColorLabel(2);
        }

        updateTitle();
        document.getElementById("buttonstart").style.display = "inline";
        document.getElementById("buttonstart").value = "開始";
        document.getElementById("buttonstop").style.display = "none";
        document.getElementById("buttonreset").style.display = "inline";
        movePageTop();

        log("reset", true);
    }
}

// 時間情報を文字列に変換
function timeToString(time) {
    var str = "";
    var hour, min, sec, msec;

    msec = time % 1000; time = (time - msec) / 1000;
    sec = time % 60; time = (time - sec) / 60;
    min = time % 60; time = (time - min) / 60;
    hour = time;

    if (hour > 0) {
        str += "" + hour + "時間";
    }
    if (hour + min > 0) {
        str += "" + (hour > 0 && min < 10 ? "0" : "") + min + "分";
    }
    str += "" + (hour + min > 0 && sec < 10 ? "0" : "") + sec + "秒";
    str += "<span style=\"font-size:75%\">" + (msec < 100 ? "0" : "") + (msec < 10 ? "0" : "") + msec + "</span>";

    return str;
}

// 経過時間の記録
function markTime(paren) {
    var etime = getElapsedTime();
    var laptime = etime - etimeLastMark;
    etimeLastMark = etime;
    countMark++;

    log((paren == 0 ? "&lt;" : "[") + countMark + (paren == 0 ? "&gt; " : "] ") + timeToString(etime) + " (+" + timeToString(laptime) + ")", false);
}

// 経過時間（ラップタイム）の記録
function markLapTime(paren) {
    var etime = getElapsedTime();
    var laptime = etime - etimeLastMark;

    log("[Pause] " + timeToString(etime) + " (+" + timeToString(laptime) + ")", false);
}

// 時間表示方法の変更(引数は0,1,2)
function changeTimeColorLabel(index) {
    timeColorLabelArrayIndex = index;
    timeColorLabelArray = timeColorLabelArrayArray[timeColorLabelArrayIndex];
    updateTitle();
    setTimeColor();
    updateClock();
}

// タイトルバー変更
function updateTitle() {
    if (!noChangeTitle) {
        var title = titleArray[timeColorLabelArrayIndex];
        if (countMark > 0) {
            title = "<" + countMark + "> " + title;
        }
        document.title = title;
    }
}

// 時間表示方法の変更(トグル)
function toggleTimeColorLabel() {
    changeTimeColorLabel((timeColorLabelArrayIndex + 1) % 2);
}

// 経過時間算出
function getElapsedTime() {
    if (clockTick) {
        var timeStop = (new Date()).getTime();
        etime2 = timeStop - timeStart;
    }
    return etime1 + etime2;
}

// 時刻更新
function updateClock() {
    var etime = getElapsedTime();

    if (debugMode) {
        document.getElementById("debugmessage").innerHTML = "etime=" + etime + ", etime1=" + etime1 + ", etime2=" + etime2;
    }

    // 分秒の表示変更
    displayTime(etime);

    // ベルを鳴らす
    for (var i = 0; i <= 3; i++) {
        if (bell[i].ring == 1 && etime >= bell[i].etime) {
            bell[i].ring = 2;
            setTimeColor();
            if (bell[i].wavtype > 0) {
                doRing(bell[i].wavtype);
            }
        }
    }
}

// ベルを鳴らす
function doRing(wavid) {
    if (wavid != null && wavid > 0) {
        document.getElementById("sound").innerHTML = "<embed id=\"embedsound\" type=\"audio/wav\" src=\"" + bellwav[wavid] + "\" autostart=\"true\" hidden=\"true\" width=\"1\" height=\"1\">";
    }
}

// 時間を止める
function doHold() {
    clockTick = false;
    document.getElementById("config").style.display = "block";
}

// 時間を動かす
function doTick() {
    clockTick = true;
    document.getElementById("config").style.display = "none";
}

// 内部状態をフォームにセットする
function setForm() {
    for (var i = 0; i <= 3; i++) {
        var min, sec;
        var minsec;

        switch (i) {
        case 0:
        case 1:
            minsec = bell[2].etime - bell[i].etime;
            break;
        case 2:
            minsec = bell[2].etime;
            break;
        case 3:
            minsec = bell[i].etime - bell[2].etime;
            break;
        }
        if (minsec < 0) {
            min = sec = 0;
        } else {
            minsec = Math.floor(minsec / 1000);
            min = Math.floor(minsec / 60);
            sec = minsec % 60;
        }
        document.getElementById("cfgmin" + i).value = "" + min;
        document.getElementById("cfgsec" + i).value = "" + sec;

        var wavtype = bell[i].ring == 0 ? 0 : bell[i].wavtype;
        document.getElementById("cfgwav" + i).value = "" + wavtype;
    }
}

// 整数値を求める
function myParseInt(value) {
    if (value == null) {
        return 0;
    }
    value = value.replace(/^0+/, "");
    if (value == "") {
        return 0;
    }
    return parseInt(value);
}

// フォームを読み込み、内部状態にセットする
function getForm() {
    var minsecArray = new Array();
    for (var i = 0; i <= 3; i++) {
        var min = myParseInt(document.getElementById("cfgmin" + i).value);
        var sec = myParseInt(document.getElementById("cfgsec" + i).value);
        minsecArray[i] = min * 60 + sec;

        var wavtype = myParseInt(document.getElementById("cfgwav" + i).value);
        bell[i].wavtype = wavtype;
        bell[i].ring = (wavtype == 0 ? 0 : 1);
    }

    bell[0].etime = (minsecArray[2] - minsecArray[0]) * 1000;
    bell[1].etime = (minsecArray[2] - minsecArray[1]) * 1000;
    bell[2].etime = minsecArray[2] * 1000;
    bell[3].etime = (minsecArray[2] + minsecArray[3]) * 1000;
}

// readmeを表示/非表示
function displayReadme() {
    readmeToggle = !readmeToggle;
    document.getElementById("readme").style.display = (readmeToggle ? "block" : "none");
    if (readmeToggle) {
        movePageEnd();
    }
}

// keybindを表示/非表示
function displayKeybind() {
    keybindToggle = !keybindToggle;
    document.getElementById("keybind").style.display = (keybindToggle ? "block" : "none");
    if (keybindToggle) {
        movePageEnd();
    }
}

// 「準備OK?」のメッセージを表示
function showAdvice() {
    alert("これはブラウザで動く学会タイマーです。\n数分間、何も操作しないと、画面がオフになったり、\nスクリーンセーバーが作動したりしませんか?");
}

// logを表示/非表示
function displayLog() {
    logToggle = !logToggle;
    document.getElementById("log").style.display = (logToggle ? "block" : "none");
    if (logToggle) {
        movePageEnd();
    }
}

// ページの始まりに移動
function movePageTop() {
    window.scrollTo(0, 0);
}

// ページの終わりに移動
function movePageEnd() {
    window.scrollTo(0, document.documentElement.scrollHeight);
}

// テキスト領域をフォーカス
function fT(e) {
    focusingText = true;
}

// テキスト領域がフォーカスから外れる
function bT(e) {
    focusingText = false;
}

// キーイベント
function eventKeyUp(e) {
    var code = 0;

    if (focusingText) { // テキスト入力中はキーイベント処理しない
        return;
    }

    if (document.all) { // ブラウザに応じてコード取得
        code = event.keyCode;
    } else if (document.getElementById) {
        code = e.keyCode ? e.keyCode : e.charCode;
    } else if(document.layers) {
        code =  e.which;
    }

    if (code == 32 || code == 90 || code == 53 || code == 101) { // [SPC], [Z], [5]: 開始/停止/再開
        toggleClock();
    } else if (code == 27 || code == 88 || code == 48 || code == 96) { // [Esc], [X], [0]: 停止時2度押しでリセット
        if (!clockTick) {
            var t = (new Date()).getTime();
            if (timeTypeEsc != null && t - timeTypeEsc <= 1000) {
                resetClock();
                timeTypeEsc = null;
            } else {
                timeTypeEsc = t;
            }
        }
    } else if (code == 65 || code == 83 || code == 68) { // [A], [S], [D]: 2度押しでベル1, 2, 3
        if (!noRing) {
            var t = (new Date()).getTime();
            if (timeTypeRing != null && t - timeTypeRing <= 1000 && typeRing == code) {
                timeTypeRing = t;
                typeRing = code;
                if (code == 65) {
                    doRing(1);
                } else if (code == 83) {
                    doRing(2);
                } else {
                    doRing(3);
                }
            } else {
                timeTypeRing = t;
                typeRing = code;
            }
        }
    } else if (code == 72 || code == 57 || code == 105) { // [H], [9]: 「はじめにお読みください」の表示/非表示
        if (!clockTick) {
            displayReadme();
        }
    } else if (code == 46 || code == 110 || code == 190 || code == 50 || code == 98) { // [2], [.]
        if (clockTick) {
            markTime(); // 経過時間の記録
            updateTitle();
        } else {
            displayLog(); // ログの表示/非表示
        }
    } else if (code == 80 || code == 56 || code == 104) { // [P], [8]: 時間表示切替
        toggleTimeColorLabel();
    } else if (code == 75 || code == 55 || code == 103) { // [K], [7]: キーバインドの表示/非表示
        if (!clockTick) {
            displayKeybind();
        }
    } else if (code == 77 || code == 51 || code == 99) { // [M], [3]: 数字拡大
        digitScale++;
        changeFontSize();
        updateClock();
    } else if (code == 78 || code == 49 || code == 97) { // [N], [1]: 数字縮小
        if (digitScale > 1) {
            digitScale--;
            changeFontSize();
            updateClock();
        }
    }
}
