const TRIP_DATA={

// 時刻表、票價、營業時間都會變。這個日期是頁面上這些數字最後一次對過官方資料的時間。
verifiedAt:'2026-09-01',
volatileNote:'票價、時刻表與營業時間都可能變動。出發前 48 小時用各區塊的官方連結再核一次。',

// ─────────── 出發前必須清掉的事（key 需與 checklist 對應）───────────
priorityActions:[
{key:'usj',deadline:'最優先',title:'USJ 電子票加入官方 App',desc:'4 人票券都要能在各自手機或同行者手機離線叫出。',level:'P0'},
{key:'insurance',deadline:'出發前 7 天',title:'投保旅平險＋不便險',desc:'9 月是關西颱風季又搭廉航。不便險理賠班機與行李延誤，這趟一定要保。',level:'P0'},
{key:'baggage',deadline:'出發前 7 天',title:'查出 4 人回程托運額度',desc:'Peach 基本票不含托運。查訂位紀錄，把每個人幾公斤寫下來。',level:'P0'},
{key:'express',deadline:'售完前',title:'決定 9/24 Express Pass',desc:'萬聖節期間價格偏高，先想好觸頂後改買什麼。',level:'P0'},
{key:'roomtype',deadline:'入住前',title:'確認兩間房的房型與床型',desc:'逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置，不只看總房數。',level:'P0'},
{key:'iccard',deadline:'出發前',title:'確認每個人的交通卡方案',desc:'台灣 Android 手機開不了行動 Suica，要走實體卡。先分好誰是哪一種。',level:'P1'},
{key:'meat',deadline:'越早越好',title:'打電話訂 焼肉 ソウル',desc:'06-6643-3644。只收電話預約，沒有線上系統。訂 9/22（二）19:00、4 名。開放一個月前預訂，現在正好在範圍內。',level:'P1'},
{key:'weather',deadline:'9/20 晚上',title:'完成最終天氣檢查',desc:'看三件事：颱風動向、京都降雨、當週氣溫。',level:'P1'}],

// ─────────── 現場切換規則 ───────────
decisions:[
{when:'D1 · 15:15',badge:'CUT-OFF',title:'巴士是否還等 15:32',rule:'15:15 前已領到行李並往 T2 巴士站移動才搭 15:32；否則直接切 16:32 到上本町。',tone:'amber',action:'開官方時刻表',url:'https://www.kate.co.jp/timetable/detail/UH/dep'},
{when:'D1 · 大幅延誤',badge:'FALLBACK',title:'巴士收班就改搭南海電鐵',rule:'班機延誤到巴士末班之後，不要在機場等。改搭南海電鐵到なんば（往なんば末班 23:55），再走或搭計程車到飯店。先傳訊息告訴飯店會晚到。',tone:'amber',action:'南海電鐵官網',url:'https://www.nankai.co.jp/'},
{when:'D2 · 訂不到時',badge:'PLAN B',title:'ソウル 訂不到就改 キナシ',rule:'ソウル 只能電話訂，訂不到就改 ヤキニク キナシ 心斎橋（食べログ 3.56、312 則），TableCheck 線上就能訂，而且在飯店旁邊。',tone:'blue'},
{when:'每天 · 出門前',badge:'HEAT',title:'體感 30°C 以上就降速',rule:'9 月下旬關西仍然很熱。隨身帶水、每 2 小時進一次冷氣、上坡段改計程車，不硬撐。',tone:'amber'},
{when:'D4 · 一整天',badge:'NO RE-ENTRY',title:'進了 USJ 就不能出園',rule:'一般 Studio Pass 不能再入場（年間パス 除外）。休息一律在園內解決，走出閘門就回不去，晚上的 Halloween Horror Nights 也一起沒了。',tone:'amber',action:'官方票券注意事項',url:'https://www.usj.co.jp/web/ja/jp/tickets/terms/studiopass/notice'},
{when:'落後 30 分鐘時',badge:'CUT',title:'砍掉下一個可跳過的點',rule:'不要用走快一點把進度追回來，那只會把疲勞累積到晚上。直接砍掉下一個標「可跳過」的站，把時間還給當下正在逛的地方。這趟每天都排得很滿，砍一站不會少看什麼。',tone:'blue'},
{when:'D2 · 早上',badge:'OPTIONAL',title:'早上兩站都可以跳過',rule:'睡眠不足或下雨就直接睡到 09:30，10:30 進 Den Den Town。八阪神社與黑門市場都免費，跳過不損失金錢。',tone:'blue'},
{when:'D3 · 出發前',badge:'RAIN B',title:'京都大雨改走室內線',rule:'縮短伏見稻荷，改三十三間堂、錦市場、寺町與新京極商店街。',tone:'green',action:'京都官方雨天建議',url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019'},
{when:'任何一天',badge:'TYPHOON',title:'颱風警報就切應急流程',rule:'先確認航班狀態，再決定當天行程。不要在颱風日排長距離移動，細節看「應急」分頁。',tone:'amber',action:'查 KIX 航班狀態',url:'https://www.kansai-airport.or.jp/flight'}],

// ─────────── 錢 ───────────
moneyPlan:{
cashPerPerson:'¥30,000–40,000',
cashForGroup:'¥120,000–160,000',
tripBudget:'約 ¥48,000–60,000 / 人',
tripBudgetNote:'不含機票、飯店、USJ 門票與大額購物；包含交通、餐食、門票、Express 預算與零星支出。',
breakdown:[
['交通卡加值','¥3,000–5,000','車站加值機多數要用現金。'],
['餐食','¥10,000–14,000','含 9/22 焼肉 ソウル（客單價約 ¥4,000）；USJ 園內偏貴。'],
['門票','¥1,000–3,000','砍掉 Harukas 後只剩清水寺等零星入場費。不含 USJ 門票與 Express。'],
['小店／市場／零星','¥8,000–12,000','京都小店、錦市場與臨時餐食。'],
['緊急備用','¥10,000','分開保管，不把 4 人現金放同一人身上。']],
sourceUrl:'https://www.japan.travel/en/plan/cashless-payments-in-japan/'},

tickets:{
caption:'交通費之外真正會掏錢的入場費，出發前用官網校正一次。',
items:[
['Harukas 300 展望台','已刪除','原本要 ¥2,000 / 人。砍掉後 4 人省下約 ¥8,000，D2 動線也不用再繞去天王寺。'],
['USJ Express Pass','¥16,800 起 / 人','9/24 落在萬聖節期間，價格通常高於平日。'],
['清水寺 本堂','約 ¥500 / 人','伏見稻荷、八坂神社、錦市場、花見小路都免費。'],
['D2 早上兩站','¥0','難波八阪神社與黑門市場都不用門票，只有吃東西要錢。'],
['三十三間堂','約 ¥600 / 人','只有啟用京都雨天版才會用到。']],
note:'USJ 一日券假設已購入。Express 若超過每人 ¥20,000 就改看 Pass 4 或萬聖節組合。'},

// ─────────── 免稅與行李 ───────────
taxFree:{
caption:'這趟仍是「店頭直接免稅」的舊制；2026/11/1 之後才改成出境退款。',
rules:[
['帶護照本人到場','免稅要本人＋護照，同行者不能代刷。Visit Japan Web 的免稅 QR 先截圖。'],
['兩類商品分開算門檻','一般物品（3C、服飾）與消耗品（藥妝、食品）各自要滿 ¥5,000，不能合併湊。'],
['消耗品封袋不可拆','藥妝食品會被封袋，在日本境內拆開就要補稅。當下要用的東西另外買一份含稅的。'],
['封袋幾乎一定要托運','體積大又不能拆，直接影響回程公斤數。']],
warning:'Bic Camera、Donki、藥妝店結帳前先確認免稅櫃檯位置與截止時間，有些店晚上會提早關窗口。',
sourceUrl:'https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00019.html'},

baggage:{
caption:'Peach 行李規則比一般航空嚴，這四格每個人都要有答案。',
carryOn:'隨身＋手提合計 2 件、7kg 內',
checked:'基本票不含托運，依實際加購方案',
rules:[
['寫下每個人的托運公斤數','查訂位紀錄，把 4 個人的額度記進緊急資訊卡或群組。'],
['行動電源只能隨身','不可托運。出發前再核對 Peach 最新容量規定。'],
['回程前一晚就秤','不要留到當天早上，超重現場加購最貴。'],
['重物集中 D2 晚上買','買完直接回飯店整理，不要提著逛一整天。']],
warning:'藥妝封袋＋3C＋USJ 周邊，4 個人很容易一起超重。行李秤帶了要真的用。'},

// ─────────── 網路與交通卡 ───────────
connectivity:{
caption:'手機能不能刷卡進站，出發前就要有答案，不要到現場才試。',
groups:[
{title:'iPhone 8 以上',desc:'可直接在 Apple Wallet 開 Suica 或 ICOCA，用信用卡加值，不必現金。台灣買的機器也可以。',tone:'green'},
{title:'台灣買的 Android',desc:'開不了行動 Suica（需要日本機的 FeliCa），只能用實體卡。',tone:'amber'},
{title:'實體卡在哪裡買',desc:'D1 從 T2 直接搭巴士進市區，路上沒有販賣點。最早機會是 D2 早上到心齋橋站，找粉紅色售票機買 ICOCA（販售時段約 05:00–23:00）。',tone:'amber'},
{title:'D1 晚上不受影響',desc:'心齋橋、道頓堀全程步行可到，沒有卡也不會卡住。',tone:'blue'}],
esim:'KKday SoftBank eSIM 4 人各一張，台灣先安裝、到日本再啟用行動數據。Google Maps 先下載大阪與京都離線地圖。'},

// ─────────── 訂位與飲食 ───────────
dining:{
caption:'這趟只有一餐有訂位，其餘都是現場排。先知道哪幾餐有風險。',
reservations:[
['9/22 19:00','焼肉 ソウル（第一志願）','只收電話 06-6643-3644，開放一個月前預訂','risk'],
['9/22 19:00','ヤキニク キナシ 心斎橋（備案）','TableCheck 線上可訂，訂不到 ソウル 就改這家','booked'],
['其餘每一餐','現場排隊','日本小店常只有吧台，4 人同桌比想像中難','risk']],
tips:[
['排隊前先問能不能 4 人同桌','不要排 30 分鐘才發現只能拆兩桌。'],
['過敏與忌口先寫成日文','存在手機備忘錄直接給店員看，比現場比手畫腳快。'],
['連假熱門店排更久','9/21–9/23 是三連假，超過 20 分鐘的隊就換下一家。']],
allergyCard:'アレルギーがあります。◯◯ が食べられません。この料理に入っていますか？'},

// ─────────── 應急 ───────────
emergency:{
hotlines:[
['110','警察','搶劫、事故、失竊'],
['119','救護車／消防','受傷、急病、火災'],
['090-8794-4568','台北駐大阪辦事處 急難救助','限緊急危難：車禍、生命安危'],
['06-6227-8623','台北駐大阪辦事處 辦公室','上班時間的護照等領務事項'],
['050-3816-2787','Japan Visitor Hotline','24 小時，支援中文，觀光與醫療諮詢']],
medical:[
['先問飯店櫃台','櫃台通常知道附近能接待外國人的醫院，也能幫忙打電話。'],
['輕症先找藥局','藥妝店有藥劑師，感冒、腸胃、止痛都買得到，比跑醫院快。'],
['一定要拿收據','收據與診斷證明是回台申請理賠的必要文件，當場就要拿。'],
['處方藥保留原包裝','避免入境或就醫時說不清楚。']],
lost:{
warning:'駐大阪辦事處只有週一至週五上班。你們 9/21–9/23 是日本連假、9/25 中午就要飛，實際上只有 9/24（週四）辦得了事——而那天是 USJ。護照掉了幾乎等於賠掉一整天。',
steps:[
['先去最近的警察署報案','拿到「遺失報案證明」。沒有這張，辦事處無法受理，這是第一步不能跳。'],
['打急難救助專線說明狀況','090-8794-4568。先問清楚當天能不能受理、要帶什麼。'],
['去車站的証明写真機拍照','需要 2 張 4.5 × 3.5 cm、六個月內、白底脫帽的彩色照片。日本車站與便利商店旁到處都有自助拍照機。'],
['趕不及補發就申請入國證明書','補發護照要 6–8 週，短期旅客來不及。改申請「入國證明書」先回台灣，回國後再補發護照。'],
['信用卡另外打回台灣掛失','卡片遺失跟證件遺失是兩條線，發卡行的海外掛失電話出發前就存好。']],
office:'受理 9:00–11:00 / 13:00–14:30，取件 9:00–11:30 / 13:00–15:00（週一至週五）'},
noNetwork:{
warning:'導航、翻譯、USJ 抽整理券全都要網路。eSIM 沒啟用成功在落地第一天相當常見，不要 4 個人同時卡住。',
steps:[
['先確認不是飛航模式或資料漫遊沒開','多數「eSIM 壞掉」其實是這兩個設定，先檢查再說。'],
['4 人不要同時只靠 eSIM','先確定至少一個人連得上，其他人用他的熱點撐到解決為止。'],
['關西機場就有電信櫃台與 SIM 販賣機','落地時發現有問題就當場處理，進市區後選擇會變少。'],
['離線也能用的東西先備好','Google Maps 離線地圖、飯店日文地址、機票與訂房截圖，這些不靠網路。'],
['聯絡 KKday 客服','購買紀錄與 QR 在 KKday App 裡，重新安裝通常要客服協助。']]},
sourceUrl:'https://www.roc-taiwan.org/jposa/post/25777.html'},

typhoon:{
caption:'9 月下旬是關西颱風季，Peach 班次少、改期不容易，要提早判斷。',
stages:[
{when:'出發前 3 天',title:'開始追颱風動向',steps:['每天看一次日本氣象廳與 KIX 官網。','確認旅平險／不便險的理賠條件與所需文件。','把 Peach 客服管道與訂位代號存進手機。']},
{when:'旅程中發布警報',title:'先改當天，不改全部',steps:['當天不排長距離移動，京都那種來回行程直接改室內版。','電車可能停駛，出門前查 JR 西日本與 Osaka Metro 運行資訊。','USJ 強風大雨時戶外設施會停開，園區本身通常照常營業。']},
{when:'回程當天',title:'班機受影響的處理順序',steps:['先查航班狀態，不要先衝機場。','聯絡 Peach 確認改期或退票方式。','聯絡飯店確認能不能加住一晚。','全程保留單據，回台申請不便險理賠。']}],
links:[['KIX 航班狀態','https://www.kansai-airport.or.jp/flight'],['日本氣象庁 警報','https://www.jma.go.jp/bosai/warning/'],['JR 西日本 運行情報','https://trafficinfo.westjr.co.jp/']]},

phrases:[
['不好意思／請問','すみません','su-mi-ma-sen'],
['這個多少錢','これはいくらですか','ko-re-wa i-ku-ra des-ka'],
['4 位，可以嗎','4名、大丈夫ですか','yo-n-mei dai-jou-bu des-ka'],
['我要免稅','免税でお願いします','men-zei de o-ne-gai-shi-mas'],
['廁所在哪裡','トイレはどこですか','toi-re wa do-ko des-ka'],
['我身體不舒服','気分が悪いです','ki-bun ga wa-ru-i des'],
['請幫我叫救護車','救急車を呼んでください','kyuu-kyuu-sha wo yon-de ku-da-sai'],
['我迷路了','道に迷いました','mi-chi ni ma-yoi-ma-shi-ta']],

// ─────────── 買什麼（不知道要買什麼時的參考清單）───────────
souvenirs:{
caption:'網路上被推薦最多次的品項，按你們哪一天會走到來分。不是待辦清單，是想不到要買什麼的時候翻的。',
groups:[
{key:'drug',title:'藥妝與常備藥',where:'D2 晚上 Donki／藥妝店',tone:'blue',items:[
['EVE 止痛藥','頭痛與生理痛，台灣人帶最多的一款。'],
['龍角散','喉嚨不適，粉狀與喉糖都有。'],
['太田胃散','吃太多、胃脹的老牌成藥。'],
['樂敦 / Sante FX 眼藥水','清涼感分等級，怕刺激選低數字的。'],
['撒隆巴斯 痠痛貼布','走一整天後的救命品。'],
['休足時間','貼小腿的清涼舒緩貼片。京都＋USJ 連兩天會很需要。'],
['花王 蒸氣眼罩','熱敷眼罩，長途飛機與睡前用。'],
['無比滴','蚊蟲叮咬止癢。'],
['合利他命','維他命 B 群類保健品。']]},
{key:'beauty',title:'開架美妝',where:'D2 晚上 Donki／藥妝店',tone:'blue',items:[
['肌研 Hada Labo','化妝水，藥妝店常年熱銷。'],
['Curel 珂潤','敏感肌保養線。'],
['LuLuLun 面膜','大包裝天天敷，重但便宜。'],
['CANMAKE / CEZANNE','平價開架彩妝。'],
['Anessa 防曬','9 月下旬還是很曬，這趟自己也用得到。'],
['FANCL 卸妝油','代購常客。']]},
{key:'osaka',title:'大阪限定食品',where:'D2 晚上／回程前',tone:'amber',items:[
['りくろーおじさん 現烤起司蛋糕','大阪最經典的一款，但是現烤、賞味期限很短，適合當天自己吃。'],
['月化粧（青木松風庵）','牛奶饅頭，常溫、好帶、送人不出錯。'],
['たこパティエ','章魚燒風味的千層酥，包裝很大阪。'],
['大阪限定 Pocky / KitKat','便利商店與土產店都有，分裝送同事最方便。'],
['Pablo 起司塔','半熟起司塔，有常溫版本比較好帶。']]},
{key:'kyoto',title:'京都限定',where:'D3 錦市場・河原町',tone:'green',items:[
['阿闍梨餅（滿月）','單顆約 ¥141，京都伴手禮的常勝軍。'],
['生八ツ橋（井筒八ッ橋・夕子）','肉桂與抹茶口味；「夕子」是包餡版本。'],
['茶之菓（MALEBRANCHE 京都北山）','宇治抹茶貓舌餅乾夾白巧克力。'],
['祇園辻利 抹茶捲心餅','抹茶控的安全牌。'],
['京ばあむ','抹茶豆乳年輪蛋糕。'],
['伊藤久右衛門 宇治抹茶大福','抹茶系另一個常被點名的品牌。']]},
{key:'usj',title:'USJ 限定',where:'D4 園內',tone:'amber',note:'限定商品汰換很快，這裡的品項與價格只是方向。入園當天以 USJ 官方 App 的商店資訊為準。',items:[
['無敵星星爆米花桶','約 ¥4,800，真的會發光，有閃爍與恆亮兩種模式。'],
['瑪利歐賽車爆米花桶','約 ¥5,500，輪胎會發光，收納空間較大。'],
['哈利波特 時光器爆米花桶','環形結構與沙漏造型，近年的收藏話題款。'],
['能量手環 Power-Up Band','玩 SUPER NINTENDO WORLD 互動關卡要用，不是純紀念品。'],
['問號磚塊鑰匙圈','小、便宜、好分送。'],
['巧克力蛙 / 小小兵泡麵','園區零食類，重量輕。']]},
{key:'anime',title:'動漫與模型',where:'D2 Den Den Town',tone:'blue',items:[
['中古模型與扭蛋','Surugaya 的二手區是這一帶的主場。'],
['一番賞','現場抽，抽完就沒有，看到喜歡的別猶豫。'],
['二手遊戲片','注意主機區碼與語言。'],
['同人誌 / 設定集','台灣不容易買到，體積小重量輕。']]},
{key:'tech',title:'3C 與相機',where:'D2 Bic Camera',tone:'blue',items:[
['相機配件・記憶卡','鏡頭濾鏡、電池、SD 卡在這裡選擇比台灣多。'],
['二手鏡頭','想看就順路去 Naniwa Camera。'],
['小家電','日本是 100V，台灣 110V 多數可用，但吹風機與電鍋務必先確認標示。'],
['Switch 遊戲片','注意語言與是否鎖區。']]}],
banned:{
title:'買了帶不回台灣的東西',
items:[
['所有肉類加工品','551 蓬莱的豬肉包、肉乾、香腸、貢丸都不行，真空包裝也一樣。這是台灣入境的硬規定，違規最高可罰 100 萬元。想吃就在日本吃掉。'],
['新鮮水果與蔬菜','含種子的植物類一併禁止。'],
['成藥有數量上限','非處方藥每種最多 12 瓶（盒、罐、條、支），合計不超過 36 瓶，且限原包裝、僅供自用。'],
['免稅封袋不能拆','消耗品的封袋在日本境內拆開就要補稅，直接進托運。']]}},

groupRules:[
['分開逛就先定集合','講好時間與地點再散開，地點挑店門口或車站出口這種不會認錯的點。'],
['集合點用 Google Maps 傳','不要只講店名，直接傳定位。'],
['現金不集中在一個人身上','緊急備用金分開放，任何一人走失都還有錢。'],
['約好失聯後的動作','手機沒電或走散就回上一個集合點等，不要各自亂找。']],

// ─────────── 連結與速覽 ───────────
quickLinks:[
{title:'eSIM',desc:'KKday 日本 SoftBank eSIM',url:'https://www.kkday.com/zh-tw/product/149025-japan-network-card-softbank-high-speed-500mb-1gb-2gb-3gb-esim',label:'KKday eSIM'},
{title:'Visit Japan Web',desc:'入境審查＋海關＋免稅 QR，建議截圖',url:'https://services.digital.go.jp/zh-cmn-hant/visit-japan-web/',label:'官方繁中頁'},
{title:'役男出境申請',desc:'有役男身分者確認是否需要申請',url:'https://service.dca.moi.gov.tw/departure/app/Departure/main',label:'內政部役政司'},
{title:'USJ Express Pass',desc:'9/24，4 人同方案且 ≤ ¥20,000 / 人就買',url:'https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka',label:'KKday Express Pass'}],

costs:[
['D1 ¥1,800','KIX → 心齋橋巴士'],['D2 約 ¥380','Metro 2 段；不買一日券'],['D3 約 ¥1,600','大阪 ↔ 京都電車'],['D4 約 ¥440','心齋橋 → USJ'],['D5 ¥1,800','USJ → KIX 巴士'],['合計約 ¥6,020','每人；不含計程車與門票']],

// ─────────── 每日行程 ───────────
days:[
{id:'d1',no:'DAY 1',date:'9/21（一）',title:'抵達大阪・心齋橋',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/1280px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg',alt:'大阪道頓堀夜景',items:[
{time:'13:20',title:'KIX T2 抵達',desc:'Peach 在第 2 航廈。Visit Japan Web 先做好，領完行李直接進城。',note:'T2 到巴士站這段沒有 IC 卡販賣點，今天不需要卡也沒關係。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]},
{time:'15:15 決定',title:'趕得上就搭 15:32 直達巴士',desc:'15:15 前已領到行李並往 T2 巴士站移動才保留直達；否則不要追車。',status:'decision',statusLabel:'切換點',note:'切到 16:32 的話，後面整條要跟著縮：17:46 上本町、計程車到飯店約 18:05–18:20，17:20 check-in 已經不可能。今晚第一個被砍的是 PARCO——先縮成 60 分鐘，19:30 前往道頓堀；若 18:45 之後才進飯店就整段砍掉，直接去吃飯。道頓堀不砍。',transport:{head:'KIX T2 → 心齋橋 Hotel Nikko',fare:'¥1,800 / 人',steps:['到第 2 航廈巴士乘車處，先買「近鉄上本町・心斎橋」車票。','15:32 T2 發車 → 16:59 Hotel Nikko Osaka 下車。','下車後步行約 10–15 分鐘到捷絲旅；不想拖箱就 4 人叫短程計程車。','未達 15:15 條件：改搭 16:32 T2 → 17:46 上本町，再分攤計程車到飯店。']},actions:[['官方時刻表','https://www.kate.co.jp/timetable/detail/UH/dep'],['導航到飯店','https://www.google.com/maps/dir/?api=1&origin=Kansai+International+Airport+Terminal+2&destination=Just+Sleep+Osaka+Shinsaibashi','route']]},
{time:'17:20',title:'捷絲旅 Check-in',desc:'前三晚固定住 Just Sleep Osaka Shinsaibashi。',note:'順便問清楚：早餐時間與地點、行李寄放規則、最近的便利商店。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Just+Sleep+Osaka+Shinsaibashi','map']]},
{time:'18:00–20:00',title:'心齋橋 PARCO＋心齋橋筋',desc:'先處理服飾、潮流、簡單購物。',status:'optional',statusLabel:'D1 第一個砍',note:'今天是敬老日連假第一天，商店街會比平常擠，別急著逛完。班機或巴士延誤時，這一站就是第一個縮短或砍掉的——服飾在 D2 的美國村還有一輪。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Shinsaibashi+PARCO','map']]},
{time:'20:00–21:45',title:'道頓堀＋拉麵＋第一輪藥妝',desc:'第一晚吃簡單。吃完順路把想買的藥妝先掃第一輪，不要全部壓到 D2 最後那一段。',note:'今晚全程步行可到，沒有交通卡也不影響。道頓堀的 Donki 是 24 小時營業，吃飽後再逛也來得及。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Dotonbori+Osaka','map']]}]},

