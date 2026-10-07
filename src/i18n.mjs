/**
 * 多语言层 —— 简体中文 / 繁體中文 / English / 日本語 / 한국어
 *
 * 设计原则
 * --------
 * 1. **英文是内容的主源（canonical）**。官方原文是英文（NZ Road Code），
 *    所以题干 / 选项 / 解析都以英文为准，其余语言在英文基础上呈现。
 * 2. **简体中文是既有的手写内容**，保持不变；繁體中文由简体转换得到（见 toHant）。
 * 3. 261 道题 × 5 种语言的题干/选项/解析若全部预存，产物会膨胀到 MB 级。
 *    所以：UI 文案 5 语全内置；题目内容以「简体原文 + 英文原文」两条线，
 *    其余语言在运行时按需转换，产物增量可控。
 *
 * ⚠️ 语言代码用 BCP-47：zh-Hans / zh-Hant / en / ja / ko。
 *    站内 HTML 的 <html lang> 与 hreflang 都用这个。
 */

/** 支持的语言，顺序即切换器中的显示顺序。 */
export const LOCALES = ['zh-Hans', 'zh-Hant', 'en', 'ja', 'ko'];

/** 各语言的显示名（用该语言自身书写，切换器上显示这个）。 */
export const LOCALE_NATIVE = {
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어'
};

/** 切换器上的短标签（窄屏用）。 */
export const LOCALE_SHORT = {
  'zh-Hans': '简',
  'zh-Hant': '繁',
  en: 'EN',
  ja: '日',
  ko: '한'
};

/** hreflang 值（与 BCP-47 一致，可直接用）。 */
export const LOCALE_HTML_LANG = {
  'zh-Hans': 'zh-Hans',
  'zh-Hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
  ko: 'ko'
};

/** Open Graph locale 值。 */
export const LOCALE_OG = {
  'zh-Hans': 'zh_CN',
  'zh-Hant': 'zh_TW',
  en: 'en_NZ',
  ja: 'ja_JP',
  ko: 'ko_KR'
};

/* ==========================================================================
   UI 文案词典
   键名用点号分层；{n} / {name} 之类是占位符，由注入的 format 替换。
   ========================================================================== */

