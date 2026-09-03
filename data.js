const TRIP_DATA={

// 時刻表、票價、營業時間都會變。這個日期是頁面上這些數字最後一次對過官方資料的時間。
verifiedAt:'2026-09-01',
volatileNote:'票價、時刻表與營業時間都可能變動。出發前 48 小時用各區塊的官方連結再核一次。',

// ─────────── 出發前必須清掉的事（key 需與 checklist 對應）───────────
priorityActions:[
{key:'usj',deadline:'最優先',title:'USJ 電子票加入官方 App',desc:'4 人票券都要能在各自手機或同行者手機離線叫出。',level:'P0'},
{key:'insurance',deadline:'出發前 7 天',title:'投保旅平險＋不便險',desc:'9 月是關西颱風季又搭廉航。不便險理賠班機與行李延誤，這趟一定要保。',level:'P0'},
{key:'baggage',deadline:'出發前 7 天',title:'查出 4 人回程托運額度',desc:'Peach 基本票不含托運。查訂位紀錄，把每個人幾公斤寫下來。',level:'P0'},
{key:'express',deadline:'出發前',title:'不買 Express｜指定一人在 App 登錄四張票',desc:'已決定不買快速通關，改用開園衝刺＋整理券。指定一位代表，出發前就在 USJ App 把四張 Studio Pass 都登錄好，當天由他一次抽四人份。另一人也裝好 App 當備援。',level:'P0'},
{key:'roomtype',deadline:'入住前',title:'確認兩間房的房型與床型',desc:'逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置，不只看總房數。',level:'P0'},
{key:'iccard',deadline:'出發前',title:'確認每個人的交通卡方案',desc:'台灣 Android 手機開不了行動 Suica，要走實體卡。先分好誰是哪一種。',level:'P1'},
{key:'meat',deadline:'越早越好',title:'打電話訂 焼肉 ソウル',desc:'06-6643-3644。只收電話預約，沒有線上系統。訂 9/22（二）19:00、4 名。開放一個月前預訂，現在正好在範圍內。',level:'P1'},
{key:'weather',deadline:'9/20 晚上',title:'完成最終天氣檢查',desc:'看三件事：颱風動向、京都降雨、當週氣溫。',level:'P1'}],

// ─────────── 現場切換規則 ───────────
decisions:[
{days:['d1'],when:'D1 · なんば出站',badge:'SWITCH',title:'計程車排超過 10 分就改 Metro 一站',rule:'四人一台計程車到南船場約 5 分、¥800–1,000。乘車處排隊超過 10 分鐘就不等：走御堂筋線なんば → 心齋橋一站（¥190），2 號出口步行 7 分到飯店。',tone:'blue'},
{days:['d1'],when:'D1 · 大幅延誤',badge:'FALLBACK',title:'南海往なんば末班 23:55',rule:'南海每小時約 6 班，沒有「錯過」的問題。班機大延誤時，空港急行往なんば末班約 23:55、ラピート約 23:00（平日時刻，假日以現場為準）。末班過了就搭定額計程車到心齋橋四人分攤，或在機場等早班。先傳訊息告訴飯店會晚到。',tone:'amber',action:'南海時刻表',url:'https://www.nankai.co.jp/traffic/kix/kix_dia.html'},
{days:['d2'],when:'D2 · 訂不到時',badge:'PLAN B',title:'ソウル 訂不到就改 キナシ',rule:'ソウル 只能電話訂，訂不到就改 ヤキニク キナシ 心斎橋（食べログ 3.56、312 則），TableCheck 線上就能訂，而且在飯店旁邊。',tone:'blue'},
{days:'*',when:'每天 · 出門前',badge:'HEAT',title:'體感 30°C 以上就降速',rule:'9 月下旬關西仍然很熱。隨身帶水、每 2 小時進一次冷氣、上坡段改計程車，不硬撐。',tone:'amber'},
{days:['d4'],when:'D4 · 一整天',badge:'NO RE-ENTRY',title:'進了 USJ 就不能出園',rule:'一般 Studio Pass 不能再入場（年間パス 除外）。休息一律在園內解決，走出閘門就回不去，晚上的 Halloween Horror Nights 也一起沒了。',tone:'amber',action:'官方票券注意事項',url:'https://www.usj.co.jp/web/ja/jp/tickets/terms/studiopass/notice'},
{days:'*',when:'落後 30 分鐘時',badge:'CUT',title:'砍掉下一個可跳過的點',rule:'不要用走快一點把進度追回來，那只會把疲勞累積到晚上。直接砍掉下一個標「可跳過」的站，把時間還給當下正在逛的地方。這趟每天都排得很滿，砍一站不會少看什麼。',tone:'blue'},
{days:['d2'],when:'D2 · 早上',badge:'OPTIONAL',title:'早上兩站都可以跳過',rule:'睡眠不足或下雨就直接睡到 09:30，10:30 進 Den Den Town。八阪神社與黑門市場都免費，跳過不損失金錢。',tone:'blue'},
{days:['d3'],when:'D3 · 出發前',badge:'RAIN B',title:'京都大雨改走室內線',rule:'縮短伏見稻荷，改三十三間堂、錦市場、寺町與新京極商店街。',tone:'green',action:'京都官方雨天建議',url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019'},
{days:'*',when:'任何一天',badge:'TYPHOON',title:'颱風警報就切應急流程',rule:'先確認航班狀態，再決定當天行程。不要在颱風日排長距離移動，細節看「應急」分頁。',tone:'amber',action:'查 KIX 航班狀態',url:'https://www.kansai-airport.or.jp/flight'}],

// ─────────── 錢 ───────────
moneyPlan:{
cashPerPerson:'¥30,000–40,000',
cashForGroup:'¥120,000–160,000',
tripBudget:'約 ¥32,000–44,000 / 人',
tripBudgetNote:'不含機票、飯店、USJ 門票與大額購物。已決定不買快速通關，原本抓的 Express 預算整筆拿掉，省下約 ¥17,000 / 人。',
breakdown:[
['交通卡加值','¥3,000–5,000','車站加值機多數要用現金。'],
['餐食','¥10,000–14,000','含 9/22 焼肉 ソウル（客單價約 ¥4,000）；USJ 園內偏貴。'],
['門票','¥1,000–3,000','清水寺等零星入場費。不含 USJ 門票。'],
['小店／市場／零星','¥8,000–12,000','京都小店、錦市場與臨時餐食。'],
['緊急備用','¥10,000','分開保管，不把 4 人現金放同一人身上。']],
sourceUrl:'https://www.japan.travel/en/plan/cashless-payments-in-japan/'},

tickets:{
caption:'交通費之外真正會掏錢的入場費，出發前用官網校正一次。',
items:[
['清水寺 本堂','¥400 / 人','06:00 開門、18:00 閉門。伏見稻荷、八坂神社、錦市場、花見小路都免費。'],
['D2 早上兩站','¥0','難波八阪神社與黑門市場都不用門票，只有吃東西要錢。'],
['三十三間堂','約 ¥600 / 人','只有啟用京都雨天版才會用到。']],
note:'USJ 一日券假設已購入。快速通關已決定不買，當天打法看「準備」分頁。'},

// ─────────── USJ 不買快速通關的打法 ───────────
usjPlan:{
caption:'已決定不買，靠早到與整理券取代',
warning:'9/24 含咚奇剛的方案都已售完，剩下的組合多半把名額花在沒點名的設施上，所以決定不買。代價是抵達時間變成今天的勝負點：旺季整理券常在開園後 30–45 分鐘就抽完。',
steps:[
['05:20 起床，06:45 到園區','比原訂提早 30 分鐘。沒有保證入場，早到 30 分鐘的價值遠大於多睡 30 分鐘。'],
['開園先衝咚奇剛，不要先抽券','人少時 SUPER NINTENDO WORLD 常常不用整理券就進得去。咚奇剛開園有機會 30 分鐘內排到，08:00 後通常要 2 小時以上。'],
['進場後由一人代表抽全員的整理券','一個人在 App 登錄四張票，一次抽四人份，才會是同一時段。四個人各抽各的會拿到不同時段、把隊伍拆散。園內發券機 2026 年已廢止，只能用 App。'],
['整理券抽完會轉成抽選券','那是抽籤，沒中就進不去。沒中就等傍晚人潮散掉再試，中午最擠不要硬闖。'],
['看到 60 分鐘以上的隊就先跳過','沒有快速通關就要靠調度：先玩隔壁的，晚點再回頭。'],
['晚上恐怖設施抓 2–3 個就好','沒有優先通行，排隊很久。挑最想玩的先去排，不要每個都試。']],
note:'省下約 ¥17,000 / 人，整趟預算從約 ¥48,000–60,000 降到 ¥32,000–44,000。'},

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
['連假熱門店排更久','你們的 9/21–9/23 落在 9/19 起的五連休裡，超過 20 分鐘的隊就換下一家。']],
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
// ─────────── 刷卡回饋（活動條件變動快，出發前一定要用官方連結再確認）───────────
cardDeals:{
caption:'你們手上這兩張的 2026 下半年日本活動。條件隨時會改，出發前用官方連結再對一次。',
checkedAt:'2026/9/3',
cards:[
{key:'uniopen',name:'中信 uniopen 聯名卡',best:'國外實體最高 11%',period:'2026/9/1–12/31',tone:'blue',rows:[
['怎麼算','國外實體 3%（無上限）＋加碼 8%'],
['要登錄嗎','不用。免領券，出國刷就算'],
['上限','加碼每月 500 點，約當刷到 NT$6,250'],
['地區','不限國家，排除歐盟、英國、冰島']],
tip:'刷超過 NT$6,250 之後 8% 加碼就沒了，但實體 3% 無上限，大額還是繼續刷這張。',
url:'https://mkt.ctbcbank.com/long/creditcard/N2025052600033_01/index.html'},
{key:'jiho',name:'聯邦吉鶴卡',best:'指定通路 7%、其他 4%',period:'2026/7/1–12/31',tone:'amber',rows:[
['打底','日幣消費 2.5%，無上限、免登錄。帳單幣別要是日幣才算'],
['指定商店','加碼 3%，免登錄自動生效。上限是「整個活動期間 600 元」，刷到約 NT$20,000 就滿了，不會每月重來'],
['認哪些店','帳單字樣認 SEVEN-ELEVEN／FAMILYMART／LAWSON／DONQUIJOTE／BIC CAMERA／YODOBASHI／AEON／MITSUKOSHI／TAKASHIMAYA／USJ'],
['已登錄①','行動支付 1.5%：綁 Apple／Google Pay 感應、單筆滿 NT$100，月上限 600 元。登錄一次就好，不必每月重登；排除網購與交通'],
['已登錄②','海外加碼 3%：只算單月一般消費「超過 NT$15,000 的部分」，月上限 1,000 元，須當月登錄、每月限量 1,350 名'],
['實際疊得到','指定商店＋行動支付 ＝ 7%；其他店家 ＝ 4%。單月刷破 15,000 之後各再＋3%'],
['官網數字','主打的 11% 與 22% 都含「新戶加碼 3%」和 JCB APP 新用戶禮。你不是新戶，直接跳過這兩個數字']],
tip:'兩個會讓你白刷的地方。一是 QUICPay：活動條款寫明「不適用 QUICPay 交易」，但聯邦自己的 Apple Pay 說明又寫在日本是以 QUICPay 模式扣款、要你告知店員用 QUICPay——①的 1.5% 有可能因此拿不到，出發前打客服問。二是 USJ：只認園內的 USJ，園前飯店、近鐵環球影城酒店都不算，而且官網買的門票不列入。',
url:'https://activity.ubot.com.tw/2026JiHoCard/japan.htm'}],
plan:[
['前 NT$6,250 刷 uniopen','這一段 11% 全場最高，免登錄、不挑店。刷滿就換卡。'],
['Donki、Bic Camera、超商、USJ 園內','改刷吉鶴卡＋Apple／Google Pay：2.5＋3＋1.5 ＝ 7%。但 11 大商店那 3% 整期只有 600 元，約 NT$20,000 就滿。'],
['其他所有店家','還是吉鶴卡，2.5＋1.5 ＝ 4%，比 uniopen 用完加碼後的 3% 好。'],
['結帳一律選日幣','選台幣是 DCC，匯率明顯較差；而且吉鶴的 2.5% 規定帳單幣別要是日幣才算。']],
warning:'吉鶴卡的 NT$15,000 門檻，官方只寫「單月一般消費」，沒說台灣國內消費算不算。算的話你們出國前可能就過門檻、在日本每筆都多 3%；不算的話要在日本先刷滿 15,000。另外「日本三大交通卡儲值 1.5%」是獨立活動，每月 15 日 10 點才開放登錄、限量 10,000 名——想拿要 9/15 之後補登錄。'},

// ─────────── 出發前要裝的 App（只列這趟真的會打開的）───────────
apps:{
caption:'只列這趟真的會打開的，每個都寫清楚哪一天用。出發前在家裡的 Wi-Fi 裝好、登入好。',
checkedAt:'2026/9/3',
items:[
['Google Maps','全程','出發前先把大阪與京都的離線地圖下載好。沒網路時導航還能用，這是「沒網路」那套備案的第一層。','https://www.google.com/maps'],
['Yahoo! 乗換案内','D1、D3、D4','日本電車的標準查詢工具，會給月台號碼與轉乘要走幾分鐘，比 Google Maps 細。介面是日文，但輸入站名就會用。','https://transit.yahoo.co.jp/'],
['USJ 官方 App','D4','整理券只能用 App 抽，SNW 自 2026/1/5 起也是 App 限定。四張票要登錄在同一支手機才抽得到同一時段。','https://www.usj.co.jp/web/ja/jp/app'],
['Safety tips','全程','觀光廳監修的災害推播，支援繁體中文，免費。9 月是關西颱風季，地震、颱風與氣象警報都會即時推到手機。','https://www.rcsc.co.jp/safety-tips-jp'],
['VoiceTra','全程','日本 NICT 做的語音翻譯，日文比一般翻譯自然。注意它不能離線，沒網路就不能用。','https://voicetra.nict.go.jp/'],
['Peach（樂桃）','D1、D5','班機異動與登機證。颱風時以 App 的航班狀態為準，不要只看機場看板或新聞。','https://www.flypeach.com/'],
['Klook','D2','Joshin 日本橋店的免税優惠券在這裡領，出發前先領好。','https://www.klook.com/']],
warning:'網路上的「必備 App」清單常常還在推 JNTO 的 Japan Official Travel App——那個 2023 年 9 月就停止服務、下架了，不用去找。另外 Visit Japan Web 不是 App 是網頁，出發前填好並把 QR Code 截圖存離線。'},

// ─────────── 優惠券（只列行程真的會走到的店）───────────
coupons:{
caption:'只列你們行程會走到的店。免税是店家在辦的，跟刷卡回饋各算各的，可以疊在同一筆。',
checkedAt:'2026/9/3',
items:[
{key:'bic',name:'Bic Camera',where:'D2 下午',save:'免税 10%＋最多 7%',rows:[
['折多少','家電、相機、手錶、玩具 7%；藥品、化妝品、日用品 5%；日本酒 3%'],
['門檻','要走免税，而且單次税抜 ¥5,000 以上'],
['怎麼拿','官方或 LiveJapan 等平台的優惠券頁，結帳前出示畫面'],
['期限','現行券到 2026/12/31，涵蓋你們這趟']],
urlLabel:'免税店官方券頁',url:'https://www.taxfreeshops.jp/ja/tieup/2'},
{key:'donki',name:'唐吉訶德 Donki',where:'D1 晚上、D2 晚上',save:'免税 10%＋5～7%',rows:[
['折多少','税抜 ¥10,000 以上 5%；¥30,000 以上 7%'],
['會踩的雷','截圖無效，必須現場開著優惠券頁面讓店員掃，而且每張券限用一次'],
['所以','四個人分開結帳不如湊成一單。過 ¥30,000 就從 5% 跳到 7%']],
urlLabel:'Donki 官方免税說明',url:'https://www.donki.com/service/tax_free/jp/tax_free.php'},
{key:'daimaru',name:'大丸心齋橋店',where:'D1 晚上，就在 PARCO 隔壁',save:'5% 折價券',rows:[
['折多少','單次税込 ¥3,000 以上 5%，門檻比其他家都低'],
['怎麼拿','帶護照到店內指定櫃台換 5% 券，入境未滿 6 個月、限外籍本人'],
['不適用','特價品不算，只有定價商品；另有排除的樓層與品牌']],
urlLabel:'大丸官方外籍旅客頁',url:'https://www.daimaru.co.jp/shinsaibashi/service/gaikoku.html'},
{key:'uniqlo',name:'Uniqlo／GU',where:'D1 心齋橋筋、PARCO',save:'只有免税 10%',rows:[
['折多少','沒有觀光客專屬折扣，就是免税而已，別花時間找券'],
['門檻','單次税抜 ¥5,000（税込 ¥5,500）以上'],
['怎麼辦','結帳時出示護照正本，影本和照片都不行']],
urlLabel:'Uniqlo 官方免税條件',url:'https://faq.uniqlo.com/articles/Knowledge/100005975/'},
{key:'joshin',name:'Joshin Super Kids Land',where:'D2 Den Den Town',save:'免税 10%',rows:[
['先看這個','電視遊戲的主機、軟體、周邊一律不能免税，Apple 產品、PC 零件也不行'],
['門檻','税抜 ¥5,000 以上'],
['優惠券','Klook 等平台有日本橋店的免税優惠券，出發前先領好']],
urlLabel:'Klook 免税券（第三方平台）',url:'https://www.klook.com/ja/activity/206087-joshin-denki-duty-free-coupon/'},
{key:'drug',name:'松本清／マツキヨココカラ',where:'D1、D2 晚上',save:'免税 10%＋App 首購 10%',rows:[
['折多少','官方 App 首次下載給 10% 折價券，食品類 5%'],
['怎麼辦','結帳前出示 App 畫面，跟免税可以一起用']],
urlLabel:'マツキヨ 官方券說明',url:'https://www.matsukiyococokara-online.com/store/catalog/campaign/view/campaign_id/howto_coupon/'}],
warning:'免税不是折價券，是當場退掉 10% 消費税，要護照、單店單日税抜滿 ¥5,000。詳細規則看「準備」分頁的免税那一段。',
note:'日本的免税制度 2026/11/1 起改成出境後退税，但你們 9 月出發，適用的還是現在這套「結帳當場免税」。網路上寫新制的文章對這趟不適用。'},

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
{title:'USJ 官方 App',desc:'不買快速通關，整理券靠它抽。4 人先登入綁票券',url:'https://www.usj.co.jp/web/zh/tw/plan/app',label:'USJ 官方 App'}],

