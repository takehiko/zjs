var zjs = {};

zjs.config = {
    // // // 自由に書き換えてください:ここから // // //
    bell: new Array( // ベルセット
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
            // [3] 質疑終了の鈴
            "ring": 1,          // 0:使用しない, 1:使用する
            "etime": 20 * 1000, // 鳴らす時間(開始からのミリ秒)
            "wavtype": 3        // ベルの種類
        }),

    colorArray1: new Array( // 色セット1
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
        }),

    colorArray2: new Array( // 色セット2
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
        }),

    titleArray: new Array( // タイトルバー
        "zjs: 発表時間はカウントダウン、質疑時間はカウントアップ",
        "zjs: 発表・質疑の合計時間をカウントアップ",
        "zjs",
        "zjs"
    ),

    debugMode: false, // trueならデバッグモード
    noKey: false, // trueならキー入力([5]など)無効
    noMouseOnClock: true, // trueなら時間の上のクリック(開始/停止/再開)無効
    noChangeTitle: false, // trueならタイトルバーは「zjs」固定

    bellWavArray: new Array(null, "chime1.wav", "chime2.wav", "chime3.wav"), // ベルのファイル
    noChangeBellWav: false, // trueならベルのファイル名固定．falseならsetupByURIで書き換えられる

    digitScale: 21, // 文字表示の拡大率(ウィンドウ幅に対する割合，パーセンテージ; 0は拡大しない)
    minsecLabelScale: 3, // 「分」「秒」表示の拡大率(ウィンドウ幅に対する割合，パーセンテージ; 0は拡大しない)
    ringMode: null, // null:ブラウザで判定, 0:鳴らさない, 1以上:鳴らす(方法はこのファイルで「w: 」を検索)
    userAgent: null, // ブラウザ判別用
    hourglassMode: 0, // 0: 砂時計なし, 1:砂時計モード（停止時オフ）, 2:砂時計モード（停止時も維持）
    boardMagnifyMode: 2, // 0:パネルなどの拡大無効，1:パネルとボタンのサイズ変更可，2:パネルとボタンとメッセージのサイズ変更可
    boardMagnifyPercent: 120, // パネル拡大率
    longwiseMode: 0, // 0:時計表示の位置(縦方向)変更しない，1:する
    rehearsalMode: true, // 発表練習モード
    countMarkInitial: 0, // zjs.clock.countMarkの初期値
    colorIndex: 2, // 0:カウントダウン+タイトルバー詳細表示, 1:カウントアップ+タイトルバー詳細表示, 2:カウントダウン, 3:カウントアップ
    // // // 自由に書き換えてください:ここまで // // //
    _dummy_: null
};