export const UI = {
  'zh-Hans': {
    'site.name': 'NZ Road Code 中文版',
    'site.tagline': '新西兰交规理论学习和模拟考试',
    'site.brandSub': 'NEW ZEALAND ROAD CODE',

    'nav.home': '首页',
    'nav.study': '理论学习',
    'nav.exam': '模拟考试',
    'nav.about': '关于本站',
    'nav.backTo': '返回{label}',
    'nav.startExam': '开始模拟考',
    'nav.mainNav': '主导航',
    'nav.footerNav': '页脚导航',
    'nav.tabbar': '底部导航',
    'nav.breadcrumb': '面包屑',
    'nav.questionNav': '题号导航',
    'nav.langSwitcher': '切换语言',

    'common.back': '返回',
    'common.prev': '上一题',
    'common.next': '下一题',
    'common.finishStudy': '完成学习',
    'common.seeAnswer': '看答案',
    'common.question': '题',
    'common.correctAnswer': '正确答案',
    'common.explanation': '解析',
    'common.examTime': '限时 {n} 分钟',
    'common.passLine': '通过线 {n} 题',
    'common.passLinePct': '通过线 {pct} 题（90%）',
    'common.questionsCount': '共 {n} 题',
    'common.viewQuestion': '查看该题',
    'common.backHome': '返回首页',
    'common.browse': '浏览题库',
    'study.qCount': '第 {i} 题 / 共 {n} 题',

    'home.badge': '新西兰驾照理论考试 · 交规题库',
    'home.h1a': '新西兰交规',
    'home.h1b': '理论学习和模拟考试',
    'home.lede': '按新西兰官方道路规则整理的 8 个学习分类、共 {n} 道中文试题。逐题即时判分、每题都有解析，配合四种题量的模拟考试，帮你把规则真正弄懂，而不是死记答案。',
    'home.startExam': '开始正式考试模拟',
    'home.startStudy': '分类理论学习',
    'home.statQuestions': '道原创试题',
    'home.statCategories': '个知识分类',
    'home.statExamSizes': '种模拟题量',
    'home.statNoAds': '广告与追踪',
    'home.studyHead': '理论学习',
    'home.studySub': '按知识领域分块，先弄懂再做题',
    'home.examHead': '模拟考试',
    'home.examSub': '随机抽题，计时作答，交卷后逐题回顾',
    'home.examMeta': '限时 {t} 分钟 · 通过线 {n} 题',
    'home.startThisExam': '开始考试',
    'home.whatHead': '这个网站有什么',
    'home.whatText': '覆盖新西兰小型汽车驾照理论考试的全部知识领域：核心规则、驾驶行为、停车标识、紧急事故、道路位置、交通路口、理论知识和道路标识。每道题都配有中文解析，讲清楚「为什么」。',
    'home.whatMore': '浏览全部 {n} 道题 →',
    'home.howHead': '如何准备理论考试',
    'home.howText': '建议先按分类逐个学习，每题都读一遍解析；全部过完后再做「正式考试模拟（35 题）」。连续两次达到 90% 以上正确率，说明知识点已经掌握。',
    'home.howMore': '了解本站与备考建议 →',

    'cap.sv-crossroads': '无标志十字路口 · 蓝车直行，红车从右侧驶来',
    'cap.sv-roundabout': '环岛 · 蓝车准备进入，红车已在环岛内',
    'cap.sv-t-junction': 'T 型路口 · 蓝车在支路，红车在贯通道路',
    'cap.sv-right-turn': '蓝车右转 · 红车对向直行',

    'exam.e10.label': '简单模拟',
    'exam.e10.desc': '适合刚接触新西兰交规的初学者，快速熟悉题型。',
    'exam.e20.label': '中度模拟',
    'exam.e20.desc': '覆盖主要知识点的中等强度练习。',
    'exam.e35.label': '正式考试模拟',
    'exam.e35.desc': '与新西兰驾照理论考试题量一致，通过线为答对 32 题。',
    'exam.e50.label': '全面模拟',
    'exam.e50.desc': '最大范围的综合测试，适合考前冲刺。',
    'study.title': '理论学习',
    'study.indexIntro': '新西兰小型汽车驾照理论考试的知识点分为 8 个领域，共 {n} 道试题。每个分类都可以逐题学习：选完答案立刻看到对错和解析，答错的题会在学习结束时汇总出来。',
    'study.catMeta': '共 {n} 题 →',
    'study.allQuestions': '全部试题',
    'study.allQuestionsSub': '按分类列出，点击可直接查看答案解析',
    'study.questionList': '题目列表',
    'study.practice': '开始逐题学习',
    'study.practiceShort': '逐题学习',
    'study.practiceIntro': '共 {n} 题 · 选完答案立即判分并显示解析 · 可用键盘数字键 1-4 选择',
    'study.enterPractice': '进入逐题学习',
    'study.directExam': '直接模拟考试',

    'study.practiceWithCount': '开始逐题学习（{n} 题）',
    'study.prevQuestion': '← 上一题',
    'study.nextQuestion': '下一题 →',

    'exam.title': '模拟考试',
    'exam.nav': '题号导航',
    'exam.questionN': '第 {n} 题',
    'exam.indexIntro': '从全部 {n} 道题中按分类比例随机抽题，作答过程中不显示对错，交卷后统一给出成绩与逐题回顾。计时会在时间耗尽时自动交卷。',
    'exam.pageMeta': '限时 {t} 分钟 · 通过线 {n} 题 · 交卷后可逐题回顾',
    'exam.scoringNote': '新西兰驾照理论考试为 35 题、答对 32 题及格。本站所有模拟考试统一采用 90% 的正确率作为通过线，便于横向比较。',
    'exam.start': '开始考试',
    'exam.countLabel': '{n} 题',
    'exam.answered': '已答 {n} 题',
    'exam.submit': '交卷',
    'exam.remaining': '剩余 {t}',
    'exam.confirmSubmit': '还有 {n} 题未作答，确定要交卷吗？',
    'exam.passed': '通过 ✓',
    'exam.failed': '未通过',
    'exam.timeUp': '时间到，已自动交卷。',
    'exam.resultSub': '本次正确率 {pct}%，通过线为答对 {need} 题（90%）。',
    'exam.retake': '再考一次',
    'exam.review': '答题回顾',
    'exam.statCorrect': '答对',
    'exam.statWrong': '答错',
    'exam.statUsed': '用时',
    'exam.statRate': '正确率',
    'exam.tagCorrect': '正确',
    'exam.tagWrong': '错误',
    'exam.tagUnanswered': '未作答',
    'exam.aboutScoring': '关于评分：',

    'result.correct': '✓ 回答正确',
    'result.wrong': '✕ 回答错误',
    'result.isCorrectAnswer': '正确答案是',
    'result.studyDone': '{cat} 学习完成',
    'result.studySub': '本次共作答 {done} 题，答对 {correct} 题，答错 {wrong} 题',
    'result.answered': '已作答',
    'result.correctN': '答对',
    'result.correctAnswerIs': '正确答案是',
    'result.wrongN': '答错',
    'result.rate': '正确率',
    'result.retryCat': '重新学习本分类',
    'result.wrongReview': '错题回顾（{n} 题）',

    'about.title': '关于本站',
    'about.intro': '{site} 是一个面向中文用户的新西兰驾照理论学习与模拟考试站点。全站只做两件事：理论学习 和 模拟考试。',
    'about.hContent': '内容说明',
    'about.pContent': '本站全部 {n} 道试题、选项与解析均为依据新西兰官方道路规则（New Zealand Road Code / Land Transport (Road User) Rule 2004）重新撰写的中文原创内容，用于帮助读者理解规则本身。站内所有道路标志与路口示意图为自绘 SVG 图形，不使用任何第三方图片素材。',
    'about.pDisclaimer': '本站不是新西兰交通局（NZTA / Waka Kotahi）的官方产品，题目与真实考试的表述不完全相同。真实考试请以官方发布的 Road Code 为准。',
    'about.hNoAds': '没有广告',
    'about.pNoAds': '本站不含任何广告位、第三方统计脚本、追踪像素或社交插件。页面加载的资源只有本站自己的样式表、脚本和图形。',
    'about.hTips': '备考建议',
    'about.pTips': '1. 按分类逐个学习，每道题都读一遍解析，重点理解「为什么」而不只是记住答案。|2. 学完全部 {c} 个分类后，做一次「正式考试模拟（35 题）」。|3. 连续两次达到 90% 以上正确率，说明知识点已经比较牢固。|4. 考试当天提前到场，仔细读题——真实考试的题目措辞可能略有不同。',
    'about.hTech': '技术说明',
    'about.pTech': '本站是纯静态站点，托管在 Cloudflare 边缘网络上，不收集任何用户数据，也不需要在服务端保存任何信息。你的答题记录只存在于当前浏览器页面中，刷新即清空。',
    'notFound.title': '页面不存在',
    'notFound.body': '没有找到这个页面。可能是链接过期，或者地址输入有误。',
    'notFound.desc': '页面不存在。',
    'noscript.study': '逐题学习需要启用 JavaScript。你也可以直接浏览题目列表查看每道题的答案与解析。',
    'noscript.exam': '模拟考试需要启用 JavaScript。你也可以直接浏览题库进行学习。',

    'meta.loading': '加载中…'
  },

  'zh-Hant': {
    'site.name': 'NZ Road Code 中文版',
    'site.tagline': '紐西蘭交規理論學習和模擬考試',
    'site.brandSub': 'NEW ZEALAND ROAD CODE',

    'nav.home': '首頁',
    'nav.study': '理論學習',
    'nav.exam': '模擬考試',
    'nav.about': '關於本站',
    'nav.backTo': '返回{label}',
    'nav.startExam': '開始模擬考',
    'nav.mainNav': '主導覽',
    'nav.footerNav': '頁尾導覽',
    'nav.tabbar': '底部導覽',
    'nav.breadcrumb': '麵包屑',
    'nav.questionNav': '題號導覽',
    'nav.langSwitcher': '切換語言',

    'common.back': '返回',
    'common.prev': '上一題',
    'common.next': '下一題',
    'common.finishStudy': '完成學習',
    'common.seeAnswer': '看答案',
    'common.question': '題',
    'common.correctAnswer': '正確答案',
    'common.explanation': '解析',
    'common.examTime': '限時 {n} 分鐘',
    'common.passLine': '通過線 {n} 題',
    'common.passLinePct': '通過線 {pct} 題（90%）',
    'common.questionsCount': '共 {n} 題',
    'common.viewQuestion': '查看該題',
    'common.backHome': '返回首頁',
    'common.browse': '瀏覽題庫',
    'study.qCount': '第 {i} 題 / 共 {n} 題',

    'home.badge': '紐西蘭駕照理論考試 · 交規題庫',
    'home.h1a': '紐西蘭交規',
    'home.h1b': '理論學習和模擬考試',
    'home.lede': '按紐西蘭官方道路規則整理的 8 個學習分類、共 {n} 道中文試題。逐題即時判分、每題都有解析，配合四種題量的模擬考試，幫你把規則真正弄懂，而不是死記答案。',
    'home.startExam': '開始正式考試模擬',
    'home.startStudy': '分類理論學習',
    'home.statQuestions': '道原創試題',
    'home.statCategories': '個知識分類',
    'home.statExamSizes': '種模擬題量',
    'home.statNoAds': '廣告與追蹤',
    'home.studyHead': '理論學習',
    'home.studySub': '按知識領域分塊，先弄懂再做題',
    'home.examHead': '模擬考試',
    'home.examSub': '隨機抽題，計時作答，交卷後逐題回顧',
    'home.examMeta': '限時 {t} 分鐘 · 通過線 {n} 題',
    'home.startThisExam': '開始考試',
    'home.whatHead': '這個網站有什麼',
    'home.whatText': '覆蓋紐西蘭小型汽車駕照理論考試的全部知識領域：核心規則、駕駛行為、停車標識、緊急事故、道路位置、交通路口、理論知識和道路標識。每道題都配有中文解析，講清楚「為什麼」。',
    'home.whatMore': '瀏覽全部 {n} 道題 →',
    'home.howHead': '如何準備理論考試',
    'home.howText': '建議先按分類逐個學習，每題都讀一遍解析；全部過完後再做「正式考試模擬（35 題）」。連續兩次達到 90% 以上正確率，說明知識點已經掌握。',
    'home.howMore': '了解本站與備考建議 →',

    'cap.sv-crossroads': '無標誌十字路口 · 藍車直行，紅車從右側駛來',
    'cap.sv-roundabout': '環島 · 藍車準備進入，紅車已在環島內',
    'cap.sv-t-junction': 'T 型路口 · 藍車在支路，紅車在貫通道路',
    'cap.sv-right-turn': '藍車右轉 · 紅車對向直行',

    'exam.e10.label': '簡單模擬',
    'exam.e10.desc': '適合剛接觸紐西蘭交規的初學者，快速熟悉題型。',
    'exam.e20.label': '中度模擬',
    'exam.e20.desc': '覆蓋主要知識點的中等強度練習。',
    'exam.e35.label': '正式考試模擬',
    'exam.e35.desc': '與紐西蘭駕照理論考試題量一致，通過線為答對 32 題。',
    'exam.e50.label': '全面模擬',
    'exam.e50.desc': '最大範圍的綜合測試，適合考前衝刺。',
    'study.title': '理論學習',
    'study.indexIntro': '紐西蘭小型汽車駕照理論考試的知識點分為 8 個領域，共 {n} 道試題。每個分類都可以逐題學習：選完答案立刻看到對錯和解析，答錯的題會在學習結束時彙總出來。',
    'study.catMeta': '共 {n} 題 →',
    'study.allQuestions': '全部試題',
    'study.allQuestionsSub': '按分類列出，點擊可直接查看答案解析',
    'study.questionList': '題目列表',
    'study.practice': '開始逐題學習',
    'study.practiceShort': '逐題學習',
    'study.practiceIntro': '共 {n} 題 · 選完答案立即評分並顯示解析 · 可用鍵盤數字鍵 1-4 選擇',
    'study.enterPractice': '進入逐題學習',
    'study.directExam': '直接模擬考試',

    'study.practiceWithCount': '開始逐題學習（{n} 題）',
    'study.prevQuestion': '← 上一題',
    'study.nextQuestion': '下一題 →',

    'exam.title': '模擬考試',
    'exam.nav': '題號導航',
    'exam.questionN': '第 {n} 題',
    'exam.indexIntro': '從全部 {n} 道題中按分類比例隨機抽題，作答過程中不顯示對錯，交卷後統一給出成績與逐題回顧。計時會在時間耗盡時自動交卷。',
    'exam.pageMeta': '限時 {t} 分鐘 · 通過線 {n} 題 · 交卷後可逐題回顧',
    'exam.scoringNote': '紐西蘭駕照理論考試為 35 題、答對 32 題及格。本站所有模擬考試統一採用 90% 的正確率作為通過線，便於橫向比較。',
    'exam.start': '開始考試',
    'exam.countLabel': '{n} 題',
    'exam.answered': '已答 {n} 題',
    'exam.submit': '交卷',
    'exam.remaining': '剩餘 {t}',
    'exam.confirmSubmit': '還有 {n} 題未作答，確定要交卷嗎？',
    'exam.passed': '通過 ✓',
    'exam.failed': '未通過',
    'exam.timeUp': '時間到，已自動交卷。',
    'exam.resultSub': '本次正確率 {pct}%，通過線為答對 {need} 題（90%）。',
    'exam.retake': '再考一次',
    'exam.review': '答題回顧',
    'exam.statCorrect': '答對',
    'exam.statWrong': '答錯',
    'exam.statUsed': '用時',
    'exam.statRate': '正確率',
    'exam.tagCorrect': '正確',
    'exam.tagWrong': '錯誤',
    'exam.tagUnanswered': '未作答',
    'exam.aboutScoring': '關於評分：',

    'result.correct': '✓ 回答正確',
    'result.wrong': '✕ 回答錯誤',
    'result.isCorrectAnswer': '正確答案是',
    'result.studyDone': '{cat} 學習完成',
    'result.studySub': '本次共作答 {done} 題，答對 {correct} 題，答錯 {wrong} 題',
    'result.answered': '已作答',
    'result.correctN': '答對',
    'result.correctAnswerIs': '正確答案是',
    'result.wrongN': '答錯',
    'result.rate': '正確率',
    'result.retryCat': '重新學習本分類',
    'result.wrongReview': '錯題回顧（{n} 題）',

    'about.title': '關於本站',
    'about.intro': '{site} 是一個面向中文用戶的紐西蘭駕照理論學習與模擬考試站點。全站只做兩件事：理論學習 和 模擬考試。',
    'about.hContent': '內容說明',
    'about.pContent': '本站全部 {n} 道試題、選項與解析均為依據紐西蘭官方道路規則（New Zealand Road Code / Land Transport (Road User) Rule 2004）重新撰寫的中文原創內容，用於幫助讀者理解規則本身。站內所有道路標誌與路口示意圖為自繪 SVG 圖形，不使用任何第三方圖片素材。',
    'about.pDisclaimer': '本站不是紐西蘭交通局（NZTA / Waka Kotahi）的官方產品，題目與真實考試的表述不完全相同。真實考試請以官方發布的 Road Code 為準。',
    'about.hNoAds': '沒有廣告',
    'about.pNoAds': '本站不含任何廣告位、第三方統計腳本、追蹤像素或社交插件。頁面加載的資源只有本站自己的樣式表、腳本和圖形。',
    'about.hTips': '備考建議',
    'about.pTips': '1. 按分類逐個學習，每道題都讀一遍解析，重點理解「為什麼」而不只是記住答案。|2. 學完全部 {c} 個分類後，做一次「正式考試模擬（35 題）」。|3. 連續兩次達到 90% 以上正確率，說明知識點已經比較牢固。|4. 考試當天提前到場，仔細讀題——真實考試的題目措辭可能略有不同。',
    'about.hTech': '技術說明',
    'about.pTech': '本站是純靜態站點，託管在 Cloudflare 邊緣網絡上，不收集任何用戶數據，也不需要在服務端保存任何信息。你的答題記錄只存在於當前瀏覽器頁面中，刷新即清空。',
    'notFound.title': '頁面不存在',
    'notFound.body': '沒有找到這個頁面。可能是連結過期，或者地址輸入有誤。',
    'notFound.desc': '頁面不存在。',
    'noscript.study': '逐題學習需要啟用 JavaScript。你也可以直接瀏覽題目列表查看每道題的答案與解析。',
    'noscript.exam': '模擬考試需要啟用 JavaScript。你也可以直接瀏覽題庫進行學習。',

    'meta.loading': '載入中…'
  },

  en: {
    'site.name': 'NZ Road Code',
    'site.tagline': 'New Zealand road code theory study and practice tests',
    'site.brandSub': 'NEW ZEALAND ROAD CODE',

    'nav.home': 'Home',
    'nav.study': 'Theory study',
    'nav.exam': 'Mock tests',
    'nav.about': 'About',
    'nav.backTo': 'Back to {label}',
    'nav.startExam': 'Start a test',
    'nav.mainNav': 'Main navigation',
    'nav.footerNav': 'Footer navigation',
    'nav.tabbar': 'Bottom navigation',
    'nav.breadcrumb': 'Breadcrumb',
    'nav.questionNav': 'Question navigation',
    'nav.langSwitcher': 'Change language',

    'common.back': 'Back',
    'common.prev': 'Previous',
    'common.next': 'Next',
    'common.finishStudy': 'Finish',
    'common.seeAnswer': 'Show answer',
    'common.question': 'Q',
    'common.correctAnswer': 'Correct answer',
    'common.explanation': 'Explanation',
    'common.examTime': '{n} min',
    'common.passLine': 'Pass mark {n}',
    'common.passLinePct': 'Pass mark {pct} (90%)',
    'common.questionsCount': '{n} questions',
    'common.viewQuestion': 'View question',
    'common.backHome': 'Back to home',
    'common.browse': 'Browse questions',

    'study.qCount': 'Question {i} of {n}',
    'home.badge': 'NZ driver licence theory test · road rules question bank',
    'home.h1a': 'New Zealand road rules',
    'home.h1b': 'theory study and practice tests',
    'home.lede': 'Eight study categories covering New Zealand’s official road rules, with {n} practice questions. Every question is marked instantly with a full explanation, alongside four mock-test sizes — so you actually understand the rules instead of memorising answers.',
    'home.startExam': 'Start a full mock test',
    'home.startStudy': 'Study by category',
    'home.statQuestions': 'original questions',
    'home.statCategories': 'categories',
    'home.statExamSizes': 'test sizes',
    'home.statNoAds': 'ads or tracking',
    'home.studyHead': 'Theory study',
    'home.studySub': 'Learn the rules by topic first, then test yourself',
    'home.examHead': 'Mock tests',
    'home.examSub': 'Random questions, timed, with a full review when you submit',
    'home.examMeta': '{t} min · pass mark {n}',
    'home.startThisExam': 'Start test',
    'home.whatHead': 'What this site covers',
    'home.whatText': 'Every knowledge area of the New Zealand car licence theory test: core rules, driving behaviour, parking signs, emergencies, road position, intersections, theory and road signs. Each question has a clear explanation of the “why”.',
    'home.whatMore': 'Browse all {n} questions →',
    'home.howHead': 'How to prepare for the theory test',
    'home.howText': 'Work through each category and read the explanation for every question. When you have finished them all, sit the full mock test (35 questions). Two consecutive scores above 90% means you know the material.',
    'home.howMore': 'About this site and study tips →',

    'cap.sv-crossroads': 'Crossroads with no signs · blue car going straight, red car approaching from the right',
    'cap.sv-roundabout': 'Roundabout · blue car about to enter, red car already circulating',
    'cap.sv-t-junction': 'T-junction · blue car on the side road, red car on the through road',
    'cap.sv-right-turn': 'Blue car turning right · red car coming the other way',

    'exam.e10.label': 'Short test',
    'exam.e10.desc': 'A quick introduction to the question styles if you are new to the New Zealand road code.',
    'exam.e20.label': 'Medium test',
    'exam.e20.desc': 'A moderate-length practice covering the main knowledge areas.',
    'exam.e35.label': 'Full mock test',
    'exam.e35.desc': 'The same number of questions as the real New Zealand theory test — 32 correct to pass.',
    'exam.e50.label': 'Extended test',
    'exam.e50.desc': 'The widest coverage — a final push before test day.',
    'study.title': 'Theory study',
    'study.indexIntro': 'The New Zealand car licence theory test covers eight knowledge areas, with {n} questions in total. You can study any category question by question: your answer is marked immediately with an explanation, and the ones you get wrong are collected at the end.',
    'study.catMeta': '{n} questions →',
    'study.allQuestions': 'All questions',
    'study.allQuestionsSub': 'Listed by category — tap to see the answer and explanation',
    'study.questionList': 'Question list',
    'study.practice': 'Start studying',
    'study.practiceShort': 'Study',
    'study.practiceIntro': '{n} questions · instant marking with an explanation after each answer · press 1-4 on your keyboard to choose',
    'study.enterPractice': 'Start studying',
    'study.directExam': 'Take a mock test',

    'study.practiceWithCount': 'Study all {n} questions',
    'study.prevQuestion': '← Previous',
    'study.nextQuestion': 'Next →',

    'exam.title': 'Mock tests',
    'exam.nav': 'Question navigation',
    'exam.questionN': 'Question {n}',
    'exam.indexIntro': 'Questions are drawn at random from all {n}, in proportion to each category. You are not told whether you are right until you submit, when you get a score and a question-by-question review. If the timer runs out, your test is submitted automatically.',
    'exam.pageMeta': '{t} min · pass mark {n} · full review after submitting',
    'exam.scoringNote': 'The New Zealand theory test has 35 questions and you must get 32 right to pass. Every mock test here uses a 90% pass mark so the results are easy to compare.',
    'exam.start': 'Start test',
    'exam.countLabel': '{n} questions',
    'exam.answered': 'Answered {n}',
    'exam.submit': 'Submit',
    'exam.remaining': 'Time left {t}',
    'exam.confirmSubmit': '{n} question(s) unanswered. Submit anyway?',
    'exam.passed': 'Passed ✓',
    'exam.failed': 'Not passed',
    'exam.timeUp': 'Time is up — your test was submitted automatically.',
    'exam.resultSub': 'You scored {pct}%. The pass mark is {need} correct (90%).',
    'exam.retake': 'Try again',
    'exam.review': 'Answer review',
    'exam.statCorrect': 'Correct',
    'exam.statWrong': 'Incorrect',
    'exam.statUsed': 'Time',
    'exam.statRate': 'Score',
    'exam.tagCorrect': 'Correct',
    'exam.tagWrong': 'Incorrect',
    'exam.tagUnanswered': 'Unanswered',
    'exam.aboutScoring': 'About scoring:',

    'result.correct': '✓ Correct',
    'result.wrong': '✕ Incorrect',
    'result.isCorrectAnswer': 'The correct answer is',
    'result.studyDone': '{cat} — study complete',
    'result.studySub': 'You answered {done} question(s): {correct} correct, {wrong} incorrect',
    'result.answered': 'Answered',
    'result.correctN': 'Correct',
    'result.correctAnswerIs': 'The correct answer is',
    'result.wrongN': 'Incorrect',
    'result.rate': 'Score',
    'result.retryCat': 'Study this category again',
    'result.wrongReview': 'Review of incorrect answers ({n})',

    'about.title': 'About this site',
    'about.intro': '{site} is a New Zealand driver licence theory study and practice-test site for readers of Chinese. It does exactly two things: theory study and mock tests.',
    'about.hContent': 'About the content',
    'about.pContent': 'All {n} questions, options and explanations on this site are original Chinese content written from the official New Zealand Road Code and the Land Transport (Road User) Rule 2004, to help readers understand the rules themselves. Every road sign and intersection diagram is a hand-drawn SVG — no third-party image assets are used.',
    'about.pDisclaimer': 'This site is not an official product of NZ Transport Agency (NZTA / Waka Kotahi), and its wording differs from the real test. For the real test, always refer to the officially published Road Code.',
    'about.hNoAds': 'No ads',
    'about.pNoAds': 'This site contains no ad slots, third-party analytics scripts, tracking pixels or social plugins. The only resources loaded are this site’s own stylesheet, scripts and graphics.',
    'about.hTips': 'Study tips',
    'about.pTips': '1. Work through each category and read the explanation for every question — focus on the “why”, not just the answer.|2. Once you have covered all {c} categories, sit a full mock test (35 questions).|3. Two consecutive scores above 90% means the material has stuck.|4. Arrive early on test day and read each question carefully — the wording of the real test may differ slightly.',
    'about.hTech': 'Technical notes',
    'about.pTech': 'This is a purely static site hosted on Cloudflare’s edge network. It collects no user data and stores nothing on a server. Your answers live only in the current browser page and are cleared on refresh.',
    'notFound.title': 'Page not found',
    'notFound.body': 'We couldn’t find that page. The link may be out of date, or the address may be mistyped.',
    'notFound.desc': 'Page not found.',
    'noscript.study': 'Studying requires JavaScript. You can also browse the question list to read each answer and explanation.',
    'noscript.exam': 'Mock tests require JavaScript. You can also browse the question bank to study.',

    'meta.loading': 'Loading…'
  },

  ja: {
    'site.name': 'NZ Road Code',
    'site.tagline': 'ニュージーランドの交通ルール学習と模擬テスト',
    'site.brandSub': 'NEW ZEALAND ROAD CODE',

    'nav.home': 'ホーム',
    'nav.study': '学科学習',
    'nav.exam': '模擬テスト',
    'nav.about': 'このサイトについて',
    'nav.backTo': '{label} に戻る',
    'nav.startExam': '模擬テストを始める',
    'nav.mainNav': 'メインナビ',
    'nav.footerNav': 'フッターナビ',
    'nav.tabbar': '下部ナビ',
    'nav.breadcrumb': 'パンくず',
    'nav.questionNav': '問題ナビ',
    'nav.langSwitcher': '言語を切り替え',

    'common.back': '戻る',
    'common.prev': '前へ',
    'common.next': '次へ',
    'common.finishStudy': '学習を終える',
    'common.seeAnswer': '答えを見る',
    'common.question': '問',
    'common.correctAnswer': '正解',
    'common.explanation': '解説',
    'common.examTime': '制限時間 {n} 分',
    'common.passLine': '合格ライン {n} 問',
    'common.passLinePct': '合格ライン {pct} 問（90%）',
    'common.questionsCount': '全 {n} 問',
    'common.viewQuestion': 'この問題を見る',
    'common.backHome': 'ホームに戻る',
    'common.browse': '問題を見る',

    'study.qCount': '{n} 問中 {i} 問目',
    'home.badge': 'NZ 運転免許 学科試験 · 交通ルール問題集',
    'home.h1a': 'ニュージーランドの交通ルール',
    'home.h1b': '学科学習と模擬試験',
    'home.lede': 'ニュージーランドの公式道路ルールをまとめた 8 つの学習カテゴリ、全 {n} 問。1 問ごとに即時採点し、すべてに解説が付きます。4 種類の模擬試験とあわせて、答えを丸暗記するのではなくルールを本当に理解できます。',
    'home.startExam': '本番形式の模擬試験を始める',
    'home.startStudy': 'カテゴリ別に学習する',
    'home.statQuestions': '問のオリジナル問題',
    'home.statCategories': 'の知識カテゴリ',
    'home.statExamSizes': '種類の模擬試験',
    'home.statNoAds': '広告・トラッキング',
    'home.studyHead': '学科学習',
    'home.studySub': '分野ごとに理解してから問題を解く',
    'home.examHead': '模擬試験',
    'home.examSub': 'ランダム出題・時間制限つき、提出後は全問を振り返り',
    'home.examMeta': '制限時間 {t} 分 · 合格ライン {n} 問',
    'home.startThisExam': '試験を始める',
    'home.whatHead': 'このサイトの内容',
    'home.whatText': 'ニュージーランドの普通自動車免許 学科試験の全分野を収録：基本ルール、運転行動、駐車標識、緊急時、走行位置、交差点、学科知識、道路標識。すべての問題に「なぜそうなるのか」を説明する解説付きです。',
    'home.whatMore': '全 {n} 問を見る →',
    'home.howHead': '学科試験の準備方法',
    'home.howText': 'まずカテゴリごとに学習し、各問の解説を読んでください。すべて終えたら「本番形式の模擬試験（35 問）」に挑戦しましょう。2 回続けて 90% 以上取れれば、内容を理解できています。',
    'home.howMore': 'このサイトと学習のヒント →',

    'cap.sv-crossroads': '標識のない十字路 · 青い車は直進、赤い車は右から接近',
    'cap.sv-roundabout': 'ラウンドアバウト · 青い車は進入前、赤い車はすでに環内',
    'cap.sv-t-junction': 'T 字路 · 青い車は従道路、赤い車は本線',
    'cap.sv-right-turn': '青い車が右折 · 赤い車は対向直進',

    'exam.e10.label': 'ショート模試',
    'exam.e10.desc': 'ニュージーランドの交通ルールに初めて触れる方向け。出題形式にすぐ慣れられます。',
    'exam.e20.label': 'ミディアム模試',
    'exam.e20.desc': '主要な知識点をカバーする中程度の練習です。',
    'exam.e35.label': '本番形式模試',
    'exam.e35.desc': 'ニュージーランドの学科試験と同じ問題数。32 問正解で合格ラインです。',
    'exam.e50.label': '総合模試',
    'exam.e50.desc': '最も広い範囲をカバーする総合テスト。試験前の追い込みに最適です。',
    'study.title': '学科学習',
    'study.indexIntro': 'ニュージーランドの普通自動車免許 学科試験の知識点は 8 つの分野、全 {n} 問です。どのカテゴリも 1 問ずつ学習でき、答えるとすぐに正誤と解説が表示されます。間違えた問題は学習の最後にまとめて確認できます。',
    'study.catMeta': '全 {n} 問 →',
    'study.allQuestions': 'すべての問題',
    'study.allQuestionsSub': '分野ごとの一覧。タップすると答えと解説を表示します',
    'study.questionList': '問題一覧',
    'study.practice': '問題演習を始める',
    'study.practiceShort': '問題演習',
    'study.practiceIntro': '全 {n} 問 · 回答後すぐに採点と解説を表示 · キーボードの 1〜4 で選択できます',
    'study.enterPractice': '問題演習を始める',
    'study.directExam': '模擬テストへ',

    'study.practiceWithCount': '全 {n} 問を学習する',
    'study.prevQuestion': '← 前の問題',
    'study.nextQuestion': '次の問題 →',

    'exam.title': '模擬テスト',
    'exam.nav': '問題ナビ',
    'exam.questionN': '第 {n} 問',
    'exam.indexIntro': '全 {n} 問からカテゴリの比率に応じてランダムに出題します。解答中は正誤を表示せず、提出後にまとめて成績と全問の振り返りを表示します。時間切れになると自動的に提出されます。',
    'exam.pageMeta': '制限時間 {t} 分 · 合格ライン {n} 問 · 提出後に全問振り返り',
    'exam.scoringNote': 'ニュージーランドの学科試験は 35 問で、32 問正解で合格です。本サイトの模擬試験はすべて 90% を合格ラインとして統一しており、比較しやすくなっています。',
    'exam.start': 'テストを始める',
    'exam.countLabel': '{n} 問',
    'exam.answered': '回答済み {n}',
    'exam.submit': '提出する',
    'exam.remaining': '残り {t}',
    'exam.confirmSubmit': '未回答が {n} 問あります。提出しますか？',
    'exam.passed': '合格 ✓',
    'exam.failed': '不合格',
    'exam.timeUp': '時間切れのため自動的に提出されました。',
    'exam.resultSub': '正答率 {pct}%。合格ラインは {need} 問正解（90%）です。',
    'exam.retake': 'もう一度',
    'exam.review': '解答の振り返り',
    'exam.statCorrect': '正解',
    'exam.statWrong': '不正解',
    'exam.statUsed': '所要時間',
    'exam.statRate': '正答率',
    'exam.tagCorrect': '正解',
    'exam.tagWrong': '不正解',
    'exam.tagUnanswered': '未回答',
    'exam.aboutScoring': '採点について：',

    'result.correct': '✓ 正解です',
    'result.wrong': '✕ 不正解です',
    'result.isCorrectAnswer': '正解は',
    'result.studyDone': '{cat} の学習が完了しました',
    'result.studySub': '今回 {done} 問に回答：正解 {correct} 問、不正解 {wrong} 問',
    'result.answered': '回答済み',
    'result.correctN': '正解',
    'result.correctAnswerIs': '正しい答えは',
    'result.wrongN': '不正解',
    'result.rate': '正答率',
    'result.retryCat': 'この分野をやり直す',
    'result.wrongReview': '間違えた問題の復習（{n} 問）',

    'about.title': 'このサイトについて',
    'about.intro': '{site} は、中国語話者向けのニュージーランド運転免許 学科学習・模擬試験サイトです。サイトが行うことは 学科学習 と 模擬試験 の 2 つだけです。',
    'about.hContent': '内容について',
    'about.pContent': '本サイトの全 {n} 問の問題・選択肢・解説は、ニュージーランドの公式道路ルール（New Zealand Road Code / Land Transport (Road User) Rule 2004）に基づいて独自に書き下ろした中国語のオリジナルコンテンツです。読者がルールそのものを理解できるようにするためのものです。道路標識や交差点の図はすべて自作の SVG で、第三者の画像素材は一切使用していません。',
    'about.pDisclaimer': '本サイトは NZTA（Waka Kotahi）の公式製品ではありません。問題文は実際の試験と表現が異なる場合があります。実際の試験については、公式に公開されている Road Code を参照してください。',
    'about.hNoAds': '広告なし',
    'about.pNoAds': '本サイトには広告枠、第三者の解析スクリプト、トラッキングピクセル、ソーシャルプラグインは一切ありません。読み込まれるリソースは本サイト自身のスタイルシート・スクリプト・画像のみです。',
    'about.hTips': '学習のヒント',
    'about.pTips': '1. カテゴリごとに学習し、各問の解説を読んでください。答えの丸暗記ではなく「なぜ」を理解することが大切です。|2. {c} つのカテゴリをすべて終えたら、「本番形式の模擬試験（35 問）」に挑戦しましょう。|3. 2 回続けて 90% 以上取れれば、内容はしっかり身についています。|4. 試験当日は早めに会場へ行き、問題文をよく読みましょう。実際の試験では表現が少し異なることがあります。',
    'about.hTech': '技術的な説明',
    'about.pTech': '本サイトは Cloudflare のエッジネットワーク上にホストされた純粋な静的サイトで、ユーザーデータを収集せず、サーバー側に何も保存しません。解答履歴は現在のブラウザページ内にのみ存在し、再読み込みで消去されます。',
    'notFound.title': 'ページが見つかりません',
    'notFound.body': 'ページが見つかりませんでした。リンクが古いか、アドレスが間違っている可能性があります。',
    'notFound.desc': 'ページが見つかりません。',
    'noscript.study': '問題演習には JavaScript が必要です。問題一覧から各問題の答えと解説を読むこともできます。',
    'noscript.exam': '模擬テストには JavaScript が必要です。問題を見て学習することもできます。',

    'meta.loading': '読み込み中…'
  },

  ko: {
    'site.name': 'NZ Road Code',
    'site.tagline': '뉴질랜드 도로교통법 이론 학습 및 모의고사',
    'site.brandSub': 'NEW ZEALAND ROAD CODE',

    'nav.home': '홈',
    'nav.study': '이론 학습',
    'nav.exam': '모의고사',
    'nav.about': '사이트 소개',
    'nav.backTo': '{label}(으)로 돌아가기',
    'nav.startExam': '모의고사 시작',
    'nav.mainNav': '주 내비게이션',
    'nav.footerNav': '바닥글 내비게이션',
    'nav.tabbar': '하단 내비게이션',
    'nav.breadcrumb': '이동 경로',
    'nav.questionNav': '문제 이동',
    'nav.langSwitcher': '언어 변경',

    'common.back': '뒤로',
    'common.prev': '이전',
    'common.next': '다음',
    'common.finishStudy': '학습 완료',
    'common.seeAnswer': '정답 보기',
    'common.question': '문',
    'common.correctAnswer': '정답',
    'common.explanation': '해설',
    'common.examTime': '제한 시간 {n}분',
    'common.passLine': '합격선 {n}문항',
    'common.passLinePct': '합격선 {pct}문항(90%)',
    'common.questionsCount': '총 {n}문항',
    'common.viewQuestion': '이 문제 보기',
    'common.backHome': '홈으로',
    'common.browse': '문제 보기',

    'study.qCount': '{n}문항 중 {i}번',
    'home.badge': '뉴질랜드 운전면허 필기시험 · 교통법규 문제집',
    'home.h1a': '뉴질랜드 도로 교통법규',
    'home.h1b': '이론 학습과 모의고사',
    'home.lede': '뉴질랜드 공식 도로 규칙을 정리한 8개 학습 카테고리, 총 {n}문항. 문항마다 즉시 채점되고 모든 문제에 해설이 있습니다. 네 가지 모의고사와 함께, 정답을 암기하는 대신 규칙을 제대로 이해할 수 있습니다.',
    'home.startExam': '실전 모의고사 시작',
    'home.startStudy': '카테고리별 이론 학습',
    'home.statQuestions': '개의 자체 제작 문항',
    'home.statCategories': '개 지식 카테고리',
    'home.statExamSizes': '가지 모의고사',
    'home.statNoAds': '광고 및 추적',
    'home.studyHead': '이론 학습',
    'home.studySub': '분야별로 먼저 이해하고 문제를 풀어보세요',
    'home.examHead': '모의고사',
    'home.examSub': '무작위 출제, 시간 제한, 제출 후 전 문항 리뷰',
    'home.examMeta': '제한시간 {t}분 · 합격선 {n}문항',
    'home.startThisExam': '시험 시작',
    'home.whatHead': '이 사이트가 다루는 내용',
    'home.whatText': '뉴질랜드 승용차 운전면허 필기시험의 모든 지식 영역을 포함합니다: 핵심 규칙, 운전 행동, 주차 표지, 긴급 상황, 도로 위치, 교차로, 이론 지식, 도로 표지. 모든 문제에 "왜 그런지"를 설명하는 해설이 있습니다.',
    'home.whatMore': '전체 {n}문항 보기 →',
    'home.howHead': '필기시험 준비 방법',
    'home.howText': '먼저 카테고리별로 학습하고 각 문항의 해설을 읽어보세요. 모두 끝낸 뒤 "실전 모의고사(35문항)"에 도전하세요. 두 번 연속 90% 이상이면 내용을 충분히 이해한 것입니다.',
    'home.howMore': '사이트 소개와 학습 팁 →',

    'cap.sv-crossroads': '표지 없는 십자 교차로 · 파란 차는 직진, 빨간 차는 오른쪽에서 접근',
    'cap.sv-roundabout': '회전교차로 · 파란 차는 진입 전, 빨간 차는 이미 회전 중',
    'cap.sv-t-junction': 'T자 교차로 · 파란 차는 측면 도로, 빨간 차는 직선 도로',
    'cap.sv-right-turn': '파란 차 우회전 · 빨간 차는 대향 직진',

    'exam.e10.label': '간단 모의고사',
    'exam.e10.desc': '뉴질랜드 도로 규칙이 처음인 분께. 문제 유형에 빠르게 익숙해질 수 있습니다.',
    'exam.e20.label': '중간 모의고사',
    'exam.e20.desc': '주요 지식 항목을 다루는 중간 강도 연습입니다.',
    'exam.e35.label': '실전 모의고사',
    'exam.e35.desc': '뉴질랜드 필기시험과 문항 수가 같습니다. 32문항을 맞히면 합격선입니다.',
    'exam.e50.label': '종합 모의고사',
    'exam.e50.desc': '가장 넓은 범위를 다루는 종합 테스트. 시험 전 마무리로 적합합니다.',
    'study.title': '이론 학습',
    'study.indexIntro': '뉴질랜드 승용차 운전면허 필기시험의 지식 항목은 8개 분야, 총 {n}문항입니다. 모든 카테고리를 문항별로 학습할 수 있으며, 답을 고르면 즉시 정오와 해설이 표시됩니다. 틀린 문항은 학습이 끝날 때 모아서 보여드립니다.',
    'study.catMeta': '총 {n}문항 →',
    'study.allQuestions': '전체 문제',
    'study.allQuestionsSub': '분야별 목록 — 누르면 정답과 해설을 볼 수 있습니다',
    'study.questionList': '문제 목록',
    'study.practice': '문제 풀이 시작',
    'study.practiceShort': '문제 풀이',
    'study.practiceIntro': '총 {n}문항 · 답을 고르면 즉시 채점하고 해설을 표시합니다 · 키보드 1~4로 선택할 수 있습니다',
    'study.enterPractice': '문제 풀이 시작',
    'study.directExam': '모의고사 보기',

    'study.practiceWithCount': '전체 {n}문항 학습하기',
    'study.prevQuestion': '← 이전 문항',
    'study.nextQuestion': '다음 문항 →',

    'exam.title': '모의고사',
    'exam.nav': '문항 이동',
    'exam.questionN': '{n}번 문항',
    'exam.indexIntro': '전체 {n}문항에서 카테고리 비율에 따라 무작위로 출제합니다. 푸는 동안에는 정오를 알려주지 않고, 제출 후에 점수와 문항별 리뷰를 한꺼번에 보여드립니다. 시간이 다 되면 자동으로 제출됩니다.',
    'exam.pageMeta': '제한시간 {t}분 · 합격선 {n}문항 · 제출 후 문항별 리뷰',
    'exam.scoringNote': '뉴질랜드 필기시험은 35문항이며 32문항을 맞혀야 합격입니다. 이 사이트의 모든 모의고사는 90%를 합격선으로 통일해 비교하기 쉽게 했습니다.',
    'exam.start': '시험 시작',
    'exam.countLabel': '{n}문항',
    'exam.answered': '답변 {n}',
    'exam.submit': '제출',
    'exam.remaining': '남은 시간 {t}',
    'exam.confirmSubmit': '답하지 않은 문제가 {n}개 있습니다. 제출할까요?',
    'exam.passed': '합격 ✓',
    'exam.failed': '불합격',
    'exam.timeUp': '시간이 종료되어 자동 제출되었습니다.',
    'exam.resultSub': '정답률 {pct}%. 합격선은 {need}문항 정답(90%)입니다.',
    'exam.retake': '다시 응시',
    'exam.review': '답안 리뷰',
    'exam.statCorrect': '정답',
    'exam.statWrong': '오답',
    'exam.statUsed': '소요 시간',
    'exam.statRate': '정답률',
    'exam.tagCorrect': '정답',
    'exam.tagWrong': '오답',
    'exam.tagUnanswered': '미응답',
    'exam.aboutScoring': '채점 기준:',

    'result.correct': '✓ 정답입니다',
    'result.wrong': '✕ 오답입니다',
    'result.isCorrectAnswer': '정답은',
    'result.studyDone': '{cat} 학습 완료',
    'result.studySub': '이번에 {done}문항에 답했습니다: 정답 {correct}, 오답 {wrong}',
    'result.answered': '응답',
    'result.correctN': '정답',
    'result.correctAnswerIs': '정답은',
    'result.wrongN': '오답',
    'result.rate': '정답률',
    'result.retryCat': '이 분야 다시 학습',
    'result.wrongReview': '오답 복습 ({n}문항)',

    'about.title': '사이트 소개',
    'about.intro': '{site}은(는) 중국어 사용자를 위한 뉴질랜드 운전면허 이론 학습 및 모의고사 사이트입니다. 사이트가 하는 일은 이론 학습과 모의고사 두 가지뿐입니다.',
    'about.hContent': '콘텐츠 안내',
    'about.pContent': '이 사이트의 {n}개 문항, 선택지, 해설은 모두 뉴질랜드 공식 도로 규칙(New Zealand Road Code / Land Transport (Road User) Rule 2004)을 바탕으로 새로 작성한 중국어 창작 콘텐츠이며, 이용자가 규칙 자체를 이해하도록 돕기 위한 것입니다. 도로 표지와 교차로 그림은 모두 직접 그린 SVG이며 제3자 이미지 자료는 사용하지 않았습니다.',
    'about.pDisclaimer': '이 사이트는 뉴질랜드 교통청(NZTA / Waka Kotahi)의 공식 제품이 아니며, 실제 시험과 문구가 완전히 같지는 않습니다. 실제 시험은 공식적으로 공개된 Road Code를 기준으로 하십시오.',
    'about.hNoAds': '광고 없음',
    'about.pNoAds': '이 사이트에는 광고 지면, 제3자 통계 스크립트, 추적 픽셀, 소셜 플러그인이 전혀 없습니다. 로드되는 리소스는 이 사이트 자체의 스타일시트, 스크립트, 그래픽뿐입니다.',
    'about.hTips': '학습 팁',
    'about.pTips': '1. 카테고리별로 학습하고 각 문항의 해설을 읽어보세요. 정답 암기보다 "왜"를 이해하는 것이 중요합니다.|2. {c}개 카테고리를 모두 마친 뒤 "실전 모의고사(35문항)"에 도전하세요.|3. 두 번 연속 90% 이상이면 내용이 충분히 익혀진 것입니다.|4. 시험 당일에는 일찍 도착해 문제를 꼼꼼히 읽으세요. 실제 시험은 표현이 조금 다를 수 있습니다.',
    'about.hTech': '기술 안내',
    'about.pTech': '이 사이트는 Cloudflare 엣지 네트워크에 호스팅된 순수 정적 사이트로, 사용자 데이터를 수집하지 않으며 서버에 아무것도 저장하지 않습니다. 답안 기록은 현재 브라우저 페이지에만 존재하고 새로고침하면 사라집니다.',
    'notFound.title': '페이지를 찾을 수 없습니다',
    'notFound.body': '페이지를 찾을 수 없습니다. 링크가 만료되었거나 주소가 잘못되었을 수 있습니다.',
    'notFound.desc': '페이지를 찾을 수 없습니다.',
    'noscript.study': '문제 풀이에는 JavaScript가 필요합니다. 문제 목록에서 각 문제의 정답과 해설을 볼 수도 있습니다.',
    'noscript.exam': '모의고사에는 JavaScript가 필요합니다. 문제를 보며 학습할 수도 있습니다.',

    'meta.loading': '불러오는 중…'
  }
};