{id:'d2',no:'DAY 2',date:'9/22（二）',title:'大阪購物主日＋燒肉',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Namba-Yasaka-Shrine-lions_head_theater.jpg/1280px-Namba-Yasaka-Shrine-lions_head_theater.jpg',alt:'難波八阪神社巨大獅子殿',items:[
{time:'08:00',title:'心齋橋站｜只辦一件事',desc:'用 Android 的人在這裡買實體 ICOCA，之後幾天才刷得了卡。iPhone 的人不用來。',note:'不要買一日券。今天全程步行為主，Metro 頂多搭 2 段（約 ¥380），¥620 的 Enjoy Eco Card 反而虧。',transport:{head:'🎫 實體 ICOCA',fare:'¥2,000（含 ¥500 押金）',steps:['從飯店步行約 7–10 分鐘到心齋橋站。','找粉紅色售票機購買 ICOCA，販售時段約 05:00–23:00。','iPhone 的人在 Apple Wallet 開卡就好，不必特地過來。']}},
{time:'08:25–09:05',title:'難波八阪神社｜巨大獅子殿',desc:'高 12m、寬 11m、深 10m 的獅子頭絵馬殿，1974 年建立。免費參拜，早上幾乎沒人，好拍。',status:'optional',statusLabel:'可跳過',note:'6:30 就開，所以睡不飽也不必硬起床，晚一點來一樣進得去。',transport:{head:'心齋橋 M19 → なんば M20',fare:'約 ¥190 / 人（刷 ICOCA / Suica）',steps:['御堂筋線往なかもず方向，一站就到。','なんば下車後步行約 6 分鐘到神社。','不想搭車也可以從飯店直接走過去，約 15–20 分鐘，省下這段車資。']},actions:[['官方網站','https://nambayasaka.jp/'],['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Namba+Yasaka+Shrine','map']]},
{time:'09:20–10:20',title:'黑門市場｜吃早餐',desc:'大阪的廚房。海鮮、玉子燒、水果現切，直接當早餐解決。',note:'各店營業時間不一，官方也只寫「因店而異」。多數 9:00 後才開，太早到會有一半沒開。',transport:{head:'🚶 難波八阪神社 → 黑門市場',fare:'步行約 12 分鐘',steps:['從神社往東北方向走，穿過難波的巷弄。','黑門市場就在 Osaka Metro 千日前線「日本橋」站出站即到。','逛完直接往南接 Den Den Town，不用再搭車。']},actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Kuromon+Ichiba+Market','map']]},
{time:'10:30–13:30',title:'日本橋 Den Den Town',desc:'動漫、模型、遊戲主場。Surugaya → Joshin Super Kids Land → Animate。',transport:{head:'🚶 黑門市場 → Den Den Town',fare:'步行約 5 分鐘',steps:['從黑門市場南端出來，往堺筋方向走。','沿著堺筋一路往南就是 Den Den Town。','今天早上全程步行，沒有轉車。']},actions:[['📍 Surugaya','https://www.google.com/maps/search/?api=1&query=Surugaya+Nipponbashi+Osaka','map'],['📍 Joshin','https://www.google.com/maps/search/?api=1&query=Joshin+Super+Kids+Land+Osaka','map'],['📍 Animate','https://www.google.com/maps/search/?api=1&query=Animate+Osaka+Nipponbashi','map']]},
{time:'13:30–14:15',title:'拉麵午餐',desc:'選日本橋／難波當下排隊短的店，不為網紅店浪費 60–90 分鐘。',note:'先問能不能 4 人同桌，很多小店只有吧台。'},
{time:'14:25–15:40',title:'Bic Camera 難波＋相機店',desc:'3C、相機、配件集中處理；想看二手鏡頭順便看 Naniwa Camera。',note:'免稅要帶護照本人。一般物品與消耗品門檻分開算，不能合併湊 ¥5,000。',actions:[['📍 Bic Camera','https://www.google.com/maps/search/?api=1&query=Bic+Camera+Namba','map'],['📍 Naniwa Camera','https://www.google.com/maps/search/?api=1&query=Naniwa+Camera+Namba+Marui','map']]},
{time:'16:00–17:20',title:'Orange Street＋美國村',desc:'潮牌、古著、鞋店。4 人可分開逛。',note:'散開前先講好幾點、在哪裡集合，並用 Google Maps 傳定位。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Orange+Street+Osaka','map']]},
{time:'17:20–17:50',title:'回飯店放購物袋',desc:'今天買最多的一段已經結束，先卸貨再去吃飯。',note:'不放的話，你們要提著 3C 與藥妝進燒肉店。',status:'decision',statusLabel:'動線關鍵'},
{time:'17:50–18:40',title:'空白｜今天唯一的休息',desc:'不排任何行程。洗個澡、躺一下，或在心齋橋附近隨便走走都可以。',status:'free',statusLabel:'不排行程',note:'今天從 08:00 走到現在。明天 06:20 就要出門去京都，這段休息是為了明天，不是浪費。'},
{time:'19:00–20:45',title:'焼肉 ソウル｜這趟的主餐',desc:'食べログ 3.72、569 則評價，焼肉 WEST 百名店 2024＋2025 連兩年入選。招牌是ハラミ三種盛與上塩タン。客單價約 ¥4,000。',note:'只接受電話預約：06-6643-3644，訂 19:00。54 席、無個室、定休週四（逢假日照常營業），9/22 確定有開。',transport:{head:'🚶 心齋橋 → 焼肉 ソウル',fare:'步行約 15 分鐘',steps:['沿心齋橋筋往南走到難波，再往元町方向。','懶得走就搭御堂筋線一站到なんば，32 號出口步行 5 分鐘。','地址：大阪市浪速区元町 2-7-24。']},actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Yakiniku+Soul+Motomachi+Naniwa+Osaka','map']]},
{time:'20:45–21:40',title:'藥妝 / Donki 補貨',desc:'重物集中今晚買，回飯店直接整理。',note:'4 個人加上免稅結帳，30 分鐘一定不夠——光排免稅櫃檯就可能吃掉一半。抓 55 分鐘，22:00 前回到飯店。消耗品會被封袋，在日本拆開要補稅，當下要用的另外買一份含稅的。',actions:[['📍 Donki 道頓堀','https://www.google.com/maps/search/?api=1&query=Don+Quijote+Dotonbori+Osaka','map']]}]},