(function () {
     var prop = zjs.config;

     // 初期化
     function init() {
         setupUserAgent();
         setupByURI();

         if (prop.debugMode) { // デバッグモード
             zjs.screen.changeStyle("debugmessage", "display", "block");
         }
         if (prop.noKey) { // キー入力無効
             zjs.screen.keybindId = "iv_keybind";
             zjs.screen.changeStyle("readme_key", "display", "none");
         } else { // キー入力有効
             document.onkeyup = zjs.key.eventKeyUp;
         }
         if (prop.noMouseOnClock) { // 時間の上のクリック無効
             document.getElementById("time").onclick = null;
         }
         if (!prop.rehearsalMode) { // 発表練習モード無効
             zjs.screen.changeStyle("buttoncount", "display", "none");
             zjs.screen.changeStyle("Dbutton_log", "display", "none");
             zjs.screen.changeStyle("readme_rehearsal", "display", "none");
             zjs.screen.changeStyle("keybind_rehearsal", "display", "none");
         }

         zjs.bell.setupRing();
         zjs.screen.changeFontSize();
         zjs.clock.hold();
         zjs.screen.changeTimeColorLabel(prop.colorIndex);
         zjs.clock.resetClock();
         zjs.board.setForm();
         zjs.board.setMagnify();
     }

     // ブラウザ判別
     function setupUserAgent() {
         if (prop.userAgent == null) {
             var ua = navigator.userAgent;

             if (ua.indexOf("Opera") >= 0) {
                 prop.userAgent = "opera";
             } else if (ua.indexOf("MSIE") >= 0 || ua.indexOf("Trident") >= 0) {
                 prop.userAgent = "msie";
             } else if (ua.indexOf("Firefox") >= 0) {
                 prop.userAgent = "firefox";
             } else if (ua.indexOf("Chrome") >= 0) {
                 prop.userAgent = "chrome";
             } else if (ua.indexOf("iPod") >= 0 || ua.indexOf("iPhone") >= 0 || ua.indexOf("iPad") >= 0) {
                 prop.userAgent = "ipod";
             } else if (ua.indexOf("Safari") >= 0) {
                 prop.userAgent = "safari";
             } else {
                 prop.userAgent = "other";
             }
         }

         if (prop.userAgent == "ipod") {
             prop.noKey = true;
             prop.noMouseOnClock = false;
             prop.noChangeTitle = true;
         }
     }

     // URIをもとに時間および各種設定変更
     function setupByURI() {
         // URIの最後の「/」からあとが対象
         var path = location.pathname;
         if (path.match(/\//)) {
             path = path.replace(/^.*\//, "");
         }
         path += location.search + location.hash;

         // p: よく使用する時間セット
         if (path.match(/p=?(\d+)([a-z]?)/)) {
             var num = myParseInt(RegExp.$1);
             var opt = RegExp.$2;
             if (num == 5) { // p5: 予鈴2分30秒, 発表終了3分, 質疑終了5分
                 presetBell();
                 prop.bell[0].etime = (2 * 60 + 30) * 1000;
                 prop.bell[2].etime = 3 * 60 * 1000;
                 prop.bell[3].etime = 5 * 60 * 1000;
             } else if (num == 10) { // p10: 予鈴7分, 発表終了8分, 質疑終了10分
                 presetBell();
                 prop.bell[0].etime = 7 * 60 * 1000;
                 prop.bell[2].etime = 8 * 60 * 1000;
                 prop.bell[3].etime = 10 * 60 * 1000;
             } else if (num == 15) { // p15: 予鈴8分, 発表終了10分, 質疑終了15分
                 presetBell();
                 prop.bell[0].etime = 8 * 60 * 1000;
                 prop.bell[2].etime = 10 * 60 * 1000;
                 prop.bell[3].etime = 15 * 60 * 1000;
             } else if (num == 20) { // p20: 予鈴12分, 発表終了15分, 質疑終了20分
                 presetBell();
                 prop.bell[0].etime = 12 * 60 * 1000;
                 prop.bell[2].etime = 15 * 60 * 1000;
                 prop.bell[3].etime = 20 * 60 * 1000;
             } else if (num == 30) { // p30またはp30a
                 presetBell();
                 if (opt == "a") { // p30a: 予鈴20分, 発表終了25分, 質疑終了30分
                     prop.bell[0].etime = 20 * 60 * 1000;
                     prop.bell[2].etime = 25 * 60 * 1000;
                     prop.bell[3].etime = 30 * 60 * 1000;
                 } else { // p30: 予鈴15分, 発表終了20分, 質疑終了30分
                     prop.bell[0].etime = 15 * 60 * 1000;
                     prop.bell[2].etime = 20 * 60 * 1000;
                     prop.bell[3].etime = 30 * 60 * 1000;
                 }
             }
         }

         // m: 分単位指定
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

         // s: 秒単位指定
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

         // w: ベルモード
         // prop.ringMode = null : ブラウザで判定
         // prop.ringMode = 0 : 鳴らさない
         // prop.ringMode = 1 : そのつどsound内に書き込む
         // prop.ringMode = 2 : あらかじめsound内に書き込んでPlay()
         // prop.ringMode = 3 : Audioオブジェクトを使用
         // prop.ringMode = 4 : Audioオブジェクトを使用し，ファイルはchime1.wavのみ
         if (path.match(/w=?(\d+)/)) {
             prop.ringMode = myParseInt(RegExp.$1);
         }
         if (prop.ringMode == null) {
             if (prop.userAgent == "msie") {
                 prop.ringMode = 2;
             } else if (typeof(Audio) != "undefined") {
                 prop.ringMode = 3;
             } else {
                 prop.ringMode = 0;
             }
             // 以前の設定: chromeなら2, ipodなら4, Audioが利用可能なら3,
             // いずれでもなければ2
         }

         // h: 砂時計モード
         if (path.match(/h=?(\d+)/)) {
             prop.hourglassMode = myParseInt(RegExp.$1);
         }

         // mg: パネルサイズ変更可
         if (path.match(/mg=?(\d+)/)) {
             prop.boardMagnifyMode = myParseInt(RegExp.$1);
         }
         // mp: パネル拡大率
         if (path.match(/mp=?(\d+)/)) {
             prop.boardMagnifyPercent = myParseInt(RegExp.$1);
         }

         // d, b: ベルファイル
         if (!prop.noChangeBellWav) {
             var bellWavDir = "";
             var bellWavBase = "chime";

             if (path.match(/d=([A-Za-z0-9\-\/_]+)/)) { // d=ディレクトリ名
                 bellWavDir = RegExp.$1;
                 if (!bellWavDir.match(/\/$/)) {
                     bellWavDir += "/";
                 }
             }
             if (path.match(/b=([A-Za-z0-9\-_]+)/)) { // b=ファイル名（[1-3].wavより前の部分）
                 bellWavBase = RegExp.$1;
             }
             for (var i = 1; i <= 3; i++) {
                 prop.bellWavArray[i] = bellWavDir + bellWavBase + i + ".wav";
             }
         }

         // c: 時刻表示モード
         if (path.match(/c=?(\d+)/)) {
             prop.colorIndex = myParseInt(RegExp.$1);
         }

         // r: 発表練習モード
         if (path.match(/r[a-z_]*off/i)) { // rehearsal_off
             prop.rehearsalMode = false;
         }
         if (path.match(/rc=?(\d+)/)) { // rc: 番号の初期値
             prop.rehearsalMode = true;
             prop.countMarkInitial = myParseInt(RegExp.$1);
         }

         // key
         if (path.match(/nokey/i)) { // nokey: キー入力無効
             prop.noKey = true;
         } else if (path.match(/key/i)) { // key: キー入力有効
             prop.noKey = false;
         }
         // mouse
         if (path.match(/nomouse/i)) { // nomouse: 時間の上のクリック無効
             prop.noMouseOnClock = true;
         } else if (path.match(/mouse/i)) { // mouse: 時間の上のクリック有効
             prop.noMouseOnClock = false;
         }
         // debug
         if (path.match(/nodebug/i)) { // nodebug: デバッグモード無効
             prop.debugMode = false;
         } else if (path.match(/debug/i)) { // debug: デバッグモード有効
             prop.debugMode = true;
         }
     }

     // 予鈴1，発表終了，質疑終了のベルを設定し，予鈴2は不使用にする
     function presetBell() {
         prop.bell[0].ring = 1;
         prop.bell[0].wavtime = 1;
         prop.bell[1].ring = 0;
         prop.bell[2].ring = 1;
         prop.bell[2].wavtime = 2;
         prop.bell[3].ring = 1;
         prop.bell[3].wavtime = 3;
         // zjs.board.chopFirstBell1();
     }

     // 予鈴1, 予鈴2, 発表終了, 質疑終了の分（文字列）をもとにzjs.config.bellに設定する
     function setBellByStringMin(min1, min2, min3, min4) {
         var secArray = new Array(myParseInt(min1) * 60,
                                  myParseInt(min2) * 60,
                                  myParseInt(min3) * 60,
                                  myParseInt(min4) * 60);
         setBellByArray(secArray);
     }

     // 予鈴1, 予鈴2, 発表終了, 質疑終了の秒（文字列）をもとにzjs.config.bellに設定する
     function setBellByStringSec(sec1, sec2, sec3, sec4) {
         var secArray = new Array(myParseInt(sec1),
                                  myParseInt(sec2),
                                  myParseInt(sec3),
                                  myParseInt(sec4));
         setBellByArray(secArray);
     }

     // 予鈴1, 予鈴2, 発表終了, 質疑終了の秒（整数）の配列をもとにzjs.config.bellに設定する
     function setBellByArray(secArray) {
         for (var i = 0; i < 4; i++) {
             prop.bell[i].etime = secArray[i] * 1000;
             if (secArray[i] == 0) {
                 prop.bell[i].ring = 0;
             } else {
                 prop.bell[i].ring = 1;
             }
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

     zjs.config.init = init;
     zjs.config.myParseInt = myParseInt;
})();

zjs.clock = {
    clockTick: false, // 時計が進んでいるならtrue
    clockRing: 0, // ベル待ち時間(100ミリ秒単位．ringMode=4のみ使用)
    restRing: 0, // あと何回ベルを鳴らすか
    etime1: 0, // 経過時間1(ミリ秒)
    etime2: 0, // 経過時間2(ミリ秒; 停止ボタンで0になる)
    etimeLastMark: 0, // 経過時間(ミリ秒; 前回記録した時間)
    timeStart: 0, // 計測開始時刻
    countMark: 0, // 経過時間の記録回数
    _dummy_: null
};

(function () {
     var prop = zjs.clock;
     var myInterval = null; // setInterval保存

     // タイマ割り込みの処理
     function interrupt() {
         if (prop.clockTick) {
             zjs.screen.updateClock();             
         }
         if (prop.clockRing > 0) {
             prop.clockRing--;
             if ((prop.restRing == 2 && prop.clockRing <= 12)
                 || (prop.restRing == 1 && prop.clockRing <= 1)) {
                 zjs.bell.ring(1);
                 prop.restRing--;
             } else if (prop.clockRing == 0) {
                 intervalOffRing();
             }
         }
     }

     // タイマ割り込み設定（時間を進める）
     function intervalOnClock() {
         if (myInterval == null) {
             myInterval = setInterval("zjs.clock.interrupt()", 100);
         }
     }

     // タイマ割り込み設定（時間を止める）
     function intervalOffClock() {
         if (myInterval != null && prop.clockRing == 0) {
             clearInterval(myInterval);
             myInterval = null;
         }
     }

     // タイマ割り込み設定（ベル用の時間を進める）
     function intervalOnRing(count) {
         prop.restRing = count;
         prop.clockRing = count * 12;
         if (myInterval == null) {
             myInterval = setInterval("zjs.clock.interrupt()", 100);
         }
     }

     // タイマ割り込み設定（ベル用の時間を止める）
     function intervalOffRing() {
         prop.clockRing = 0;
         if (myInterval != null && !prop.clockTick) {
             clearInterval(myInterval);
             myInterval = null;
         }
     }

     // 計時開始
     function startClock() {
         if (!prop.clockTick) {
             if (prop.etime1 == 0) {
                 zjs.board.appendToLog("start", true);
             }

             intervalOnClock();
             // myInterval = setInterval("zjs.screen.updateClock()", 100);
             prop.timeStart = (new Date()).getTime();
             tick();
             zjs.screen.changeStyle("buttonstart", "display", "none");
             zjs.screen.changeStyle("buttonstop", "display", "inline");
             zjs.screen.changeStyle("buttonreset", "display", "none");
         }
     }

     // 計時停止
     function stopClock() {
         if (prop.clockTick) {
             hold();
             intervalOffClock();
             // if (myInterval != null) {
             //     clearInterval(myInterval);
             //     myInterval = null;
             // }
             zjs.screen.updateClock();
             prop.etime1 = prop.etime1 + prop.etime2;
             prop.etime2 = 0;

             document.getElementById("buttonstart").value = "再開";
             zjs.screen.changeStyle("buttonstart", "display", "inline");
             zjs.screen.changeStyle("buttonstop", "display", "none");
             zjs.screen.changeStyle("buttonreset", "display", "inline");
             zjs.screen.changeStyle("timeminlabel", "visibility", "visible");

             if (zjs.config.debugMode) {
                 document.getElementById("debugmessage").innerHTML = "etime1:" + prop.etime1 + ", etime2:" + prop.etime2;
             }
         }
     }

     // 計時開始/停止
     function toggleClock() {
         if (prop.clockTick) {
             stopClock();
             if (prop.countMark > zjs.config.countMarkInitial) {
                 prop.markLapTime();
             }
         } else {
             startClock();
         }
     }

     // 計時リセット
     function resetClock() {
         if (!prop.clockTick) {
             for (var i = 0; i <= 3; i++) {
                 if (zjs.bell.bellArray[i].ring == 2) {
                     zjs.bell.bellArray[i].ring = 1;
                 }
             }
             prop.etime1 = 0;
             prop.etime2 = 0;
             prop.etimeLastMark = 0;
             prop.countMark = zjs.config.countMarkInitial;
             prop.displayButtonCount();
             zjs.screen.displayTime(0);

             zjs.screen.changeTimeColorLabel(zjs.config.colorIndex);

             zjs.screen.updateTitle();
             document.getElementById("buttonstart").value = "開始";
             zjs.screen.changeStyle("buttonstart", "display", "inline");
             zjs.screen.changeStyle("buttonstop", "display", "none");
             zjs.screen.changeStyle("buttonreset", "display", "inline");
             zjs.screen.movePageTop();

             zjs.board.appendToLog("reset", true);
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
         var laptime = etime - prop.etimeLastMark;
         prop.etimeLastMark = etime;
         if (zjs.config.countMarkInitial == 0) {
             prop.countMark++;
         }
         zjs.board.appendToLog((paren == 0 ? "&lt;" : "[") + prop.countMark + (paren == 0 ? "&gt; " : "] ") + timeToString(etime) + " (+" + timeToString(laptime) + ")", false);
         if (zjs.config.countMarkInitial != 0) {
             prop.countMark++;
         }
         prop.displayButtonCount();
     }

     // 経過時間(ラップタイム)の記録
     function markLapTime(paren) {
         var etime = getElapsedTime();
         var laptime = etime - prop.etimeLastMark;

         zjs.board.appendToLog("[Pause] " + timeToString(etime) + " (+" + timeToString(laptime) + ")", false);
     }

     // 経過時間算出
     function getElapsedTime() {
         if (prop.clockTick) {
             var timeStop = (new Date()).getTime();
             prop.etime2 = timeStop - prop.timeStart;
         }
         return prop.etime1 + prop.etime2;
     }

     // 時間を止める
     function hold() {
         prop.clockTick = false;
         zjs.screen.setLongwise();
         zjs.screen.changeStyle("config", "display", "block");
         displayButtonCount();
     }

     // 時間を動かす
     function tick() {
         prop.clockTick = true;
         zjs.screen.changeStyle("config", "display", "none");
         zjs.screen.setLongwise();
         displayButtonCount();
     }

     // 経過時間の記録、ログの表示/非表示
     function markTimeOrDisplayLog() {
         if (zjs.clock.clockTick) {
             zjs.clock.markTime(); // 経過時間の記録
             zjs.screen.updateTitle();
         } else {
             zjs.board.displayLog(); // ログの表示/非表示
         }
     }

     // 発表練習用カウンタの更新
     function displayButtonCount() {
         if (!zjs.config.rehearsalMode || 
             !prop.clockTick && prop.countMark == zjs.config.countMarkInitial) {
             zjs.screen.changeStyle("buttoncount", "display", "none");
         } else {
             document.getElementById("buttoncount").value = "<" + prop.countMark + ">";
             zjs.screen.changeStyle("buttoncount", "display", "inline");
         }
     }

     zjs.clock.interrupt = interrupt;
     zjs.clock.intervalOnClock = intervalOnClock;
     zjs.clock.intervalOffClock = intervalOffClock;
     zjs.clock.intervalOnRing = intervalOnRing;
     zjs.clock.intervalOffRing = intervalOffRing;
     zjs.clock.startClock = startClock;
     zjs.clock.stopClock = stopClock;
     zjs.clock.toggleClock = toggleClock;
     zjs.clock.resetClock = resetClock;
     // zjs.clock.timeToString = timeToString;
     zjs.clock.markTime = markTime;
     zjs.clock.markLapTime = markLapTime;
     zjs.clock.getElapsedTime = getElapsedTime;
     zjs.clock.hold = hold;
     zjs.clock.tick = tick;
     zjs.clock.markTimeOrDisplayLog = markTimeOrDisplayLog;
     zjs.clock.displayButtonCount = displayButtonCount;
})();

zjs.key = {
    timeTypeEsc: null, // Escapeを押した時刻(2度押しリセット用)
    timeTypeRing: null, // ベルキーを押した時刻(2度押し用)
    typeRing: 0, // 押したベルキー(2度押し用)
    _dummy_: null
};

(function () {
     var prop = zjs.key;

     // キーイベント
     // ToDo: イベントごとに関数化
     function eventKeyUp(e) {
         var code = 0;

         if (zjs.board.focusingText) { // テキスト入力中はキーイベント処理しない
             return;
         }

         if (document.all) { // ブラウザに応じてコード取得
             code = event.keyCode;
         } else if (document.getElementById) {
             code = e.keyCode ? e.keyCode : e.charCode;
         } else if(document.layers) {
             code = e.which;
         }

         if (code == 32 || code == 90 || code == 53) { // [SPC], [Z], [5]: 開始/停止/再開
             zjs.clock.toggleClock();
         } else if (code == 27 || code == 88 || code == 48) { // [Esc], [X], [0]: 停止時2度押しでリセット
             if (!zjs.clock.clockTick) {
                 var t = (new Date()).getTime();
                 if (prop.timeTypeEsc != null && t - prop.timeTypeEsc <= 1000) {
                     zjs.clock.resetClock();
                     prop.timeTypeEsc = null;
                 } else {
                     prop.timeTypeEsc = t;
                 }
             }
         } else if (code == 65 || code == 83 || code == 68) { // [A], [S], [D]: 2度押しでベル1, 2, 3
             if (zjs.config.ringMode != 0) {
                 var t = (new Date()).getTime();
                 if (prop.timeTypeRing != null && t - prop.timeTypeRing <= 1000 && prop.typeRing == code) {
                     prop.timeTypeRing = t;
                     prop.typeRing = code;
                     if (code == 65) {
                         zjs.bell.ring(1);
                     } else if (code == 83) {
                         zjs.bell.ring(2);
                     } else {
                         zjs.bell.ring(3);
                     }
                 } else {
                     prop.timeTypeRing = t;
                     prop.typeRing = code;
                 }
             }
         } else if (code == 72 || code == 57) { // [H], [9]: 「はじめにお読みください」の表示/非表示
             if (!zjs.clock.clockTick) {
                 zjs.board.displayReadme();
             }
         } else if (code == 46 || code == 190 || code == 50) { // [2], [.]: 経過時間の記録、ログの表示/非表示
             if (zjs.config.rehearsalMode) {
                 zjs.clock.markTimeOrDisplayLog();
             }
         } else if (code == 80 || code == 56) { // [P], [8]: 時間表示切替
             zjs.screen.toggleTimeColorLabel();
         } else if (code == 75 || code == 55) { // [K], [7]: キーバインドの表示/非表示
             if (!zjs.clock.clockTick) {
                 zjs.board.displayKeybind();
             }
         } else if (code == 71) { // [G]: 砂時計モード切替
             zjs.config.hourglassMode = (zjs.config.hourglassMode + 1) % 3;
             zjs.screen.updateClock();
         } else if (code == 77 || code == 51) { // [M], [3]: 数字拡大
             zjs.config.digitScale++;
             zjs.screen.changeFontSize();
             zjs.screen.updateClock();
         } else if (code == 78 || code == 49) { // [N], [1]: 数字縮小
             if (zjs.config.digitScale > 1) {
                 zjs.config.digitScale--;
                 zjs.screen.changeFontSize();
                 zjs.screen.updateClock();
             }
         } else if (code == 66) { // [B]: パネル拡大率変更
             if (!zjs.clock.clockTick && zjs.config.boardMagnifyMode != 0) {
                 zjs.board.nextMagnify();
             }
         }
     }

     zjs.key.eventKeyUp = eventKeyUp;
})();

zjs.board = {
    readmeToggle: false, // readmeを表示しているならtrue
    logMessage: "", // ログメッセージ(HTML)
    logToggle: false, // logを表示しているならtrue
    focusingText: false, // テキスト領域をフォーカスしているならtrue
    keybindToggle: false, // ショートカットキーを表示しているならtrue
    _dummy_: null
};

(function () {
     var prop = zjs.board;

     // ログに出力する
     function appendToLog(message, flag) {
         if (flag) {
             message += " (" + (new Date()).toLocaleString() + ")";
         }
         prop.logMessage += message + "<br>\n";
         document.getElementById("log").innerHTML = prop.logMessage;
     }

     // 「予鈴1」を「予鈴」に変更
     function chopFirstBell1() {
         var obj = document.getElementById("cfglabel0");
         var label = obj.innerHTML;
         if (label.match(/1$/)) {
             obj.innerHTML = label.replace(/1$/, "");
         }
     }

     // 内部状態をフォームにセットする
     function setForm() {
         for (var i = 0; i <= 3; i++) {
             var min, sec;
             var minsec;

             switch (i) {
             case 0:
             case 1:
                 minsec = zjs.bell.bellArray[2].etime - zjs.bell.bellArray[i].etime;
                 break;
             case 2:
                 minsec = zjs.bell.bellArray[2].etime;
                 break;
             case 3:
                 minsec = zjs.bell.bellArray[i].etime - zjs.bell.bellArray[2].etime;
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

             var wavtype = (zjs.bell.bellArray[i].ring == 0) ? 0 : zjs.bell.bellArray[i].wavtype;
             document.getElementById("cfgwav" + i).value = "" + wavtype;
         }
     }

     // フォームを読み込み、内部状態にセットする
     function getForm() {
         var minsecArray = new Array();
         for (var i = 0; i <= 3; i++) {
             var min = zjs.config.myParseInt(document.getElementById("cfgmin" + i).value);
             var sec = zjs.config.myParseInt(document.getElementById("cfgsec" + i).value);
             minsecArray[i] = min * 60 + sec;

             var wavtype = zjs.config.myParseInt(document.getElementById("cfgwav" + i).value);
             zjs.bell.bellArray[i].wavtype = wavtype;
             zjs.bell.bellArray[i].ring = (wavtype == 0 ? 0 : 1);
         }

         zjs.bell.bellArray[0].etime = (minsecArray[2] - minsecArray[0]) * 1000;
         zjs.bell.bellArray[1].etime = (minsecArray[2] - minsecArray[1]) * 1000;
         zjs.bell.bellArray[2].etime = minsecArray[2] * 1000;
         zjs.bell.bellArray[3].etime = (minsecArray[2] + minsecArray[3]) * 1000;
         if (zjs.bell.bellArray[3].ring == 0) {
             zjs.bell.bellArray[3].etime = zjs.bell.bellArray[2].etime;
         }
     }

     // ToDo: displayReadme, displayKeybind, displayLogの共通化
     // readmeを表示/非表示
     function displayReadme() {
         prop.readmeToggle = !prop.readmeToggle;
         zjs.screen.changeStyle("readme", "display", prop.readmeToggle ? "block" : "none");
         if (prop.readmeToggle) {
             zjs.screen.movePageEnd();
         }
     }

     // keybindを表示/非表示
     function displayKeybind() {
         prop.keybindToggle = !prop.keybindToggle;
         zjs.screen.changeStyle(zjs.screen.keybindId, "display", prop.keybindToggle ? "block" : "none");
         if (prop.keybindToggle) {
             zjs.screen.movePageEnd();
         }
     }

     // logを表示/非表示
     function displayLog() {
         prop.logToggle = !prop.logToggle;
         zjs.screen.changeStyle("log", "display", prop.logToggle ? "block" : "none");
         if (prop.logToggle) {
             zjs.screen.movePageEnd();
         }
     }

     // 「準備OK?」のメッセージを表示
     function showAdvice() {
         alert(document.getElementById("advice").innerHTML);
     }

     // テキスト領域をフォーカス
     function fT(e) {
         prop.focusingText = true;
     }

     // テキスト領域がフォーカスから外れる
     function bT(e) {
         prop.focusingText = false;
     }

     // パネルなどを拡大する
     // 引数がないときはzjs.config.boardMagnifyPercentを参照する
     function setMagnify(percent) {
         if (percent) {
             zjs.config.boardMagnifyPercent = percent;
         } else if (zjs.config.boardMagnifyMode == 0) {
             zjs.screen.changeStyle("keybind_magnify", "display", "none");
             return;
         }
         var idArray = (zjs.config.boardMagnifyMode == 2) ?
             new Array("button", "config_table", "readme", "keybind", "log") :
             new Array("button", "config_table");
         for (var i in idArray) {
             zjs.screen.changeStyle(idArray[i], "fontSize", "" + zjs.config.boardMagnifyPercent + "%");
         }
     }

     // パネル拡大率を変更する
     function nextMagnify() {
         var p = zjs.config.boardMagnifyPercent;

         switch (p) {
         case 100:
             p = 120; break;
         case 120:
             p = 150; break;
         case 150:
             p = 200; break;
         case 200:
             p = 100; break;
         default:
             p = 100; break;
         }
         setMagnify(p);
     }

     zjs.board.appendToLog = appendToLog;
     zjs.board.chopFirstBell1 = chopFirstBell1;
     zjs.board.setForm = setForm;
     zjs.board.getForm = getForm;
     zjs.board.displayReadme = displayReadme;
     zjs.board.displayKeybind = displayKeybind;
     zjs.board.displayLog = displayLog;
     zjs.board.showAdvice = showAdvice;
     zjs.board.fT = fT;
     zjs.board.bT = bT;
     zjs.board.setMagnify = setMagnify;
     zjs.board.nextMagnify = nextMagnify;
})();

zjs.bell = {
    audioArray: new Array(null, null, null, null), // Audioオブジェクトのリスト
    bellArray: null, // zjs.config.bellを参照
    bellWavArray: null, // zjs.config.bellWavArrayを参照
    ringMode: null, // zjs.config.ringModeを参照
    _dummy_: null
};

(function () {
     var prop = zjs.bell;

     // ベルを鳴らすための準備をする
     function setupRing() {
         prop.bellArray = zjs.config.bell;
         prop.bellWavArray = zjs.config.bellWavArray;
         prop.ringMode = zjs.config.ringMode;
         delete zjs.config.bell;
         delete zjs.config.bellWavArray;
         delete zjs.config.ringMode;

         switch (prop.ringMode) {
         case 0:
             zjs.screen.changeStyle("readme_ring", "display", "none");
             zjs.screen.changeStyle("iv_readme_ring", "display", "list-item");
             zjs.screen.changeStyle("belltest", "display", "none");
             for (var i = 0; i <= 3; i++) {
                 zjs.screen.changeStyle("bellsort" + i, "display", "none");
             }
             break;
         case 2:
             var code = "";
             for (var i = 1; i <= 3; i++) {
                 code += "<embed id=\"sound" + i + "\" type=\"audio/wav\" src=\"" + prop.bellWavArray[i] + "\" autostart=\"false\" width=\"0\" height=\"0\" enablejavascript=\"true\">";
             }
             document.getElementById("sound").innerHTML = code;
             break;
         case 3:
             for (var i = 1; i <= 3; i++) {
                 prop.audioArray[i] = new Audio(prop.bellWavArray[i]);
             }
             break;
         case 4:
             prop.audioArray[1] = new Audio(prop.bellWavArray[1]);
             prop.audioArray[2] = prop.audioArray[3] = prop.audioArray[1];
             break;
         default:
             break;
         }

         for (var i = 0; i <= 3; i++) {
             if (prop.bellArray[i].ring == 0) {
                 zjs.screen.changeStyle("timetr" + i, "display", "none");
             }
         }
         if (prop.bellArray[0].ring != 0 && prop.bellArray[1].ring == 0) {
             zjs.board.chopFirstBell1();
         }
     }

     // ベルを鳴らす
     function ring(wavid) {
         if (wavid != null && wavid > 0) {
             switch (prop.ringMode) {
             case 1:
                 document.getElementById("sound").innerHTML = "<embed id=\"embedsound\" type=\"audio/wav\" src=\"" + prop.bellWavArray[wavid] + "\" autostart=\"true\" hidden=\"true\" width=\"1\" height=\"1\">";
                 break;
             case 2:
                 document.getElementById("sound" + wavid).Play();
                 break;
             case 3:
                 prop.audioArray[wavid].play();
                 break;
             case 4:
                 if (wavid > 1 && zjs.clock.clockRing > 0) {
                     break;
                 }
                 prop.audioArray[1].pause();
                 prop.audioArray[1].play();
                 if (wavid > 1) {
                     zjs.clock.intervalOnRing(wavid - 1);
                 }
                 break;
             default:
                 break;
             }
         }
     }

     zjs.bell.setupRing = setupRing;
     zjs.bell.ring = ring;
})();

zjs.screen = {
    color: { // 時計表示の色．初期化は直後の匿名関数内で行う
        base: null, // 色セットのリスト
        index: 2, // 時刻表示(0,1,2,3)．zjs.config.colorIndexの値で上書きされる
        array: null // 色セット
    },
    timeColor: null, // 時刻表示の色．初期化は直後の匿名関数内で行う
    statusLabel: null, // 時計状態の表示内容．初期化は直後の匿名関数内で行う
    scrWidth: 0, // 画面幅
    scrHeight: 0, // 画面高さ
    hg: { // 砂時計の表示内容
        ratio: 0,
        color: "#ffc"
    },
    keybindId: "keybind", // 「ショートカットキー」ボタンで表示/非表示の要素
    _dummy_: null
};

(function () {
     var prop = zjs.screen;

     prop.color.base = new Array(zjs.config.colorArray1, zjs.config.colorArray2, zjs.config.colorArray1, zjs.config.colorArray2);
     prop.color.array = prop.color.base[prop.color.index];
     prop.timeColor = prop.color.array[0].timeColor;
     prop.statusLabel = prop.color.array[0].statusLabel;

     // スタイル変更
     function changeStyle(id, style, value) {
         var obj = document.getElementById(id);
         if (obj) {
             obj.style[style] = value;
         }
     }

     // 時刻表示の色変更
     function setTimeColor() {
         var colorStatus;

         // zjs.bell.bellArray[?].ring は 0:使用しない, 1:まだ鳴らしていない, 2:すでに鳴らした
         if (zjs.bell.bellArray[3].ring == 2) {
             colorStatus = 5;
         } else if (zjs.bell.bellArray[2].ring == 2) {
             colorStatus = 4;
         } else if (zjs.bell.bellArray[1].ring == 2) {
             colorStatus = 3;
         } else if (zjs.bell.bellArray[0].ring == 2) {
             colorStatus = 2;
         } else if (zjs.clock.etime1 + zjs.clock.etime2 > 0) {
             colorStatus = 1;
         } else {
             colorStatus = 0;
         }
         if (colorStatus >= 4 && (zjs.bell.bellArray[3].ring == 0 || zjs.bell.bellArray[2].etime == zjs.bell.bellArray[3].etime)) {
             colorStatus = 6;
         }

         prop.timeColor = prop.color.array[colorStatus].timeColor;
         prop.statusLabel = prop.color.array[colorStatus].statusLabel;
         if (colorStatus != 0 && !zjs.clock.clockTick) {
             prop.statusLabel = prop.color.array[0].statusLabel;
         }

         changeStyle("time", "color", prop.timeColor);
         document.getElementById("timestatus").innerHTML = prop.statusLabel;
         changeStyle("timestatus", "color", prop.timeColor);
     }

     // 時計表示
     function displayTime(etime) {
         var dtime; // 経過時間(ミリ秒)

         if (prop.color.index & 1 == 1) {
             dtime = etime; // 経過時間
         } else if (etime <= zjs.bell.bellArray[2].etime) {
             dtime = zjs.bell.bellArray[2].etime - etime; // 発表残り時間(ミリ秒)
         } else {
             dtime = etime - zjs.bell.bellArray[2].etime; // 質疑経過時間(ミリ秒)
         }
         var esec = Math.floor(dtime / 1000); // 表示する秒
         var emin = Math.floor(esec / 60); // 表示する分
         esec = esec % 60;

         var eminStr = (emin < 10 ? "0" : "") + emin;
         var esecStr = (esec < 10 ? "0" : "") + esec;
         document.getElementById("timemin").innerHTML = eminStr;
         document.getElementById("timesec").innerHTML = esecStr;
         setTimeColor();

         if (etime <= zjs.bell.bellArray[2].etime) {
             prop.hg.ratio = etime / zjs.bell.bellArray[2].etime;
             prop.hg.color = "#026";
         } else if (etime <= zjs.bell.bellArray[3].etime) {
             prop.hg.ratio = 1 - (zjs.bell.bellArray[3].etime - etime) / (zjs.bell.bellArray[3].etime - zjs.bell.bellArray[2].etime);
             prop.hg.color = "#310";
         } else {
             prop.hg.ratio = 1;
             prop.hg.color = "#320";
         }
         refreshHourglass();

         if (zjs.clock.clockTick && etime % 1000 >= 600) {
             changeStyle("timeminlabel", "visibility", "hidden");
         } else {
             changeStyle("timeminlabel", "visibility", "visible");
         }
     }

     // ブラウザサイズ変更
     function resize() {
         if (zjs.config.hourglassMode != 0) {
             updateClock();
         }
         changeFontSize();
         setLongwise();
     }

     // 時計表示の位置(縦方向)変更
     function setLongwise() {
         if (zjs.config.longwiseMode == 0) {
             return;
         }

         var pad = 0;
         if (zjs.clock.clockTick) {
             // 算出方法は要見直し
             pad = document.body.clientHeight - document.getElementById("time").offsetHeight - 2 * document.getElementById("timestatus").offsetHeight;
             pad /= 2;
         }
         changeStyle("time", "paddingTop", "" + pad);
     }

     // 砂時計表示変更
     function refreshHourglass() {
         if (zjs.config.hourglassMode == 2 || (zjs.config.hourglassMode == 1 && zjs.clock.clockTick)) {
             var h = (1 - prop.hg.ratio) * document.body.clientHeight;
             changeStyle("body", "backgroundColor", prop.hg.color);
             changeStyle("sand", "height", "" + h + "px");
             changeStyle("sand", "display", "block");
             if (zjs.config.debugMode) {
                 document.getElementById("debugmessage").innerHTML += ", h=" + h + ", zjs.screen.hg.ratio=" + prop.hg.ratio + ", zjs.screen.hg.color=" + prop.hg.color;
             }
         } else {
             changeStyle("body", "backgroundColor", "black");
             changeStyle("sand", "display", "none");
         }
     }

     // フォントサイズ変更
     function changeFontSize() {
         prop.scrWidth = document.body.clientWidth;
         prop.scrHeight = document.body.clientHeight;

         if (zjs.config.debugMode) {
             document.getElementById("debugmessage").innerHTML = "test: width=" + prop.scrWidth + ", height=" + prop.scrHeight;
         }

         if (zjs.config.digitScale > 0) {
             var fs = prop.scrWidth * zjs.config.digitScale * 0.01;
             changeStyle("timemin", "fontSize", "" + fs + "pt");
             changeStyle("timesec", "fontSize", "" + fs + "pt");
         }

         if (zjs.config.minsecLabelScale > 0) {
             var fs = prop.scrWidth * zjs.config.minsecLabelScale * 0.01;
             changeStyle("timeminlabel", "fontSize", "" + fs + "pt");
             changeStyle("timeseclabel", "fontSize", "" + fs + "pt");
             changeStyle("timestatus", "fontSize", "" + fs + "pt");
         }

         setLongwise();
     }

     // 時間表示方法の変更(引数は0,1,2,3)
     function changeTimeColorLabel(index) {
         prop.color.index = index;
         prop.color.array = prop.color.base[prop.color.index];
         updateTitle();
         setTimeColor();
         updateClock();
     }

     // タイトルバー変更
     function updateTitle() {
         if (!zjs.config.noChangeTitle) {
             var title = zjs.config.titleArray[prop.color.index];
             if (zjs.clock.countMark > zjs.config.countMarkInitial) {
                 title = "<" + zjs.clock.countMark + "> " + title;
             }
             document.title = title;
         }
     }

     // 時間表示方法の変更(トグル)
     function toggleTimeColorLabel() {
         changeTimeColorLabel((prop.color.index + 1) % 2);
     }

     // 時刻更新
     function updateClock() {
         var etime = zjs.clock.getElapsedTime();

         if (zjs.config.debugMode) {
             document.getElementById("debugmessage").innerHTML = "etime=" + etime + ", etime1=" + zjs.clock.etime1 + ", etime2=" + zjs.clock.etime2;
         }

         // 分秒の表示変更
         displayTime(etime);

         // ベルを鳴らす
         for (var i = 0; i <= 3; i++) {
             if (zjs.bell.bellArray[i].ring == 1 && etime >= zjs.bell.bellArray[i].etime) {
                 zjs.bell.bellArray[i].ring = 2;
                 setTimeColor();
                 if (zjs.bell.bellArray[i].wavtype > 0) {
                     zjs.bell.ring(zjs.bell.bellArray[i].wavtype);
                 }
             }
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

     zjs.screen.changeStyle = changeStyle;
     // zjs.screen.setTimeColor = setTimeColor;
     zjs.screen.displayTime = displayTime;
     zjs.screen.resize = resize;
     zjs.screen.setLongwise = setLongwise;
     // zjs.screen.refreshHourglass = refreshHourglass;
     zjs.screen.changeFontSize = changeFontSize;
     zjs.screen.changeTimeColorLabel = changeTimeColorLabel;
     zjs.screen.updateTitle = updateTitle;
     zjs.screen.toggleTimeColorLabel = toggleTimeColorLabel;
     zjs.screen.updateClock = updateClock;
     zjs.screen.movePageTop = movePageTop;
     zjs.screen.movePageEnd = movePageEnd;
})();