/* ==========================================================================
   分类名 / 考纲名在各语言下的显示（内容层，与 UI 分开）
   ========================================================================== */

/** 分类显示名（key = 分类 id）。zh-Hans 用 data/*.json 里的 name。 */
export const CATEGORY_NAME = {
  core: { 'zh-Hant': '核心規則', en: 'Core rules', ja: '基本ルール', ko: '핵심 규칙' },
  behaviour: { 'zh-Hant': '駕駛行為', en: 'Driving behaviour', ja: '運転行動', ko: '운전 행동' },
  parking: { 'zh-Hant': '停車標識', en: 'Parking', ja: '駐停車', ko: '주차' },
  emergencies: { 'zh-Hant': '緊急事故', en: 'Emergencies', ja: '緊急時の対応', ko: '비상 상황' },
  'road-position': { 'zh-Hant': '道路位置', en: 'Road position', ja: '走行位置', ko: '도로 위치' },
  intersection: { 'zh-Hant': '交通路口', en: 'Intersections', ja: '交差点', ko: '교차로' },
  theory: { 'zh-Hant': '理論知識', en: 'Vehicle & licence', ja: '車両と免許', ko: '차량 및 면허' },
  sign: { 'zh-Hant': '道路標識', en: 'Signs & markings', ja: '標識と標示', ko: '표지 및 노면표시' }
};