costs:[
['D1 約 ¥1,200','南海＋なんば計程車分攤'],['D2 約 ¥380','Metro 2 段；不買一日券'],['D3 約 ¥1,600','大阪 ↔ 京都電車'],['D4 約 ¥440','心齋橋 → USJ'],['D5 ¥1,800','USJ → KIX 巴士'],['合計約 ¥5,400','每人；D1 含計程車分攤，不含門票']],

// ─────────── 每日行程 ───────────
days:[
{id:'d1',no:'DAY 1',date:'9/21（一）',title:'抵達大阪・心齋橋',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg/1280px-Dotonbori%2C_Osaka%2C_at_night%2C_November_2016.jpg',alt:'大阪道頓堀夜景',items:[
{time:'13:20',type:'flight',title:'KIX T2 抵達',desc:'Peach 在第 2 航廈。Visit Japan Web 先做好，領完行李直接進城。',note:'出關後不用找巴士站，直接搭正對面的免費連絡巴士去 T1。Android 的人在南海車站就能買 ICOCA，D2 早上不用再跑心齋橋站。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]},
{time:'14:30 起',type:'transport',title:'接駁車 → 南海空港急行 → なんば計程車',desc:'出關就走，不用等特定班次。南海每小時約 6 班，入境多慢都不會被卡。',note:'原本的利木津巴士 ¥1,800、班距 40–60 分，錯過就等一小時。改南海每人省約 ¥600、早半小時到一小時進飯店。順的話 14:30 出關、16:00 前進飯店。',transport:{head:'🚌＋🚆＋🚕 KIX T2 → 南船場',fare:'約 ¥1,200 / 人（¥970＋計程車四人分攤）',steps:['T2 國際線到達口正對面搭免費連絡巴士到 T1／エアロプラザ，每 7 分一班、車程 7–9 分。','エアロプラザ 1F 下車，電梯或電扶梯上 2F 往車站走，約 5 分鐘。','驗票口有兩個並排：南海在左、紅橘色標示；JR 在右、藍色。刷錯要找站務員取消，別跟著人群走。','刷 ICOCA／Suica 或買 ¥970 車票。Android 的人在粉紅色售票機順便買 ICOCA（05:00–23:00）。','搭「空港急行」なんば行，約 45 分。ラピート只快 7 分但特急券 ¥550 起，不值得。','なんば 2F 中央改札口出來，跟著「なんばパークス」與計程車標示，右前方電扶梯下 1F，再走約 50 公尺，全程約 4 分鐘。','四人一台到南船場 2-9-15 約 5 分、¥800–1,000。排隊超過 10 分鐘就改搭 Metro 一站到心齋橋。']},actions:[['南海時刻表','https://www.nankai.co.jp/traffic/kix/kix_dia.html'],['導航到飯店','https://www.google.com/maps/dir/?api=1&origin=Kansai+International+Airport+Terminal+2&destination=Just+Sleep+Osaka+Shinsaibashi&travelmode=transit','route']]},
{time:'16:00',type:'hotel',title:'捷絲旅 Check-in',desc:'前三晚固定住 Just Sleep Osaka Shinsaibashi。',note:'順便問清楚：早餐時間與地點、行李寄放規則、最近的便利商店。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Just+Sleep+Osaka+Shinsaibashi','map']]},
{time:'17:00–20:00',type:'shopping',gapNote:'進房、梳洗',title:'心齋橋 PARCO＋心齋橋筋',desc:'先處理服飾、潮流、簡單購物。',status:'optional',statusLabel:'D1 第一個砍',note:'今天是敬老日，也是 9/19 起五連休的第三天，商店街會比平常擠，別急著逛完。班機延誤時，這一站就是第一個縮短或砍掉的：18:45 之後才進飯店就整段砍，直接去吃飯——服飾在 D2 的美國村還有一輪。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Shinsaibashi+PARCO','map']]},
{time:'20:00–21:45',type:'food',title:'道頓堀＋拉麵＋第一輪藥妝',desc:'第一晚吃簡單。吃完順路把想買的藥妝先掃第一輪，不要全部壓到 D2 最後那一段。',note:'今晚全程步行可到，沒有交通卡也不影響。道頓堀的 Donki 是 24 小時營業，吃飽後再逛也來得及。今晚不要用掉 Donki 優惠券——每張限用一次，留給 D2 晚上金額大的那一單，稅抜過 ¥30,000 是 7%。今晚就當先探路、買當下要用的。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Dotonbori+Osaka','map']]}]},