{id:'d3',no:'DAY 3',date:'9/23（三）',title:'京都經典一日',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Fushimi_Inari-taisha_senbon-torii%2C_August_2019.jpg/1280px-Fushimi_Inari-taisha_senbon-torii%2C_August_2019.jpg',alt:'伏見稻荷千本鳥居',
weatherPlan:{title:'天氣切換',url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019',branches:[
{tag:'大雨',trigger:'前一晚預報持續降雨，或當天體感已不適合長距離步行',steps:['伏見稻荷只走入口與前段鳥居，最晚 08:30 離開。','取消清水寺長上坡，改三十三間堂等室內景點。','下午集中錦市場、寺町與新京極商店街。']},
{tag:'高溫',trigger:'預報 30°C 以上，或上午就已經明顯悶熱',steps:['每人出門前先買 2 瓶水，看到便利商店就補。','清水五條到清水寺那段上坡直接 4 人叫計程車，不要走。','午餐拉長到 90 分鐘，在冷氣裡休息夠再出發。']}]},
items:[
{time:'06:20',title:'心齋橋 → 伏見稻荷',desc:'秋分日，京都一定早出。',note:'今天是連假最後一天，也是彼岸期間，寺社人潮比平常多。',transport:{head:'🚇＋🚆 心齋橋 → 伏見稻荷',fare:'約 ¥680',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 淀屋橋 M17。','步行轉京阪淀屋橋 KH01。','往出町柳方向；若搭特急，在丹波橋轉準急／普通。','伏見稲荷 KH34 下車；全程直接刷交通卡。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Fushimi+Inari+Taisha&travelmode=transit','route']]},
{time:'07:35–09:10',title:'伏見稻荷',desc:'千本鳥居走到中段就回，不攻完整稻荷山。',note:'鳥居隧道要拍空景就是現在，9 點後人潮會塞住整條路。參道請靠邊拍，不要擋住通行。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha','map']]},
{time:'09:20–10:15',title:'伏見稻荷 → 清水寺',desc:'到清水五條後，上坡若太熱／下雨可 4 人分攤計程車。',transport:{head:'🚆 伏見稻荷 KH34 → 清水五條 KH38',fare:'約 ¥240',steps:['搭京阪本線往出町柳方向。','普通／準急都可以，清水五條下車。','步行上坡約 20–25 分鐘到清水寺。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Fushimi+Inari+Taisha&destination=Kiyomizu-dera&travelmode=transit','route']]},
{time:'10:20–12:30',title:'清水寺 → 三年坂 → 二年坂',desc:'主景點上午完成，避開午後最大人潮。',note:'八坂塔（法観寺）那個經典街景在二年坂往下走的巷口，順路不用繞。',actions:[['📍 清水寺','https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Kyoto','map']]},
{time:'12:30–15:00',title:'午餐 A / B / C＋祇園',desc:'12:20 看排隊長度，選第一個能在 20 分鐘內入座的方案；不為名店打亂下午。',status:'choice',statusLabel:'現場三選一',note:'花見小路的巷弄是私人道路，禁止攝影，違規會被開罰。要拍就在四条通那側的公共道路拍。',choices:[{label:'A · 最近',title:'祇園 京めん',desc:'京風烏龍／蕎麥；祇園會館 1F，動線最短。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Kyomen+Kyoto'},{label:'B · 傳統',title:'祇園權兵衛',desc:'蕎麥、烏龍與丼飯；適合想坐下吃完整午餐。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Gonbe+Kyoto'},{label:'C · 雨天',title:'四条河原町餐廳層',desc:'直接往百貨公司室內用餐，再接錦市場與商店街。',url:'https://www.google.com/maps/search/?api=1&query=Kyoto+Kawaramachi+department+store+restaurants'}],actions:[['八坂神社地圖','https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine+Kyoto','map'],['花見小路地圖','https://www.google.com/maps/search/?api=1&query=Hanamikoji+Street+Kyoto','map']]},
{time:'15:15–16:15',title:'錦市場｜只逛一小時',desc:'伴手禮與零食抓重點，不逛完整條。河原町百貨留到有力氣再說。',note:'錦市場禁止邊走邊吃，買了要在店門口吃完再走。垃圾也交回原店。刻意壓成一小時，是為了 16:30 就能上車。',actions:[['📍 錦市場','https://www.google.com/maps/search/?api=1&query=Nishiki+Market+Kyoto','map']]},
{time:'16:30–18:00',title:'京都 → 心齋橋',desc:'比原訂早一小時離開京都，把時間換成今晚的睡眠。',note:'明天 05:50 起床。今天已經走了 10 小時，這一小時比多逛一條商店街值錢。',transport:{head:'🚆＋🚇 祇園四条 → 心齋橋',fare:'約 ¥680',steps:['祇園四条 KH39 搭京阪特急淀屋橋行。','淀屋橋轉御堂筋線往なかもず方向。','心齋橋 M19 下車。','今天總交通約 ¥1,600 / 人。']},actions:[['↗ 回飯店導航','https://www.google.com/maps/dir/?api=1&origin=Gion-Shijo+Station&destination=Just+Sleep+Osaka+Shinsaibashi&travelmode=transit','route']]},
{time:'18:15–19:30',title:'晚餐｜就近解決',desc:'回飯店放東西後，在心齋橋、道頓堀一帶吃。居酒屋或定食都可以。',status:'decision',statusLabel:'不要走遠',note:'規則只有一條：離飯店步行 5 分鐘內、看到不用排隊的就進去。走了一整天還為了找店多走 15 分鐘，是這種行程最常見的崩潰點。'},
{time:'20:00–21:00',title:'整理行李＋早睡',desc:'明天全部行李帶走換飯店，今晚就要打包完。',note:'目標 21:30 上床。這是整趟唯一能為 D4 那 16 小時預先補的覺。'}]},