/** 分类摘要（分类页上一句话说明）。 */
export const CATEGORY_SUMMARY = {
  core: {
    'zh-Hant': '最基本的駕駛與超車規則，以及如何在道路上以正確的方式參與交通。',
    en: 'The most basic driving and overtaking rules, and how to take part in traffic on the road correctly.',
    ja: '運転と追い越しの基本ルール、そして道路を正しく通行する方法。',
    ko: '가장 기본적인 운전 및 추월 규칙, 그리고 도로에서 올바르게 통행하는 방법.'
  },
  behaviour: {
    'zh-Hant': '學習駕駛知識的同時，也學會如何文明駕駛、如何正確處理意外情況。',
    en: 'Learn to drive considerately and handle unexpected situations correctly, alongside the driving knowledge itself.',
    ja: '運転知識とともに、思いやりのある運転と不意の状況への正しい対処を学びます。',
    ko: '운전 지식과 함께 배려 있는 운전, 돌발 상황을 올바르게 처리하는 방법을 배웁니다.'
  },
  parking: {
    'zh-Hant': '開車容易，停車也不難；只要你看得懂、記得住紐西蘭的停車標線和標誌牌。',
    en: 'Driving is easy, and so is parking — once you can read and remember New Zealand’s parking signs and markings.',
    ja: '運転も駐車も、ニュージーランドの駐車標示と標識を読み取れれば難しくありません。',
    ko: '뉴질랜드의 주차 표시와 표지만 읽을 수 있다면 운전도 주차도 어렵지 않습니다.'
  },
  emergencies: {
    'zh-Hant': '車壞了、車撞了、爆胎了、後面跟著消防車——學習如何冷靜應對緊急情況。',
    en: 'A breakdown, a crash, a blowout, a fire engine behind you — learn to stay calm in an emergency.',
    ja: '故障、事故、パンク、後ろから来る消防車——緊急時に冷静に対処する方法を学びます。',
    ko: '고장, 사고, 타이어 펑크, 뒤따라오는 소방차 — 비상 상황에서 침착하게 대처하는 법을 배웁니다.'
  },
  'road-position': {
    'zh-Hant': '如何在道路上保持正確的行車路線，道路上的標線和標識都是什麼意思。',
    en: 'How to keep the correct position on the road, and what every marking and sign on the road means.',
    ja: '道路上で正しい走行位置を保つ方法と、路面標示・標識の意味。',
    ko: '도로에서 올바른 주행 위치를 유지하는 방법과 노면표시·표지의 의미.'
  },
  intersection: {
    'zh-Hant': '學習號誌燈、讓行標誌的含義，以及在十字路口、丁字路口如何正確讓行。',
    en: 'Learn what traffic lights and give-way signs mean, and how to give way correctly at crossroads and T-intersections.',
    ja: '信号機と譲れ標識の意味、十字路や T 字路での正しい譲り方を学びます。',
    ko: '신호등과 양보 표지의 의미, 십자로와 T자형 교차로에서 올바르게 양보하는 방법을 배웁니다.'
  },
  theory: {
    'zh-Hant': '車輛安全檢測、載客上路、牽引拖車、安全帶的使用以及駕照的使用規定。',
    en: 'Vehicle safety checks, carrying passengers and loads, towing, seat belts, and the rules for using your licence.',
    ja: '車両の安全検査、人や荷物の運搬、けん引、シートベルト、免許の使用規定。',
    ko: '차량 안전검사, 승객과 화물 운송, 견인, 안전벨트, 면허 사용 규정.'
  },
  sign: {
    'zh-Hant': '紐西蘭交通標識：讓行、限速、環島、禁停、減速帶、施工及其它常用標誌。',
    en: 'New Zealand road signs: give way, speed limits, roundabouts, no stopping, speed humps, roadworks and more.',
    ja: 'ニュージーランドの標識：譲れ、速度制限、ラウンドアバウト、駐停車禁止、減速帯、工事など。',
    ko: '뉴질랜드 교통표지: 양보, 속도제한, 회전교차로, 주정차 금지, 과속방지턱, 공사 등.'
  }
};