{id:'d2',no:'DAY 2',date:'9/22（二）',title:'大阪購物主日＋燒肉',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Namba-Yasaka-Shrine-lions_head_theater.jpg/1280px-Namba-Yasaka-Shrine-lions_head_theater.jpg',alt:'難波八阪神社巨大獅子殿',items:[
{time:'08:00',type:'transport',status:'optional',statusLabel:'多數人可跳過',title:'心齋橋站｜只辦一件事',desc:'用 Android 的人若 D1 在南海関西空港駅還沒買 ICOCA，在這裡補買。iPhone 的人不用來。',note:'不要買一日券。今天全程步行為主，Metro 頂多搭 2 段（約 ¥380），¥620 的 Enjoy Eco Card 反而虧。',transport:{head:'🎫 實體 ICOCA',fare:'¥2,000（含 ¥500 押金）',steps:['從飯店步行約 7–10 分鐘到心齋橋站。','找粉紅色售票機購買 ICOCA，販售時段約 05:00–23:00。','iPhone 的人在 Apple Wallet 開卡就好，不必特地過來。']}},
{time:'08:25–09:00',type:'attraction',gapMinutes:10,title:'難波八阪神社｜巨大獅子殿',desc:'高 12m、寬 11m、深 10m 的獅子頭絵馬殿，1974 年建立。免費參拜，早上幾乎沒人，好拍。',status:'optional',statusLabel:'可跳過',note:'6:30 就開，所以睡不飽也不必硬起床，晚一點來一樣進得去。',transport:{head:'心齋橋 M19 → なんば M20',fare:'約 ¥190 / 人（刷 ICOCA / Suica）',steps:['御堂筋線往なかもず方向，一站就到。','なんば下車後步行約 6 分鐘到神社。','不想搭車也可以從飯店直接走過去，約 15–20 分鐘，省下這段車資。']},actions:[['官方網站','https://nambayasaka.jp/'],['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Namba+Yasaka+Shrine','map']]},
{time:'09:20–10:20',type:'food',gapMinutes:12,title:'黑門市場｜吃早餐',desc:'大阪的廚房。海鮮、玉子燒、水果現切，直接當早餐解決。',note:'今天 9/22 是國民休日。黑門市場的鮮魚店、惣菜店多半「日祝休」，可能有一半沒開；觀光客取向的串燒、海鮮丼通常照開。有開的就吃，整條都冷清就往南走 5 分鐘到 Den Den Town 附近的便利商店或咖啡店解決，不要為了早餐耗時間。',transport:{head:'🚶 難波八阪神社 → 黑門市場',fare:'步行約 12 分鐘',steps:['從神社往東北方向走，穿過難波的巷弄。','黑門市場就在 Osaka Metro 千日前線「日本橋」站出站即到。','逛完直接往南接 Den Den Town，不用再搭車。']},actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Kuromon+Ichiba+Market','map']]},
{time:'10:30–13:30',type:'shopping',gapMinutes:5,title:'日本橋 Den Den Town',desc:'動漫、模型、遊戲主場。Surugaya → Joshin Super Kids Land → Animate → Mandarake。',note:'順序是照開門時間排的：駿河屋本館、Joshin、アニメイト（9/22 是祝日，10:00 開）都早上就開，但まんだらけ グランドカオス 12:00 才開門，所以放最後。照原本的順序走會在 11 點站在鐵門前。Joshin 的電視遊戲主機、軟體、周邊不能免税，要買遊戲就別等湊免税門檻。',transport:{head:'🚶 黑門市場 → Den Den Town',fare:'步行約 5 分鐘',steps:['從黑門市場南端出來，往堺筋方向走。','沿著堺筋一路往南就是 Den Den Town。','今天早上全程步行，沒有轉車。']},actions:[['📍 Surugaya','https://www.google.com/maps/search/?api=1&query=Surugaya+Nipponbashi+Osaka','map'],['📍 Joshin','https://www.google.com/maps/search/?api=1&query=Joshin+Super+Kids+Land+Osaka','map'],['📍 Animate','https://www.google.com/maps/search/?api=1&query=Animate+Osaka+Nipponbashi','map'],['📍 Mandarake｜12:00 開','https://www.google.com/maps/search/?api=1&query=Mandarake+Grandchaos+Nipponbashi+Osaka','map']]},
{time:'13:30–14:10',type:'food',title:'拉麵午餐',desc:'選日本橋／難波當下排隊短的店，不為網紅店浪費 60–90 分鐘。',note:'先問能不能 4 人同桌，很多小店只有吧台。'},
{time:'14:25–15:40',type:'shopping',gapNote:'走到難波',gapMinutes:10,title:'Bic Camera 難波＋相機店',desc:'3C、相機、配件集中處理；想看二手鏡頭順便看 Naniwa Camera。',note:'免稅要帶護照本人。一般物品與消耗品門檻分開算，不能合併湊 ¥5,000。',actions:[['📍 Bic Camera','https://www.google.com/maps/search/?api=1&query=Bic+Camera+Namba','map'],['📍 Naniwa Camera','https://www.google.com/maps/search/?api=1&query=Naniwa+Camera+Namba+Marui','map']]},
{time:'16:00–17:20',type:'shopping',gapNote:'走到美國村',gapMinutes:13,title:'Orange Street＋美國村',desc:'潮牌、古著、鞋店。4 人可分開逛。',note:'散開前先講好幾點、在哪裡集合，並用 Google Maps 傳定位。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Orange+Street+Osaka','map']]},
{time:'17:20–17:50',type:'hotel',title:'回飯店放購物袋',desc:'今天買最多的一段已經結束，先卸貨再去吃飯。',note:'不放的話，你們要提著 3C 與藥妝進燒肉店。',status:'decision',statusLabel:'動線關鍵'},
{time:'17:50–18:35',type:'rest',title:'空白｜今天唯一的休息',desc:'不排任何行程。洗個澡、躺一下，或在心齋橋附近隨便走走都可以。',status:'free',statusLabel:'不排行程',note:'今天從 08:00 走到現在。明天 06:20 就要出門去京都，這段休息是為了明天，不是浪費。'},
{time:'19:00–20:45',type:'food',gapMinutes:15,title:'焼肉 ソウル｜這趟的主餐',desc:'食べログ 3.72、569 則評價，焼肉 WEST 百名店 2024＋2025 連兩年入選。招牌是ハラミ三種盛與上塩タン。客單價約 ¥4,000。',note:'只接受電話預約：06-6643-3644，訂 19:00。54 席、無個室、定休週四（逢假日照常營業），9/22 確定有開。',transport:{head:'🚶 心齋橋 → 焼肉 ソウル',fare:'步行約 15 分鐘',steps:['沿心齋橋筋往南走到難波，再往元町方向。','懶得走就搭御堂筋線一站到なんば，32 號出口步行 5 分鐘。','地址：大阪市浪速区元町 2-7-24。']},actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Yakiniku+Soul+Motomachi+Naniwa+Osaka','map']]},
{time:'20:45–21:40',type:'shopping',title:'藥妝 / Donki 補貨',desc:'重物集中今晚買，回飯店直接整理。',note:'4 個人加上免稅結帳，30 分鐘一定不夠——光排免稅櫃檯就可能吃掉一半。抓 55 分鐘，22:00 前回到飯店。消耗品會被封袋，在日本拆開要補稅，當下要用的另外買一份含稅的。',actions:[['📍 Donki 道頓堀','https://www.google.com/maps/search/?api=1&query=Don+Quijote+Dotonbori+Osaka','map']]}]},