{id:'d4',no:'DAY 4',date:'9/24（四）',title:'USJ＋換住環球塔',image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/20/00/a2000380/img/basic/a2000380_thumbnail.jpg',alt:'日本環球影城',
weatherPlan:{title:'天氣切換',branches:[
{tag:'大雨',trigger:'當天有雨或雷雨預報',steps:['園區照常營業，但戶外雲霄飛車在強風大雨時會停開。','輕便雨衣比傘好用，排隊時撐傘會被要求收起來。','每人準備一雙替換襪，濕鞋撐一整天會毀掉當晚。']},
{tag:'高溫',trigger:'預報 30°C 以上',steps:['排隊區多半沒有遮蔽，帶水與電解質飲料。','中午最熱那兩小時安排室內設施或用餐。','有人開始頭暈就立刻進冷氣區休息，不要撐到晚上的活動。']}]},
items:[
{time:'05:50',title:'起床＋退房',desc:'全部行李一起帶走，不再回心齋橋。'},
{time:'06:15–07:05',title:'心齋橋 → Universal City',desc:'先到環球塔寄行李。',transport:{head:'🚇＋🚆 心齋橋 → Universal City',fare:'約 ¥440',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 梅田 M16。','跟「JR 大阪駅」指標走，不要走去阪急／阪神。','JR 大阪搭大阪環狀線往西九条方面。','若列車直通桜島／Universal City 就直接坐；否則西九条轉 JR ゆめ咲線桜島行。','ユニバーサルシティ下車。']},actions:[['↗ 換飯店導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Hotel+Keihan+Universal+Tower&travelmode=transit','route']]},
{time:'07:05',title:'寄行李＋買早餐',desc:'Hotel Keihan Universal Tower 離 JR Universal City 與 USJ 都非常近。放下行李順便解決早餐。',note:'問四件事：入住從幾點開始、櫃台是否 24 小時、明天退房時間、含不含早餐。今天會玩到閉園才回來正式 check-in。早餐一定要在這裡買——進園後到 11:30 午餐之間你們會一直站著，空腹排隊兩小時是今天最容易崩的地方。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Hotel+Keihan+Universal+Tower','map']]},
{time:'07:15',title:'開始排 USJ｜邊排邊吃',desc:'不要照表定開園時間才到；官方可能提早入園。早餐在隊伍裡解決。',status:'decision',statusLabel:'今天不能出園',note:'一般 Studio Pass 不能再入場，年間パス 除外。今天一旦走出閘門就回不來，晚上的 Halloween Horror Nights 也一起沒了——要拿的東西現在就帶進去。開園時間官方常接近日期才公布，出發前一週再確認一次；若當天 09:00 才開園，你們會在這裡站將近兩小時。',actions:[['📍 USJ','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan','map'],['↗ 步行導航','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Universal+Studios+Japan&travelmode=walking','route']]},
{time:'入園後 5 分鐘內',title:'先處理 SUPER NINTENDO WORLD',desc:'有 Express 就以指定時段為骨架；沒有就第一時間在 USJ App 處理 Area Timed Entry / Standby Entry。',note:'整理券要先掃票入園才能抽，而且 4 支手機都要能操作。進園前先確認每個人的 App 都登入好、票券都在。'},
{time:'白天',title:'大型設施優先',desc:'Mario Kart、Donkey Kong、Flying Dinosaur、Hollywood Dream、Harry Potter。',note:'Flying Dinosaur 這類設施要求隨身物品全部寄物，先想好誰保管什麼，不要每次都重新分配。'},
{time:'11:30–12:30',title:'午餐｜避開高峰',desc:'園內熱門餐廳中午排 60–90 分鐘很正常。',note:'兩個做法：11:30 前先吃，或改買外帶攤位邊排隊邊解決。四個人不必綁在一起吃。'},
{time:'15:00–16:00',title:'園內 Recovery｜不出園',desc:'不排熱門設施。找室內座位或咖啡廳坐滿 45–60 分鐘，換襪子、補水、充行動電源、整理戰利品。',status:'decision',statusLabel:'體力關鍵',note:'飯店雖然只有 5 分鐘路程，但今天絕對不能走出園區去休息，出去就回不來了。休息一定要在園內完成。'},
{time:'16:00–17:15',title:'提早晚餐',desc:'天黑後動線會亂，趁還坐得下先把晚餐解決掉。',note:'18:00 之後園區氣氛整個切換，找位子會更難。'},
{time:'17:15–18:00',title:'低強度設施｜等 Horror Nights',desc:'剛吃飽不要衝大型設施。挑室內、坐著看的，順便等天黑。'},
{time:'18:00+',title:'Halloween Horror Nights',desc:'依當日官方時間表安排 Biohazard、Sadako、Chainsaw Man 等活動。',note:'部分恐怖設施要對應的 Express 或另外的券才進得去，不是有門票就都能玩。當天先在 App 看清楚哪些要券。'},
{time:'閉園後',title:'走回環球塔',desc:'玩完直接休息，不回心齋橋。',note:'回房後先秤行李，不要留到明天早上。'}]},