/* ==========================================================================
   简体 → 繁体 转换（字符级）
   ========================================================================== */

/**
 * 单字映射表。只收录本站文案中实际出现的差异字，避免引入庞大的转换库。
 * 若以后新增文案出现未收录的字，会原样输出（简体），不会报错 —— 需要时补进这里。
 */
const S2T_CHARS = {
  '这': '這', '个': '個', '为': '為', '么': '麼', '学': '學', '习': '習', '题': '題', '试': '試',
  '车': '車', '辆': '輛', '驶': '駛', '员': '員', '规': '規', '则': '則', '标': '標', '识': '識',
  '记': '記', '号': '號', '灯': '燈', '让': '讓', '转': '轉', '弯': '彎', '环': '環', '岛': '島',
  '减': '減', '带': '帶', '紧': '緊', '论': '論', '驾': '駕', '检': '檢', '测': '測', '载': '載',
  '牵': '牽', '确': '確', '参': '參', '与': '與', '线': '線', '义': '義', '机': '機', '单': '單',
  '双': '雙', '侧': '側', '后': '後', '间': '間', '时': '時', '长': '長', '离': '離',
  '宽': '寬', '桥': '橋', '视': '視', '湿': '濕', '结': '結', '雾': '霧', '风': '風', '强': '強',
  '开': '開', '关': '關', '闭': '閉', '启': '啟', '动': '動', '发': '發', '达': '達', '马': '馬',
  '骑': '騎', '儿': '兒', '轮': '輪', '岁': '歲', '龄': '齡', '证': '證', '许': '許', '条': '條',
  '须': '須', '应': '應', '当': '當', '会': '會', '过': '過', '还': '還', '没': '沒', '无': '無',
  '现': '現', '实': '實', '际': '際', '经': '經', '历': '歷', '体': '體', '验': '驗', '样': '樣',
  '种': '種', '类': '類', '别': '別', '数': '數', '级': '級', '费': '費', '钱': '錢', '价': '價',
  '买': '買', '卖': '賣', '险': '險', '赔': '賠', '偿': '償', '责': '責', '罚': '罰', '销': '銷',
  '册': '冊', '换': '換', '旧': '舊', '变': '變', '认': '認', '观': '觀', '断': '斷', '决': '決',
  '选': '選', '择': '擇', '项': '項', '对': '對', '错': '錯', '误': '誤', '练': '練', '顾': '顧',
  '总': '總', '览': '覽', '页': '頁', '于': '於', '内': '內', '说': '說', '广': '廣', '踪': '蹤',
  '脚': '腳', '图': '圖', '绘': '繪', '据': '據', '网': '網', '络': '絡', '边': '邊',
  '缘': '緣', '设': '設', '备': '備', '态': '態', '状': '狀', '况': '況', '张': '張', '松': '鬆',
  '听': '聽', '觉': '覺', '顺': '順', '骤': '驟', '阶': '階', '续': '續', '连': '連', '继': '繼',
  '稳': '穩', '准': '準', '预': '預', '响': '響', '声': '聲', '报': '報', '压': '壓', '刹': '剎',
  '闸': '閘', '档': '檔', '挡': '擋', '杆': '桿', '镜': '鏡', '盘': '盤', '门': '門', '盖': '蓋',
  '顶': '頂', '层': '層', '叠': '疊', '铺': '鋪', '装': '裝', '运': '運', '输': '輸', '递': '遞',
  '邮': '郵', '税': '稅', '额': '額', '满': '滿', '余': '餘', '计': '計', '谋': '謀',
  '凿': '鑿', '异': '異', '够': '夠', '几': '幾', '们': '們', '谁': '誰', '处': '處', '点': '點',
  '来': '來', '进': '進', '绕': '繞', '并': '並', '队': '隊', '码': '碼', '编': '編', '链': '鏈',
  '传': '傳', '储': '儲', '读': '讀', '写': '寫', '贴': '貼', '删': '刪', '辑': '輯',
  '询': '詢', '显': '顯', '隐': '隱', '虚': '虛', '拟': '擬', '坏': '壞', '优': '優', '终': '終',
  '头': '頭', '气': '氣', '脸': '臉', '齿': '齒', '咙': '嚨', '兰': '蘭', '纽': '紐', '亚': '亞',
  '湾': '灣', '闯': '闖', '违': '違', '货': '貨', '纲': '綱', '汇': '匯', '营': '營', '录': '錄',
  '钥': '鑰', '锁': '鎖', '辐': '輻', '纹': '紋', '缩': '縮', '缓': '緩', '撞': '撞',
  '擦': '擦', '刮': '颳', '滚': '滾', '滑': '滑', '冻': '凍', '尘': '塵', '污': '汙', '脏': '髒',
  '净': '淨', '洁': '潔', '签': '簽', '凭': '憑', '夹': '夾', '栏': '欄', '铁': '鐵', '钢': '鋼',
  '铜': '銅', '铝': '鋁', '颜': '顏', '妆': '妝', '饰': '飾', '鸡': '雞', '鸭': '鴨', '猫': '貓',
  '猪': '豬', '鹅': '鵝', '鸦': '鴉', '鸥': '鷗', '鹰': '鷹',

  /* ---- 2026-10-06 补齐：审计出的单字缺口（逐条核对语境后收录） ----
     只收录**站内实际出现、且在该义项下唯一**的映射；有歧义的（干/面/台/只/象/
     松/划/卷/复/冲）一律不加单字，改由 S2T_PHRASES 按词处理。              */
  '区': '區', '鸣': '鳴', '语': '語', '两': '兩', '远': '遠', '临': '臨', '场': '場', '黄': '黃',
  '尽': '盡', '构': '構', '电': '電', '导': '導', '伤': '傷', '专': '專', '库': '庫', '见': '見',
  '产': '產', '轻': '輕', '钟': '鐘', '严': '嚴', '务': '務', '议': '議', '极': '極', '简': '簡',
  '该': '該', '独': '獨', '权': '權', '护': '護', '损': '損', '监': '監', '积': '積', '药': '藥',
  '挥': '揮', '围': '圍', '悬': '懸', '养': '養', '拥': '擁', '抢': '搶', '劳': '勞', '乡': '鄉',
  '绝': '絕', '阳': '陽', '国': '國', '遗': '遺', '组': '組', '触': '觸', '赶': '趕', '问': '問',
  '担': '擔', '资': '資', '领': '領', '乐': '樂', '补': '補', '热': '熱', '业': '業', '将': '將',
  '惊': '驚', '仪': '儀', '细': '細', '范': '範', '阴': '陰', '频': '頻', '寻': '尋', '评': '評',
  '弹': '彈', '击': '擊', '医': '醫', '购': '購', '归': '歸', '维': '維', '礼': '禮', '扰': '擾',
  '却': '卻', '刚': '剛', '节': '節', '杂': '雜', '拦': '攔', '质': '質', '协': '協', '狭': '狹',
  '块': '塊', '驱': '驅', '温': '溫', '书': '書', '胶': '膠', '滤': '濾', '扫': '掃', '执': '執',
  '筑': '築', '园': '園', '术': '術', '译': '譯', '齐': '齊', '怀': '懷', '乱': '亂', '绪': '緒',
  '农': '農', '获': '獲', '软': '軟', '称': '稱', '竖': '豎', '烧': '燒', '灭': '滅', '针': '針',
  '锥': '錐', '涂': '塗', '携': '攜', '讲': '講', '辞': '辭', '卫': '衛', '联': '聯', '浓': '濃',
  '东': '東', '师': '師', '杀': '殺', '脑': '腦', '烦': '煩', '迟': '遲', '扩': '擴', '宁': '寧',
  '废': '廢', '虑': '慮', '树': '樹', '诊': '診', '沟': '溝', '蜡': '蠟', '泽': '澤', '剧': '劇',
  '绳': '繩', '恶': '惡', '胀': '脹', '庞': '龐', '释': '釋', '万': '萬',
  // 「着」：站内 26 处全为助词/接触义（隔着/盯着/意味着/写着…），繁体一律作「著」。
  '着': '著',
  // 「里」：方位义作「裡」（「公里/里程」已由 S2T_KEEP 保护，不受此影响）。
  '里': '裡',

  /* ---- 2026-10-06 第二轮补齐（全量筛查，逐条核对语境后收录） ---- */
  '给': '給', '横': '橫', '红': '紅', '随': '隨', '蓝': '藍', '属': '屬', '键': '鍵', '约': '約',
  '话': '話', '词': '詞', '静': '靜', '碍': '礙', '闪': '閃', '请': '請', '绿': '綠', '画': '畫',
  '调': '調', '暂': '暫', '谨': '謹', '仅': '僅', '抛': '拋', '缴': '繳', '残': '殘', '负': '負',
  '铃': '鈴', '势': '勢', '帮': '幫', '贯': '貫', '纳': '納', '础': '礎', '难': '難', '吗': '嗎',
  '纯': '純', '胁': '脅', '灵': '靈', '轰': '轟', '锚': '錨', '绩': '績', '缀': '綴', '宠': '寵',
  '挤': '擠', '渐': '漸', '圆': '圓', '颈': '頸', '溅': '濺', '阔': '闊', '尝': '嘗', '厂': '廠',
  '纸': '紙', '综': '綜', '赖': '賴', '垫': '墊', '钮': '鈕', '烁': '爍', '辙': '轍', '衅': '釁',
  '窜': '竄', '阅': '閱', '泞': '濘', '办': '辦', '晕': '暈', '赌': '賭', '讨': '討', '舱': '艙',
  '浇': '澆', '贸': '貿', '彻': '徹', '瘫': '癱', '痪': '瘓', '腾': '騰', '虽': '雖', '盗': '盜',
  '窃': '竊', '厢': '廂', '诱': '誘', '赁': '賃', '润': '潤', '栈': '棧', '仓': '倉',
  '采': '採', '缝': '縫', '统': '統', '创': '創'
};