{id:'d3',no:'DAY 3',date:'9/23（三）',title:'京都經典一日',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Fushimi_Inari-taisha_senbon-torii%2C_August_2019.jpg/1280px-Fushimi_Inari-taisha_senbon-torii%2C_August_2019.jpg',alt:'伏見稻荷千本鳥居',
weatherPlan:{title:'天氣切換',url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019',branches:[
{tag:'大雨',trigger:'前一晚預報持續降雨，或當天體感已不適合長距離步行',steps:['伏見稻荷只走入口與前段鳥居，最晚 08:30 離開。','取消清水寺長上坡，改三十三間堂等室內景點。','下午集中錦市場、寺町與新京極商店街。']},
{tag:'高溫',trigger:'預報 30°C 以上，或上午就已經明顯悶熱',steps:['每人出門前先買 2 瓶水，看到便利商店就補。','清水五條到清水寺那段上坡直接 4 人叫計程車，不要走。','午餐拉長到 90 分鐘，在冷氣裡休息夠再出發。']}]},
items:[
{time:'06:20',type:'transport',title:'心齋橋 → 伏見稻荷',desc:'秋分日，京都一定早出。',note:'今天是連假最後一天，也是彼岸期間，寺社人潮比平常多。',transport:{head:'🚇＋🚆 心齋橋 → 伏見稻荷',fare:'約 ¥680',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 淀屋橋 M17。','走御堂筋線「北改札」出站，跟「京阪本線」指標走約 20 公尺進連絡通道，到京阪「西改札口」約 2 分鐘。','往出町柳方向；若搭特急，在丹波橋轉準急／普通。','伏見稲荷 KH34 下車；全程直接刷交通卡。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Fushimi+Inari+Taisha&travelmode=transit','route']]},
{time:'07:35–09:10',type:'attraction',title:'伏見稻荷｜回程在參道吃早餐',desc:'千本鳥居走到中段就回，回程約 08:30 在參道解決早餐。',note:'鳥居隧道要拍空景就是現在，9 點後人潮會塞住整條路。參道小吃約 08:00 後陸續開門，所以先走鳥居、回程再吃，順序不要反。今天要走到 12:30 才有午餐，這一餐不能跳過。參道請靠邊拍，不要擋住通行。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha','map']]},
{time:'09:20–10:15',type:'transport',gapMinutes:5,title:'伏見稻荷 → 清水寺',desc:'到清水五條後，上坡若太熱／下雨可 4 人分攤計程車。',transport:{head:'🚆 伏見稻荷 KH34 → 清水五條 KH38',fare:'約 ¥240',steps:['搭京阪本線往出町柳方向。','普通／準急都可以，清水五條下車。','步行上坡約 20–25 分鐘到清水寺。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Fushimi+Inari+Taisha&destination=Kiyomizu-dera&travelmode=transit','route']]},
{time:'10:20–12:30',type:'attraction',gapNote:'到站、走到山門',title:'清水寺 → 三年坂 → 二年坂',desc:'主景點上午完成，避開午後最大人潮。',note:'八坂塔（法観寺）那個經典街景在二年坂往下走的巷口，順路不用繞。',actions:[['📍 清水寺','https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Kyoto','map']]},
{time:'12:30–14:50',type:'food',title:'午餐 A / B / C＋祇園',desc:'12:20 看排隊長度，選第一個能在 20 分鐘內入座的方案；不為名店打亂下午。',status:'choice',statusLabel:'現場三選一',note:'花見小路的巷弄是私人道路，禁止攝影，違規會被開罰。要拍就在四条通那側的公共道路拍。',choices:[{label:'A · 最近',title:'祇園 京めん',desc:'京風烏龍／蕎麥；祇園會館 1F，動線最短。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Kyomen+Kyoto'},{label:'B · 傳統',title:'祇園權兵衛',desc:'蕎麥、烏龍與丼飯；適合想坐下吃完整午餐。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Gonbe+Kyoto'},{label:'C · 雨天',title:'四条河原町餐廳層',desc:'直接往百貨公司室內用餐，再接錦市場與商店街。',url:'https://www.google.com/maps/search/?api=1&query=Kyoto+Kawaramachi+department+store+restaurants'}],actions:[['八坂神社地圖','https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine+Kyoto','map'],['花見小路地圖','https://www.google.com/maps/search/?api=1&query=Hanamikoji+Street+Kyoto','map']]},
{time:'15:15–16:15',type:'shopping',gapNote:'走到錦市場',gapMinutes:15,title:'錦市場｜只逛一小時',desc:'伴手禮與零食抓重點，不逛完整條。河原町百貨留到有力氣再說。',note:'今天 9/23 同時是週三和秋分日：錦市場有些店週三公休、有些店祝日公休，可能比平常少開一些，觀光取向的店通常照開。禁止邊走邊吃，買了要在店門口吃完再走，垃圾交回原店。刻意壓成一小時，是為了 16:30 就能上車。',actions:[['📍 錦市場','https://www.google.com/maps/search/?api=1&query=Nishiki+Market+Kyoto','map']]},
{time:'16:30–18:00',type:'transport',gapMinutes:10,title:'京都 → 心齋橋',desc:'比原訂早一小時離開京都，把時間換成今晚的睡眠。',note:'明天 05:20 起床衝 USJ。今天已經走了 10 小時，這一小時比多逛一條商店街值錢。',transport:{head:'🚆＋🚇 祇園四条 → 心齋橋',fare:'約 ¥680',steps:['祇園四条 KH39 搭京阪特急淀屋橋行。','淀屋橋轉御堂筋線往なかもず方向。','心齋橋 M19 下車。','今天總交通約 ¥1,600 / 人。']},actions:[['↗ 回飯店導航','https://www.google.com/maps/dir/?api=1&origin=Gion-Shijo+Station&destination=Just+Sleep+Osaka+Shinsaibashi&travelmode=transit','route']]},
{time:'18:15–19:30',type:'food',gapNote:'回飯店放東西',gapMinutes:9,title:'晚餐｜就近解決',desc:'回飯店放東西後，在心齋橋、道頓堀一帶吃。居酒屋或定食都可以。',status:'decision',statusLabel:'不要走遠',note:'規則只有一條：離飯店步行 5 分鐘內、看到不用排隊的就進去。走了一整天還為了找店多走 15 分鐘，是這種行程最常見的崩潰點。'},
{time:'20:00–21:00',type:'rest',gapNote:'走回飯店',gapMinutes:10,title:'整理行李＋早睡',desc:'明天全部行李帶走換飯店，今晚就要打包完。',note:'目標 21:00 上床。明天 05:20 就要起床衝 USJ，這是整趟唯一能預先補的覺，今晚每晚睡 30 分鐘，明天下午就會反映出來。'}]},