{id:'d5',no:'DAY 5',date:'9/25（五）',title:'回台灣',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Terminal_2%2C_Kansai_International_Airport_%2817155965417%29.jpg/1280px-Terminal_2%2C_Kansai_International_Airport_%2817155965417%29.jpg',alt:'關西國際機場第二航廈',items:[
{time:'08:00–09:40',title:'早餐＋整理＋秤重',desc:'不排景點；先吃飽再處理行李。飯店有含早餐就在飯店吃，沒有就到 Universal City 買。',note:'秤到每個人各自的托運額度以內。免稅封袋不能拆，直接進托運。超重的先把重物移到隨身，但別忘了手提也有 7kg 上限。'},
{time:'10:20',title:'去 USJ Bus Terminal 排隊',desc:'4 人提早到，避免想搭的班次滿座。',transport:{head:'🚌 USJ 機場巴士乘車處',fare:'目標 10:20 到',steps:['從環球塔步行到 USJ Bus Terminal／交通廣場。','排関西空港行；可先向現場人員確認乘車處。','交通卡可作為 IC 使用時就直接感應。']},actions:[['📍 巴士乘車處','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Bus+Terminal','map']]},
{time:'10:50–11:51',title:'USJ → KIX T2',desc:'搭一班到底，不要在 T1 下車。',transport:{head:'🚌 USJ → KIX Terminal 2',fare:'¥1,800 / 人',steps:['10:50 USJ 發車。','11:40 KIX T1：不要下車。','11:51 KIX T2：Peach 國際線在這裡下車。','備援：11:10 → 12:31 T2。']},actions:[['官方時刻表','https://www.kate.co.jp/en/timetable/detail/NU'],['↗ 導航到 KIX','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Kansai+International+Airport+Terminal+2&travelmode=transit','route']]},
{time:'12:00–12:45',title:'在 T2 吃午餐',desc:'報到前先吃，過了安檢選擇更少。',note:'T2 是廉航航廈，餐飲與免稅店規模都比 T1 小很多。想買的伴手禮要在市區買完，不要指望這裡。'},
{time:'12:45 起',title:'Peach 報到 → MM027',desc:'15:15 起飛。先托運，再處理安檢與免稅。',transport:{head:'✈️ Peach 國際線報到',fare:'KIX T2',steps:['預留起飛前約 150 分鐘開始辦理的時間。','最晚不要壓到起飛前 50 分鐘附近。','手提：隨身物品＋手提行李合計 2 件、總重 7kg 內。','行動電源一律隨身，不可托運。']},actions:[['📍 KIX T2','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]}]}],

// ─────────── 出發前確認 ───────────
checklist:[
['證件 / 入境',[
['passport','護照正本','出門前最後再確認一次。'],['passportcopy','護照備份','手機照片＋雲端；可再放一份影本。'],['flight','Peach 電子機票','MM024、MM027 截圖離線保存。'],['hotel','飯店訂房資料','捷絲旅 3 晚＋京阪環球塔 1 晚。'],['vjw','Visit Japan Web 完成','每人 QR Code 截圖，含免稅 QR。'],['military','役男出境確認','有役男身分者辦理；不適用者略過。']]],
['保險 / 應急',[
['insurance','旅平險＋不便險已投保','颱風季＋廉航，班機與行李延誤都要保得到。'],['contacts','緊急電話存進手機','駐大阪辦事處、Japan Visitor Hotline、Peach 客服。'],['cardlost','信用卡海外掛失電話存好','證件與卡片是兩條線，掛失要打回台灣發卡行。'],['offline','離線資料備妥','機票、訂房、保單、地圖都要能在沒網路時打開。']]],
['手機 / 交通 / 付款',[
['esim','KKday eSIM 安裝完成','到日本才啟用旅遊 eSIM 行動數據。'],['iccard','每個人的交通卡方案確定','iPhone 開 Apple Wallet；Android 走實體 ICOCA。'],['cash','日幣現金＋信用卡','不要只帶單一付款方式，現金分開保管。'],['apps','Google Maps / Translate / USJ App','先下載並登入，地圖下載離線版。']]],
['USJ / 預約',[
['usj','USJ 電子票拿到','加入 USJ 官方 App，4 人都能離線叫出。'],['express','檢查 9/24 Express Pass','萬聖節期間；上限 ¥20,000 / 人。'],['meat','9/22 19:00 焼肉 ソウル 訂位','電話 06-6643-3644；訂不到就改訂 キナシ。'],['roomtype','確認兩間房的房型與床型','逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置。']]],
['現場切換規則',[
['d1cutoff','D1 15:15 巴士規則全員知道','未達條件就搭 16:32 到上本町，不追 15:32。'],['weather','9/20 晚上做最終天氣檢查','颱風動向、京都降雨、當週氣溫三件一起看。'],['typhoon','颱風應變全員知道','先查航班再決定行程，不要先衝機場。'],['finalcheck','出發前 48 小時核對變動資料','巴士時刻、USJ 開園時間、票價與營業時間，用官方連結逐一確認。'],['d5bus','D5 10:20 到 USJ 巴士站','目標 10:50 發車；備援 11:10。']]],
['行李 / 電子用品',[
['baggage','4 人回程托運額度已寫下','Peach 基本票不含托運，要查訂位紀錄。'],['scale','小型行李秤','回程藥妝、3C、伴手禮容易超重，帶了要真的用。'],['charger','手機充電器＋充電線','日本 100V、A 型兩扁腳；100–240V 充電器可直接使用。'],['powerbank','行動電源放隨身行李','不可托運；出發前再核對 Peach 最新規定。'],['umbrella','折疊傘 / 輕便雨衣','京都與 USJ 都大量戶外步行，USJ 雨衣比傘好用。'],['shoes','好走的鞋＋替換襪','京都＋USJ 連兩天會很有感。'],['cooling','防曬與消暑用品','9 月下旬仍常 30°C 以上，防曬、涼感巾、電解質。'],['meds','個人常用藥','依個人需求攜帶，處方藥保留原包裝。']]]]
};

export default TRIP_DATA