/** 双字及以上词组优先替换（避免单字误伤，例如「干」在「干燥」与「干净」中不同）。 */
const S2T_PHRASES = {
  // ⚠ 地名/专名这类**词汇差异**必须走词组表：单字表只会把「新西兰」逐字转成
  // 「新西蘭」—— 那不是台湾正体（台湾用「紐西蘭」，马来西亚/新加坡才用「纽西兰」）。
  // 词组表在单字表**之前**执行，所以这里能拦住。
  '新西兰': '紐西蘭',
  '信息': '資訊', '软件': '軟體', '硬件': '硬體', '网络': '網路',
  '默认': '預設', '设置': '設定', '打印': '列印', '屏幕': '螢幕',
  '视频': '影片', '音频': '音訊', '质量': '品質', '数据': '資料',
  '用户': '使用者', '文件': '檔案', '目录': '目錄', '光标': '游標',
  '返回': '返回', '加载': '載入', '刷新': '重新整理', '链接': '連結',
  '点击': '點擊', '触摸': '觸控', '支持': '支援', '反馈': '回饋',
  '实现': '實現', '运行': '執行', '创建': '建立', '删除': '刪除',
  '统计': '統計', '记录': '紀錄', '项目': '專案', '视图': '檢視',
  '序列': '序列', '进程': '行程', '线程': '執行緒', '内存': '記憶體',
  '缓存': '快取', '队列': '佇列', '数组': '陣列', '对象': '物件',
  '函数': '函式', '变量': '變數', '类型': '型別', '接口': '介面',
  '路径': '路徑', '地址': '位址', '协议': '協定', '端口': '連接埠',
  '服务': '服務', '应用': '應用', '程序': '程式', '网站': '網站',
  '页面': '頁面', '首页': '首頁', '关于': '關於', '内容': '內容',
  '说明': '說明', '广告': '廣告', '追踪': '追蹤', '图像': '圖像',
  '图片': '圖片', '标志': '標誌', '标线': '標線', '绘制': '繪製',
  '驾驶': '駕駛', '规则': '規則', '考试': '考試', '学习': '學習',
  '练习': '練習', '题目': '題目', '试题': '試題', '答案': '答案',
  '解析': '解析', '正确': '正確', '错误': '錯誤', '知识': '知識',
  '分类': '分類', '理论': '理論', '停车': '停車', '标识': '標識',
  '紧急': '緊急', '事故': '事故', '路口': '路口', '交通': '交通',
  '位置': '位置', '道路': '道路', '行为': '行為', '核心': '核心',
  '转弯': '轉彎', '让行': '讓行', '环岛': '環島', '限速': '限速',
  '减速': '減速', '超车': '超車', '安全': '安全', '行驶': '行駛',
  '车辆': '車輛', '驾照': '駕照', '许可': '許可', '规定': '規定',
  '要求': '要求', '必须': '必須', '应该': '應該', '可以': '可以',

  /* ---- 歧义字：必须走词组表，单字表给不出唯一答案（2026-10-06 逐条核对） ----
     这些字在繁体里对应**多个**不同汉字，逐字转必错。词组表在单字表之前执行，
     所以能拦住。新增含这些字的文案时，记得在这里补词。                     */

  // 「里」：方位义作「裡」，但「公里/里程」的里是长度单位，繁体仍作「里」。
  // 那类词放进了 S2T_KEEP（先占位保护），单字表这里就可以放心收 `里→裡`。
  // 「复」：恢复/反复/修复/复制 → 復；只有「复杂」「复制(副本?)」里的複。
  '恢复': '恢復', '反复': '反覆', '修复': '修復', '复制': '複製', '复用': '複用', '复杂': '複雜',
  // 「制」：限制/控制/制动/强制/制度 → 制；只有「制造/制作」→ 製。
  '制造': '製造', '制作': '製作',
  // 「冲」：冲突/冲刺/冲过去/缓冲 → 衝；「冲刷/冲水」→ 沖。
  '冲突': '衝突', '冲刺': '衝刺', '冲过': '衝過', '缓冲': '緩衝', '冲上': '衝上',
  '冲刷': '沖刷', '冲水': '沖水',
  // 「卷」：交卷 → 交卷（不转）；卷入/卷进 → 捲入/捲進。
  '卷入': '捲入', '卷进': '捲進',
  // 「划」：规划/划定/划分 → 劃；划痕 → 劃痕（台湾亦作刮痕，此处从「劃」）。
  '规划': '規劃', '划定': '劃定', '划分': '劃分', '划痕': '劃痕',
  // 「干」：干扰 → 干；干燥/干净/风干/吹干（乾湿义）→ 乾；主干道/题干（骨干义）→ 幹。
  '干扰': '干擾', '干燥': '乾燥', '干净': '乾淨', '风干': '風乾', '吹干': '吹乾',
  '主干道': '主幹道', '题干': '題幹',
  // 「台」：平台/仪表台 → 臺；台湾 → 臺灣（「台」在台湾正体里通作「臺」）。
  '平台': '平臺', '仪表台': '儀表臺', '台湾': '臺灣', '台风': '颱風',
  // 「现象」：现象 → 現象；对象（程序义）→ 物件（已在上表）。
  '现象': '現象',
  // 「并」：并列义 → 並；但「合并」（合而为一）台湾作「合併」。
  '合并': '合併',
  // 「采」：采用 → 採用；采取 → 採取。
  '采用': '採用', '采取': '採取',
  // 「着」：站内全部是「著」义（写着/亮着/意味着/跟着）。
  '意味着': '意味著'
};

