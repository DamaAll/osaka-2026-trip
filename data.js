const TRIP_DATA={
priorityActions:[
{key:'usj',deadline:'最優先',title:'USJ 電子票加入官方 App',desc:'4 人票券都要能在各自手機或同行者手機離線叫出。',level:'P0'},
{key:'express',deadline:'售完前',title:'決定 9/24 Express Pass',desc:'4 人同方案、每人不超過 ¥20,000 就買；否則立刻切替代組合。',level:'P0'},
{key:'roomtype',deadline:'入住前',title:'確認兩間房的房型與床型',desc:'逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置，不只看總房數。',level:'P0'},
{key:'meat',deadline:'9/22 19:30',title:'松阪牛 M 訂位完成',desc:'確認分店、日期、時間與 4 人席位。',level:'P1'},
{key:'weather',deadline:'9/20 晚上',title:'完成最終天氣檢查',desc:'京都若大雨就啟用室內版；USJ 確認雨具與替換襪。',level:'P1'}],
decisions:[
{when:'D1 · 15:15',badge:'CUT-OFF',title:'巴士是否還等 15:32',rule:'15:15 前已領到行李並往 T2 巴士站移動才搭 15:32；否則直接切 16:32 到上本町。',tone:'amber',action:'開官方時刻表',url:'https://www.kate.co.jp/timetable/detail/UH/dep'},
{when:'D2 · 08:15',badge:'OPTIONAL',title:'大阪城不是必去',rule:'睡眠不足、下雨或購物優先就跳過；10:00 直接往日本橋，不補行程。',tone:'blue'},
{when:'D3 · 出發前',badge:'RAIN B',title:'京都大雨改走室內線',rule:'縮短伏見稻荷，改三十三間堂、錦市場、寺町與新京極商店街。',tone:'green',action:'京都官方雨天建議',url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019'}],
moneyPlan:{
cashPerPerson:'¥30,000–40,000',
cashForGroup:'¥120,000–160,000',
tripBudget:'約 ¥55,000–70,000 / 人',
tripBudgetNote:'不含機票、飯店、USJ 一般門票與購物；包含交通、餐食、Express 預算與零星門票。',
breakdown:[
['Suica 加值','¥3,000–5,000','車站加值機多數要用現金。'],
['小店／市場／寺社','¥10,000–15,000','京都小店、錦市場與臨時餐食。'],
['置物櫃／零食／短程交通','¥5,000–8,000','處理不能刷卡或臨時改線。'],
['緊急備用','¥10,000','分開保管，不把 4 人現金放同一人身上。']],
sourceUrl:'https://www.japan.travel/en/plan/cashless-payments-in-japan/'},
shoppingList:[
{group:'藥妝 / 日用品',items:[
['shop_skincare','防曬、保養、面膜','先拍台灣價格與容量，避免只看折扣牌。'],
['shop_daily','牙膏、洗護、生活小物','確認液體容量與行李空間再買。'],
['shop_stationery','文具、毛巾、雜貨','適合最後用剩餘預算補。']]},
{group:'動漫 / 模型',items:[
['shop_figures','模型、公仔、景品','日本橋先比 Surugaya、Joshin、Animate。'],
['shop_character','角色周邊、卡牌、扭蛋','先列作品與角色，不看到限定就全部買。']]},
{group:'3C / 相機',items:[
['shop_camera','鏡頭、相機配件','確認保固、語言、盒況與退稅後價格。'],
['shop_electronics','記憶卡、線材、小型 3C','確認電壓、插頭與是否真的比台灣便宜。']]},
{group:'服飾 / 鞋 / 古著',items:[
['shop_clothes','服飾、外套、古著','Orange Street 試穿後再決定，不只看標示尺寸。'],
['shop_shoes','球鞋、襪子、配件','保留鞋盒前先確認托運空間。']]},
{group:'伴手禮 / USJ',items:[
['shop_snacks','常溫包裝零食、茶、咖啡','先分送禮名單與數量，最後一晚統一裝箱。'],
['shop_usj','USJ 限定頭飾、服飾、角色周邊','先鎖定角色與預算，避免玩到一半一直提袋。'],
['shop_self','自己真正想留的一件紀念品','不要只幫別人買，留一項給自己。']]}],
quickLinks:[
{title:'eSIM',desc:'KKday 日本 SoftBank eSIM',url:'https://www.kkday.com/zh-tw/product/149025-japan-network-card-softbank-high-speed-500mb-1gb-2gb-3gb-esim',label:'KKday eSIM'},
{title:'Visit Japan Web',desc:'入境審查＋海關資料，QR Code 建議截圖',url:'https://services.digital.go.jp/zh-cmn-hant/visit-japan-web/',label:'官方繁中頁'},
{title:'役男出境申請',desc:'有役男身分者確認是否需要申請',url:'https://service.dca.moi.gov.tw/departure/app/Departure/main',label:'內政部役政司'},
{title:'USJ Express Pass',desc:'9/24，4 人同方案且 ≤ ¥20,000 / 人就買',url:'https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka',label:'KKday Express Pass'}],
costs:[
['D1 ¥1,800','KIX → 心齋橋巴士'],['D2 ¥620','大阪 Metro 假日一日券'],['D3 約 ¥1,600','大阪 ↔ 京都電車'],['D4 約 ¥440','心齋橋 → USJ'],['D5 ¥1,800','USJ → KIX 巴士'],['合計約 ¥6,260','每人；不含計程車']],
days:[
{id:'d1',no:'DAY 1',date:'9/21（一）',title:'抵達大阪・心齋橋',image:'https://media.triple.guide/triple-cms/c_limit%2Cf_auto%2Ch_1024%2Cw_1024/3c8d25e6-79f8-40be-be24-e589261ad794',alt:'大阪道頓堀夜景',items:[
{time:'13:20',title:'KIX T2 抵達',desc:'Peach 在第 2 航廈。Visit Japan Web 先做好，領完行李直接進城。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]},
{time:'15:15 決定',title:'趕得上就搭 15:32 直達巴士',desc:'15:15 前已領到行李並往 T2 巴士站移動才保留直達；否則不要追車。',status:'decision',statusLabel:'切換點',transport:{head:'KIX T2 → 心齋橋 Hotel Nikko',fare:'¥1,800 / 人',steps:['到第 2 航廈巴士乘車處，先買「近鉄上本町・心斎橋」車票。','15:32 T2 發車 → 16:59 Hotel Nikko Osaka 下車。','下車後步行約 10–15 分鐘到捷絲旅；不想拖箱就 4 人叫短程計程車。','未達 15:15 條件：改搭 16:32 T2 → 17:46 上本町，再分攤計程車到飯店。']},actions:[['官方時刻表','https://www.kate.co.jp/timetable/detail/UH/dep'],['導航到飯店','https://www.google.com/maps/dir/?api=1&origin=Kansai+International+Airport+Terminal+2&destination=Just+Sleep+Osaka+Shinsaibashi','route']]},
{time:'17:20',title:'捷絲旅 Check-in',desc:'前三晚固定住 Just Sleep Osaka Shinsaibashi。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Just+Sleep+Osaka+Shinsaibashi','map']]},
{time:'18:00–20:00',title:'心齋橋 PARCO＋心齋橋筋',desc:'先處理服飾、潮流、簡單購物。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Shinsaibashi+PARCO','map']]},
{time:'20:00–21:45',title:'道頓堀＋拉麵',desc:'第一晚吃簡單；大量藥妝與伴手禮留 D2。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Dotonbori+Osaka','map']]}]},
{id:'d2',no:'DAY 2',date:'9/22（二）',title:'大阪購物主日＋夜景＋松阪牛',image:'https://www.edreams.ph/images/destinations/600x600/OSA.jpg',alt:'大阪城',items:[
{time:'08:00',title:'買 Osaka Metro 一日券',desc:'今天 Metro 搭乘多，假日版 Enjoy Eco Card 較適合。',transport:{head:'🎫 Enjoy Eco Card',fare:'¥620 / 人',steps:['從飯店步行約 7–10 分鐘到心齋橋站。','券賣機購買「1日乗車券 エンジョイエコカード（土日祝）」。','今天 Metro 段用一日券，不扣 Suica。']}},
{time:'08:15–09:45',title:'大阪城｜可選，只抓精華',desc:'睡眠不足、下雨或購物優先就跳過；不為天守排隊，也不另找時間補。',status:'optional',statusLabel:'可跳過',transport:{head:'心齋橋 N15 → 森ノ宮 N20',fare:'一日券含',steps:['搭長堀鶴見緑地線，往門真南方向。','不用轉車，在森ノ宮下車，依「大阪城公園」指標走。','跳過時：10:00 左右直接從心齋橋前往日本橋。']},actions:[['大阪城地圖','https://www.google.com/maps/search/?api=1&query=Osaka+Castle','map'],['交通導航','https://www.google.com/maps/dir/?api=1&origin=Shinsaibashi+Station&destination=Osaka+Castle&travelmode=transit','route']]},
{time:'10:30–13:30',title:'日本橋 Den Den Town',desc:'動漫、模型、遊戲主場。Surugaya → Joshin Super Kids Land → Animate。',transport:{head:'🚇 森ノ宮 → 日本橋',fare:'一日券含',steps:['森ノ宮搭長堀鶴見緑地線往大正。','長堀橋轉堺筋線，往天下茶屋。','日本橋 K17 下車後一路往南逛 Den Den Town。']},actions:[['📍 Surugaya','https://www.google.com/maps/search/?api=1&query=Surugaya+Nipponbashi+Osaka','map'],['📍 Joshin','https://www.google.com/maps/search/?api=1&query=Joshin+Super+Kids+Land+Osaka','map'],['📍 Animate','https://www.google.com/maps/search/?api=1&query=Animate+Osaka+Nipponbashi','map']]},
{time:'13:30–14:15',title:'拉麵午餐',desc:'選日本橋／難波當下排隊短的店，不為網紅店浪費 60–90 分鐘。'},
{time:'14:20–15:40',title:'Bic Camera 難波＋相機店',desc:'3C、相機、配件集中處理；想看二手鏡頭順便看 Naniwa Camera。',actions:[['📍 Bic Camera','https://www.google.com/maps/search/?api=1&query=Bic+Camera+Namba','map'],['📍 Naniwa Camera','https://www.google.com/maps/search/?api=1&query=Naniwa+Camera+Namba+Marui','map']]},
{time:'16:00–17:20',title:'Orange Street＋美國村',desc:'潮牌、古著、鞋店。4 人可分開逛，約好集合點。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Orange+Street+Osaka','map']]},
{time:'17:45–19:00',title:'HARUKAS 300',desc:'這趟只留一個正式高空夜景。',transport:{head:'🚇 心齋橋 M19 → 天王寺 M23',fare:'一日券含',steps:['搭御堂筋線往なかもず／中百舌鳥方向。','不用轉車，在天王寺下車，跟「阿倍野ハルカス」指標。']},actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Harukas+300+Osaka','map']]},
{time:'19:30–21:30',title:'松阪牛焼肉 M 法善寺 Hanare',desc:'4 人；Special 約 ¥11,880 / 人、Premium 約 ¥14,080 / 人。',transport:{head:'🚇 天王寺 M23 → なんば M20',fare:'一日券含',steps:['御堂筋線往箕面萱野／新大阪方向。','なんば下車，Google Maps 步行約 5–10 分鐘到法善寺。']},actions:[['官方網站','https://matsusaka-projects.com/english/shop/houzenji-hanare'],['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Matsusakagyu+Yakiniku+M+Houzenji+Hanare+Osaka','map']]},
{time:'21:30–22:00',title:'藥妝 / Donki 補貨',desc:'重物集中今晚買，回飯店直接整理。',actions:[['📍 Donki 道頓堀','https://www.google.com/maps/search/?api=1&query=Don+Quijote+Dotonbori+Osaka','map']]}]},
{id:'d3',no:'DAY 3',date:'9/23（三）',title:'京都經典一日',image:'https://cs13.pikabu.ru/post_img/big/2023/11/09/7/1699525999187637469.jpg',alt:'伏見稻荷千本鳥居',rainPlan:{title:'大雨 Plan B',trigger:'前一晚預報持續降雨，或當天體感已不適合長距離步行',steps:['伏見稻荷只走入口與前段鳥居，最晚 08:30 離開。','取消清水寺長上坡，改三十三間堂等室內景點。','下午集中錦市場、寺町與新京極商店街；不硬追戶外點。'],url:'https://global.kyoto.travel/en/faq/detail.php?faq_id=1019'},items:[
{time:'06:20',title:'心齋橋 → 伏見稻荷',desc:'秋分日，京都一定早出。',transport:{head:'🚇＋🚆 心齋橋 → 伏見稻荷',fare:'約 ¥680',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 淀屋橋 M17。','步行轉京阪淀屋橋 KH01。','往出町柳方向；若搭特急，在丹波橋轉準急／普通。','伏見稲荷 KH34 下車；全程直接刷 Suica。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Fushimi+Inari+Taisha&travelmode=transit','route']]},
{time:'07:35–09:10',title:'伏見稻荷',desc:'千本鳥居走到中段就回，不攻完整稻荷山。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Fushimi+Inari+Taisha','map']]},
{time:'09:20–10:15',title:'伏見稻荷 → 清水寺',desc:'到清水五條後，上坡若太熱／下雨可 4 人分攤計程車。',transport:{head:'🚆 伏見稻荷 KH34 → 清水五條 KH38',fare:'約 ¥240',steps:['搭京阪本線往出町柳方向。','普通／準急都可以，清水五條下車。','步行上坡約 20–25 分鐘到清水寺。']},actions:[['↗ 直接導航','https://www.google.com/maps/dir/?api=1&origin=Fushimi+Inari+Taisha&destination=Kiyomizu-dera&travelmode=transit','route']]},
{time:'10:20–12:30',title:'清水寺 → 三年坂 → 二年坂',desc:'主景點上午完成，避開午後最大人潮。',actions:[['📍 清水寺','https://www.google.com/maps/search/?api=1&query=Kiyomizu-dera+Kyoto','map']]},
{time:'12:30–15:00',title:'午餐 A / B / C＋祇園',desc:'12:20 看排隊長度，選第一個能在 20 分鐘內入座的方案；不為名店打亂下午。',status:'choice',statusLabel:'現場三選一',choices:[{label:'A · 最近',title:'祇園 京めん',desc:'京風烏龍／蕎麥；祇園會館 1F，動線最短。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Kyomen+Kyoto'},{label:'B · 傳統',title:'祇園權兵衛',desc:'蕎麥、烏龍與丼飯；適合想坐下吃完整午餐。',url:'https://www.google.com/maps/search/?api=1&query=Gion+Gonbe+Kyoto'},{label:'C · 雨天',title:'四条河原町餐廳層',desc:'直接往百貨公司室內用餐，再接錦市場與商店街。',url:'https://www.google.com/maps/search/?api=1&query=Kyoto+Kawaramachi+department+store+restaurants'}],actions:[['八坂神社地圖','https://www.google.com/maps/search/?api=1&query=Yasaka+Shrine+Kyoto','map'],['花見小路地圖','https://www.google.com/maps/search/?api=1&query=Hanamikoji+Street+Kyoto','map']]},
{time:'15:15–17:30',title:'錦市場＋河原町',desc:'伴手禮、零食、自由購物。',actions:[['📍 錦市場','https://www.google.com/maps/search/?api=1&query=Nishiki+Market+Kyoto','map'],['📍 河原町','https://www.google.com/maps/search/?api=1&query=Kawaramachi+Kyoto','map']]},
{time:'17:45–19:15',title:'京都 → 心齋橋',desc:'晚上簡單居酒屋，21:30 前回飯店。',transport:{head:'🚆＋🚇 祇園四条 → 心齋橋',fare:'約 ¥680',steps:['祇園四条 KH39 搭京阪特急淀屋橋行。','淀屋橋轉御堂筋線往なかもず方向。','心齋橋 M19 下車。','今天總交通約 ¥1,600 / 人。']},actions:[['↗ 回飯店導航','https://www.google.com/maps/dir/?api=1&origin=Gion-Shijo+Station&destination=Just+Sleep+Osaka+Shinsaibashi&travelmode=transit','route']]}]},
{id:'d4',no:'DAY 4',date:'9/24（四）',title:'USJ＋換住環球塔',image:'https://rimage.gnst.jp/livejapan.com/public/article/detail/a/20/00/a2000380/img/basic/a2000380_thumbnail.jpg',alt:'日本環球影城',items:[
{time:'05:50',title:'起床＋退房',desc:'全部行李一起帶走，不再回心齋橋。'},
{time:'06:15–07:05',title:'心齋橋 → Universal City',desc:'先到環球塔寄行李。',transport:{head:'🚇＋🚆 心齋橋 → Universal City',fare:'約 ¥440',steps:['心齋橋 M19 搭御堂筋線往箕面萱野／新大阪方向 → 梅田 M16。','跟「JR 大阪駅」指標走，不要走去阪急／阪神。','JR 大阪搭大阪環狀線往西九条方面。','若列車直通桜島／Universal City 就直接坐；否則西九条轉 JR ゆめ咲線桜島行。','ユニバーサルシティ下車。']},actions:[['↗ 換飯店導航','https://www.google.com/maps/dir/?api=1&origin=Just+Sleep+Osaka+Shinsaibashi&destination=Hotel+Keihan+Universal+Tower&travelmode=transit','route']]},
{time:'07:05',title:'Hotel Keihan Universal Tower 寄行李',desc:'飯店離 JR Universal City 與 USJ 都非常近。',actions:[['📍 Google Maps','https://www.google.com/maps/search/?api=1&query=Hotel+Keihan+Universal+Tower','map']]},
{time:'07:15',title:'開始排 USJ',desc:'不要照表定開園時間才到；官方可能提早入園。',actions:[['📍 USJ','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan','map'],['↗ 步行導航','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Universal+Studios+Japan&travelmode=walking','route']]},
{time:'入園後',title:'先處理 SUPER NINTENDO WORLD',desc:'有 Express 就以指定時段為骨架；沒有就第一時間開 USJ App 處理 Area Timed Entry / Standby Entry。'},
{time:'白天',title:'大型設施優先',desc:'Mario Kart、Donkey Kong、Flying Dinosaur、Hollywood Dream、Harry Potter。'},
{time:'18:00+',title:'Halloween Horror Nights',desc:'晚上不要提早離園；依當日官方時間表安排 Biohazard、Sadako、Chainsaw Man 等活動。'},
{time:'閉園後',title:'走回環球塔',desc:'玩完直接休息，不回心齋橋。'}]},
{id:'d5',no:'DAY 5',date:'9/25（五）',title:'回台灣',image:'https://hoshinoresorts.com/jp/guide/wp-content/uploads/2025/06/T2.jpg',alt:'關西國際機場第二航廈',items:[
{time:'08:00–09:40',title:'睡醒＋整理＋秤重',desc:'不排景點；把廉航與大行李風險壓低。'},
{time:'10:20',title:'去 USJ Bus Terminal 排隊',desc:'4 人提早到，避免想搭的班次滿座。',transport:{head:'🚌 USJ 機場巴士乘車處',fare:'目標 10:20 到',steps:['從環球塔步行到 USJ Bus Terminal／交通廣場。','排関西空港行；可先向現場人員確認乘車處。','Suica 可作為交通系 IC 使用時就直接感應。']},actions:[['📍 巴士乘車處','https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Bus+Terminal','map']]},
{time:'10:50–11:51',title:'USJ → KIX T2',desc:'搭一班到底，不要在 T1 下車。',transport:{head:'🚌 USJ → KIX Terminal 2',fare:'¥1,800 / 人',steps:['10:50 USJ 發車。','11:40 KIX T1：不要下車。','11:51 KIX T2：Peach 國際線在這裡下車。','備援：11:10 → 12:31 T2。']},actions:[['官方時刻表','https://www.kate.co.jp/en/timetable/detail/NU'],['↗ 導航到 KIX','https://www.google.com/maps/dir/?api=1&origin=Hotel+Keihan+Universal+Tower&destination=Kansai+International+Airport+Terminal+2','route']]},
{time:'12:45 起',title:'Peach 報到 → MM027',desc:'15:15 起飛。先托運，再處理安檢與免稅。',transport:{head:'✈️ Peach 國際線報到',fare:'KIX T2',steps:['預留起飛前約 150 分鐘開始辦理的時間。','最晚不要壓到起飛前 50 分鐘附近。','手提：隨身物品＋手提行李合計 2 件、總重 7kg 內。']},actions:[['📍 KIX T2','https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Terminal+2','map']]}]}],
travelInfo:[
{title:'KKday SoftBank eSIM',desc:'4 人各自一張；台灣先安裝，到日本再啟用行動數據。'},
{title:'Suica（西瓜卡）',desc:'大阪 Metro、JR、京阪等支援時直接刷；每人先儲值約 ¥3,000–5,000。'},
{title:'Visit Japan Web',desc:'出發前填好入境審查與海關，QR Code 建議截圖離線保存。'},
{title:'Google Maps / Translate / USJ App',desc:'Google Maps 建議先下載大阪、京都離線地圖。'}],
checklist:[
['證件 / 入境',[
['passport','護照正本','出門前最後再確認一次。'],['passportcopy','護照備份','手機照片＋雲端；可再放一份影本。'],['flight','Peach 電子機票','MM024、MM027 截圖離線保存。'],['hotel','飯店訂房資料','捷絲旅 3 晚＋京阪環球塔 1 晚。'],['vjw','Visit Japan Web 完成','每人 QR Code 截圖。'],['military','役男出境確認','有役男身分者辦理；不適用者略過。']]],
['手機 / 交通 / 付款',[
['esim','KKday eSIM 安裝完成','到日本才啟用旅遊 eSIM 行動數據。'],['suica','Suica 可以使用','Apple Wallet / 實體卡皆可。'],['cash','日幣現金＋信用卡','不要只帶單一付款方式。'],['apps','Google Maps / Translate / USJ App','先下載並登入。']]],
['USJ / 預約',[
['usj','USJ 電子票拿到','收到後加入 USJ 官方 App，4 人都能離線叫出。'],['express','檢查 9/24 Express Pass','4 人同方案；上限 ¥20,000 / 人。'],['meat','9/22 19:30 松阪牛 M 訂位','確認分店與 4 人席位。'],['roomtype','確認兩間房的房型與床型','逐筆核對 DOUBLE / TWIN、入住姓名與 4 人配置。']]],
['現場切換規則',[
['d1cutoff','D1 15:15 巴士規則全員知道','未達條件就搭 16:32 到上本町，不追 15:32。'],['weather','9/20 晚上做最終天氣檢查','京都大雨走室內版；USJ 備雨具與替換襪。'],['d5bus','D5 10:20 到 USJ 巴士站','目標 10:50 發車；備援 11:10。']]],
['行李 / 電子用品',[
['charger','手機充電器＋充電線','日本 100V、A 型兩扁腳；100–240V 充電器可直接使用。'],['powerbank','行動電源放隨身行李','不可托運；出發前再核對 Peach 最新規定。'],['scale','小型行李秤','回程藥妝、3C、伴手禮容易超重。'],['umbrella','折疊傘 / 輕便雨具','京都與 USJ 都大量戶外步行。'],['shoes','好走的鞋','京都＋USJ 連兩天會很有感。'],['meds','個人常用藥','依個人需求攜帶，處方藥保留原包裝。']]]]
};

export default TRIP_DATA