{id:'d4',no:'DAY 4',date:'9/24（四）',title:'USJ＋換住環球塔',image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/20/00/a2000380/img/basic/a2000380_thumbnail.jpg',alt:'日本環球影城',
weatherPlan:{title:'天氣切換',branches:[
{tag:'大雨',trigger:'當天有雨或雷雨預報',steps:['園區照常營業，但戶外雲霄飛車在強風大雨時會停開。','輕便雨衣比傘好用，排隊時撐傘會被要求收起來。','每人準備一雙替換襪，濕鞋撐一整天會毀掉當晚。']},
{tag:'高溫',trigger:'預報 30°C 以上',steps:['排隊區多半沒有遮蔽，帶水與電解質飲料。','中午最熱那兩小時安排室內設施或用餐。','有人開始頭暈就立刻進冷氣區休息，不要撐到晚上的活動。']}]},
items:[
{time:'05:20',type:'hotel',title:'起床＋退房',desc:'全部行李一起帶走，不再回心齋橋。',note:'比原訂提早 30 分鐘，因為沒買快速通關。今天早到 30 分鐘的價值，遠大於多睡 30 分鐘。'},
{time:'05:45–06:35',type:'transport',title:'心齋橋 → Universal City',desc:'先到環球塔寄行李。',transport:{head:'🚇＋🚆 心齋橋 → Universal City',fare:'約 ¥440',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 梅田 M16。','跟「JR 大阪駅」指標走，不要走去阪急／阪神。','JR 大阪搭大阪環狀線往西九条方面。','若列車直通桜島／Universal City 就直接坐；否則西九条轉 JR ゆめ咲線桜島行。','ユニバーサルシティ下車。']},actions:[['↗ 換飯店導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Hotel+Keihan+Universal+Tower&travelmode=transit','route']]},
{time:'06:35',type:'hotel',title:'寄行李＋買早餐',desc:'Hotel Keihan Universal Tower 離 JR Universal City 與 USJ 都非常近。放下行李順便解決早餐。',note:'問四件事：入住從幾點開始、櫃台是否 24 小時、明天退房時間、含不含早餐。今天會玩到閉園才回來正式 check-in。早餐一定要在這裡買——進園後到 11:30 午餐之間你們會一直站著，空腹排隊兩小時是今天最容易崩的地方。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Hotel+Keihan+Universal+Tower','map']]},
{time:'06:45',type:'attraction',gapNote:'走到閘門',gapMinutes:5,title:'開始排 USJ｜邊排邊吃',desc:'不要照表定開園時間才到；官方常提早到 07:15–07:45 就開園。早餐在隊伍裡解決。',status:'decision',statusLabel:'今天不能出園',note:'沒買快速通關，抵達時間就是今天的勝負點：旺季整理券常在開園後 30–45 分鐘抽完。一般 Studio Pass 不能再入場（年間パス 除外），走出閘門就回不來，晚上的 Halloween Horror Nights 也一起沒了——要拿的東西現在就帶進去。開園時間官方常接近日期才公布，出發前一週再確認一次。',actions:[['📍 USJ','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan','map'],['↗ 步行導航','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Universal+Studios+Japan&travelmode=walking','route']]},
{time:'一開園',progressTime:'07:30',type:'attraction',title:'直接衝咚奇剛，不要先抽券',desc:'開園瞬間人還少時，SUPER NINTENDO WORLD 常常不用整理券就能直接進去。先用走的快步進場，直奔咚奇剛的瘋狂礦車。',status:'decision',statusLabel:'今天最關鍵',note:'咚奇剛在開園時有機會 30 分鐘內排到，08:00 之後通常要 2 小時以上——這一站的成敗就決定在最前面那 20 分鐘。進得去就先玩，玩完再抽券。'},
{time:'進場後',progressTime:'07:50',type:'attraction',title:'一人代表抽全員的整理券',desc:'掃票入園後才抽得到。由一個人在 USJ App 登錄四張 Studio Pass，在「e整理券」一次抽四人份，才會拿到同一個時段。',status:'decision',statusLabel:'不要各抽各的',note:'四個人各自抽會拿到不同時段，等於把隊伍拆散——這是最常見的錯誤。2026 年起園內發券機已廢止，只能用 App。整理券抽完會自動轉成「抽選券」（抽籤，沒中就進不去）；沒中的話等傍晚人潮散掉再試，中午最擠不要硬闖。'},
{time:'白天',progressTime:'08:30',type:'attraction',title:'其餘大型設施',desc:'瑪利歐賽車、飛天翼龍、好萊塢美夢、哈利波特。',note:'沒有快速通關，熱門設施都要排。看到 60 分鐘以上就先跳過，改玩隔壁的，晚點回頭。飛天翼龍這類要求隨身物品全部寄物，先講好誰保管什麼，不要每次重新分配。'},
{time:'11:30–12:30',type:'food',title:'午餐｜避開高峰',desc:'園內熱門餐廳中午排 60–90 分鐘很正常。',note:'兩個做法：11:30 前先吃，或改買外帶攤位邊排隊邊解決。四個人不必綁在一起吃。'},
{time:'15:00–16:00',type:'rest',title:'園內 Recovery｜不出園',desc:'不排熱門設施。找室內座位或咖啡廳坐滿 45–60 分鐘，換襪子、補水、充行動電源、整理戰利品。',status:'decision',statusLabel:'體力關鍵',note:'飯店雖然只有 5 分鐘路程，但今天絕對不能走出園區去休息，出去就回不來了。休息一定要在園內完成。'},
{time:'16:00–17:15',type:'food',title:'提早晚餐',desc:'天黑後動線會亂，趁還坐得下先把晚餐解決掉。',note:'18:00 之後園區氣氛整個切換，找位子會更難。'},
{time:'17:15–18:00',type:'attraction',title:'低強度設施｜等 Horror Nights',desc:'剛吃飽不要衝大型設施。挑室內、坐著看的，順便等天黑。'},
{time:'18:00+',type:'attraction',title:'Halloween Horror Nights',desc:'依當日官方時間表安排 Biohazard、Sadako、Chainsaw Man 等活動。',note:'沒有快速通關，恐怖設施排隊會很久，實際上一晚能玩 2–3 個就不錯了。先挑最想玩的一個去排，不要每個都想試。部分設施要另外的券，當天先在 App 看清楚。'},
{time:'閉園後',progressTime:'21:30',type:'hotel',title:'走回環球塔｜24:00 前入住',desc:'玩完直接休息，不回心齋橋。',note:'飯店 check-in 受理到深夜 24:00 為止，Horror Nights 玩到閉園也來得及，但不要在園區外閒晃到過午夜。回房後先秤行李，不要留到明天早上。'}]},