/**
 * 简体 → 繁体。先替换词组（更准确），再逐字替换（兜底）。
 *
 * 关于 S2T_KEEP：有一类词「在繁体里与原样相同」，但**含会被单字表误伤的简化字**。
 * 典型是「公里」——「里」在方位义下繁体作「裡」，但作为长度单位仍作「里」，
 * 于是单字表不能再收 `里→裡`（否则 32 处「公里」全错）而又必须让「这里/里面」
 * 变「裡」。解法：先把这类词换成私用区占位符，逐字替换跑完后再还原。
 * 占位符用 U+E000 起，正常文案不会撞上。
 */
const S2T_KEEP = ['公里', '里程'];
const KEEP_BASE = 0xE000;

export function toHant(text) {
  if (!text) return text;
  let out = String(text);
  // 1) 保护「繁体里与原样相同」的词
  const stash = [];
  S2T_KEEP.forEach((w, i) => {
    if (out.indexOf(w) !== -1) {
      const mark = String.fromCharCode(KEEP_BASE + i);
      out = out.split(w).join(mark);
      stash[i] = w;
    }
  });
  // 2) 词组替换（更准确）
  for (const [s, t] of Object.entries(S2T_PHRASES)) {
    if (out.indexOf(s) !== -1) out = out.split(s).join(t);
  }
  // 3) 逐字替换（兜底）
  let res = '';
  for (const ch of out) res += (S2T_CHARS[ch] || ch);
  // 4) 还原被保护的词
  res = res.replace(/[\uE000-\uE00F]/g, (m) => stash[m.charCodeAt(0) - KEEP_BASE] || m);
  return res;
}

/* ==========================================================================
   题面「如图所示的…」前缀的多语言处理
   --------------------------------------------------------------------------
   中文题干常以「如图所示的红色八角形标志表示什么？」开头，英文/日/韩
   需要换成对应的疑问句式。这里做前缀替换，避免为每种语言重写整句。
   ========================================================================== */

const STEM_PREFIX = {
  en: {
    // 「如图所示的红色八角形标志表示什么？」→「What does the red octagonal sign shown mean?」
    lead: 'What does this sign mean? — ',
    leadShape: (d) => `What does this ${d} sign mean?`
  }
};

/** 多语言下的图形说明前缀（题干以「如图所示」开头时使用）。 */
export const SIGNSHOW = {
  en: 'Sign shown',
  ja: '図の標識',
  ko: '그림의 표지'
};

/* ==========================================================================
   内容组装：把「简体原文 + EN / JA / KO」拼成每种语言的题目内容
   --------------------------------------------------------------------------
   build.mjs 与 tests 都从这里取，保证「一条数据源」。
   返回 { [locale]: { [questionId]: { q, o, e } } }。
   zh-Hans 直接用源数据；zh-Hant 由 zh-Hans 逐字转换；其余读各自的语言模块。
   ========================================================================== */

/**
 * @param {Array} categories  build.mjs 读好的分类数组（含 questions）
 * @param {object} en  EN 词典（src/i18n-content.mjs）
 * @param {object} ja  JA 词典（src/i18n-ja.mjs）
 * @param {object} ko  KO 词典（src/i18n-ko.mjs）
 * @returns {object} locale -> { id -> { q, o, e } }
 */
export function buildContent(categories, { en, ja, ko }) {
  const src = {};   // zh-Hans
  const hant = {};  // zh-Hant

  for (const cat of categories) {
    for (const q of cat.questions) {
      const o = q.options.slice();
      src[q.id] = { q: q.q, o, e: q.explanation };
      hant[q.id] = {
        q: toHant(q.q),
        o: o.map(toHant),
        e: toHant(q.explanation)
      };
    }
  }

  const content = {
    'zh-Hans': src,
    'zh-Hant': hant,
    en: pick(en, src),
    ja: pick(ja, src),
    ko: pick(ko, src)
  };

  assertComplete(content, src);
  return content;
}

/** 从语言词典里按题目 id 取值，只保留 { q, o, e }（词典可能还有别的字段）。 */
function pick(dict, src) {
  const out = {};
  for (const id of Object.keys(src)) {
    const v = dict[id];
    out[id] = { q: v.q, o: v.o.slice(), e: v.e };
  }
  return out;
}

/**
 * 构建门禁：每种语言的题数必须与源一致，且每题的选项数必须与源逐一相等。
 *
 * ⚠️ 选项数必须相等 —— answer 是数字索引，直接套用到各语言选项上。
 *    顺序或数量对不上，答案就指错了，而这种错误页面照常渲染、肉眼极难发现。
 */
export function assertComplete(content, src) {
  const ids = Object.keys(src);
  for (const loc of LOCALES) {
    const c = content[loc];
    if (!c) throw new Error(`i18n：缺少语言 ${loc}`);
    const got = Object.keys(c);
    if (got.length !== ids.length) {
      const miss = ids.filter(id => !c[id]);
      throw new Error(`i18n：${loc} 题数 ${got.length} ≠ 源 ${ids.length}（缺 ${miss.slice(0, 5).join(', ')}）`);
    }
    for (const id of ids) {
      const v = c[id];
      if (!v || !v.q || !v.e || !Array.isArray(v.o)) {
        throw new Error(`i18n：${loc} 的 ${id} 字段不完整`);
      }
      if (v.o.length !== src[id].o.length) {
        throw new Error(`i18n：${loc} 的 ${id} 选项数 ${v.o.length} ≠ 源 ${src[id].o.length}`);
      }
      if (v.o.some(x => x == null || x === '')) {
        throw new Error(`i18n：${loc} 的 ${id} 有空选项`);
      }
    }
  }
  return true;
}

export default { LOCALES, LOCALE_NATIVE, LOCALE_SHORT, UI, CATEGORY_NAME, CATEGORY_SUMMARY, toHant, buildContent };