{id:'d5',no:'DAY 5',date:'9/25（五）',title:'回台灣',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Terminal_2%2C_Kansai_International_Airport_%2817155965417%29.jpg/1280px-Terminal_2%2C_Kansai_International_Airport_%2817155965417%29.jpg',alt:'關西國際機場第二航廈',items:[
{time:'08:00–09:40',type:'hotel',title:'早餐＋整理＋秤重',desc:'不排景點；先吃飽再處理行李。飯店有含早餐就在飯店吃，沒有就到 Universal City 買。',note:'秤到每個人各自的托運額度以內。免稅封袋不能拆，直接進托運。超重的先把重物移到隨身，但別忘了手提也有 7kg 上限。'},
{time:'10:20',type:'transport',gapNote:'走去巴士站',gapMinutes:10,title:'去 USJ Bus Terminal 排隊',desc:'4 人提早到，避免想搭的班次滿座。',transport:{head:'🚌 USJ 機場巴士乘車處',fare:'目標 10:20 到',steps:['乘車處是「ユニバーサル・シティウォーク大阪」，從環球塔步行約 2 分鐘，抓 10 分鐘綽綽有餘。','認明「関西空港行」的隊伍；同一區也有伊丹機場與其他路線的站牌。','不能預約，先到先上；交通卡可作為 IC 使用時就直接感應。']},actions:[['📍 巴士乘車處','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Bus+Terminal','map']]},
{time:'10:50–11:51',type:'transport',title:'USJ → KIX T2',desc:'搭一班到底，不要在 T1 下車。',transport:{head:'🚌 USJ → KIX Terminal 2',fare:'¥1,800 / 人',steps:['10:50 USJ 發車。','11:40 KIX T1：不要下車。','11:51 KIX T2：Peach 國際線在這裡下車。','備援：11:10 → 12:31 T2。']},actions:[['官方時刻表','https://www.kate.co.jp/en/timetable/detail/NU'],['↗ 導航到 KIX','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Kansai+International+Airport+Terminal+2&travelmode=transit','route']]},
{time:'12:00–12:45',type:'food',gapNote:'走進航廈',gapMinutes:5,title:'在 T2 吃午餐',desc:'報到前先吃，過了安檢選擇更少。',note:'T2 是廉航航廈，餐飲與免稅店規模都比 T1 小很多。想買的伴手禮要在市區買完，不要指望這裡。'},
{time:'12:45 起',type:'flight',title:'Peach 報到 → MM027',desc:'15:15 起飛。先托運，再處理安檢與免稅。',transport:{head:'✈️ Peach 國際線報到',fare:'KIX T2',steps:['預留起飛前約 150 分鐘開始辦理的時間。','最晚不要壓到起飛前 50 分鐘附近。','手提：隨身物品＋手提行李合計 2 件、總重 7kg 內。','行動電源一律隨身，不可托運。']},actions:[['📍 KIX T2','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]}]}],

// ─────────── 出發前確認 ───────────
checklist:[
['證件 / 入境',[
['passport','確認護照正本','出門前最後再確認一次。'],['passportcopy','備好護照備份','手機照片＋雲端；可再放一份影本。'],['flight','存下 Peach 電子機票','MM024、MM027 截圖離線保存。'],['hotel','存下飯店訂房資料','捷絲旅 3 晚＋京阪環球塔 1 晚。'],['vjw','完成 Visit Japan Web','每人 QR Code 截圖，含免稅 QR。'],['military','確認役男出境資格','有役男身分者辦理；不適用者略過。']]],
['保險 / 應急',[
['insurance','投保旅平險＋不便險','颱風季＋廉航，班機與行李延誤都要保得到。'],['contacts','把緊急電話存進手機','駐大阪辦事處、Japan Visitor Hotline、Peach 客服。'],['cardlost','存下信用卡海外掛失電話','證件與卡片是兩條線，掛失要打回台灣發卡行。'],['offline','備妥離線資料','機票、訂房、保單、地圖都要能在沒網路時打開。']]],
['手機 / 交通 / 付款',[
['esim','安裝 KKday eSIM','到日本才啟用旅遊 eSIM 行動數據。'],['iccard','確認每個人的交通卡方案','iPhone 開 Apple Wallet；Android 走實體 ICOCA。'],['cash','備好日幣現金＋信用卡','不要只帶單一付款方式，現金分開保管。'],['apps','裝好「出發前要裝的 App」那七個','在家裡的 Wi-Fi 裝好並登入，Google Maps 的大阪與京都離線地圖也要先下載。'],['cardreg','打客服問吉鶴卡兩件事','①NT$15,000 門檻算不算台灣國內消費；②日本用 Apple Pay 走 QUICPay 還能不能拿 1.5%。兩題都會改變在日本要刷哪張卡。'],['cardtransit','9/15 後登錄吉鶴卡交通卡儲值活動','儲值三大交通卡 1.5%，每月 15 日上午 10 點才開放、限量 10,000 名。路徑：限時登錄活動專區→其他平台。']]],
['USJ / 預約',[
['usj','USJ 電子票加入官方 App','4 人都能離線叫出。'],['express','在代表人 App 登錄四張 USJ 票','不買快速通關，整理券是唯一保障。一人登錄全員票券、一次抽四人份，才會同一時段。'],['meat','打電話訂 9/22 19:00 焼肉 ソウル','電話 06-6643-3644；訂不到就改訂 キナシ。'],['roomtype','確認兩間房的房型與床型','逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置。']]],
['規則 / 最後確認',[
['d1cutoff','向全員說明 D1 接駁車與南海路線','T2 出關搭免費連絡巴士到 T1，南海空港急行到なんば，出站叫計程車。每 10 分一班，不用趕。'],['weather','9/20 晚上完成最終天氣檢查','颱風動向、京都降雨、當週氣溫三件一起看。'],['typhoon','向全員說明颱風應變','先查航班再決定行程，不要先衝機場。'],['finalcheck','出發前 48 小時核對變動資料','巴士時刻、USJ 開園時間、票價與營業時間，用官方連結逐一確認。'],['d5bus','向全員說明 D5 10:20 巴士集合時間','目標 10:50 發車；備援 11:10。']]],
['行李 / 電子用品',[
['baggage','查出 4 人回程托運額度','Peach 基本票不含托運，要查訂位紀錄。'],['scale','帶小型行李秤','回程藥妝、3C、伴手禮容易超重，帶了要真的用。'],['charger','帶手機充電器＋充電線','日本 100V、A 型兩扁腳；100–240V 充電器可直接使用。'],['powerbank','把行動電源放進隨身行李','不可托運；出發前再核對 Peach 最新規定。'],['umbrella','帶折疊傘 / 輕便雨衣','京都與 USJ 都大量戶外步行，USJ 雨衣比傘好用。'],['shoes','帶好走的鞋＋替換襪','京都＋USJ 連兩天會很有感。'],['cooling','帶防曬與消暑用品','9 月下旬仍常 30°C 以上，防曬、涼感巾、電解質。'],['meds','帶個人常用藥','依個人需求攜帶，處方藥保留原包裝。']]]]
};

export default TRIP_DATA
