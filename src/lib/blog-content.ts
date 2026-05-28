// src/lib/blog-content.ts — Static blog content system
// Add new articles here. No DB required — pure static content.

export interface BlogArticle {
  slug: string;
  category: string;
  readTime: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  featured?: boolean;
  accentIcon: string;
  gradientFrom: string;
  /** Production image path under /public — used in card thumbnails and article hero */
  imageSrc: string;
  /** Focal point hint for object-position — e.g. "center", "top", "50% 30%" */
  imagePosition?: string;
  body: BlogSection[];
  relatedSlugs?: string[];
}

export interface BlogSection {
  type: "heading" | "paragraph" | "quote" | "insight" | "list";
  content: string;
  items?: string[]; // for list type
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "lovers-tarot",
    category: "塔羅基礎",
    readTime: "8 分鐘閱讀",
    title: "理解塔羅「戀人」牌喺愛情占卜中嘅意義",
    subtitle: "超越浪漫象徵，探索選擇、靈魂契合與內在和諧的深層詮釋",
    excerpt: "「戀人」牌經常被誤解為簡單嘅浪漫象徵，但其根源實際上深入到選擇、契合度同內在和諧嘅架構中。探索點樣喺唔同語境下解讀呢張強大嘅大阿爾克那。",
    date: "2024年5月18日",
    featured: true,
    accentIcon: "favorite",
    gradientFrom: "#1a0a2e",
    imageSrc: "/images/blog/tarot-card-destiny.webp",
    imagePosition: "center",
    body: [
      {
        type: "paragraph",
        content: "當「戀人」牌（The Lovers）出現喺你嘅塔羅牌陣中，好多人嘅第一反應係「太好了，有感情運！」但事實上，呢張第六號大阿爾克那牌嘅訊息遠比浪漫愛情複雜而深刻。",
      },
      {
        type: "heading",
        content: "戀人牌的真實象徵意義",
      },
      {
        type: "paragraph",
        content: "喺萊德偉特牌組中，戀人牌描繪的是亞當同夏娃站喺伊甸園中，上方係天使拉斐爾展開雙翼俯瞰。這幅圖像最核心的訊息不是浪漫，而是：在天使的見證下，你需要做出一個重要的選擇。",
      },
      {
        type: "quote",
        content: "戀人牌不是在問你「有沒有人愛你」，而是在問你「你選擇了甚麼？你的選擇是否與你的靈魂真正對齊？」",
      },
      {
        type: "heading",
        content: "三種解讀維度",
      },
      {
        type: "insight",
        content: "感情關係：確實可以代表一段新的浪漫連結，或現有關係的深化。但更重要的是：這段關係是否真正滋養你的靈魂？",
      },
      {
        type: "insight",
        content: "個人選擇：在感情以外，戀人牌常常出現在你面臨重大人生抉擇的時刻——工作選擇、生活方式的轉變，或是兩條截然不同的人生道路。",
      },
      {
        type: "insight",
        content: "內在整合：從榮格心理學的角度看，戀人牌代表陰陽兩極性的整合——你需要將理性與直覺、男性能量與女性能量達到平衡。",
      },
      {
        type: "heading",
        content: "逆位戀人牌",
      },
      {
        type: "paragraph",
        content: "當戀人牌逆位出現時，它可能在提示：關係中的溝通障礙、對自身需求的忽視、或是在兩個選擇之間優柔寡斷。這並非壞兆頭，而是宇宙在提醒你審視某些尚未面對的真相。",
      },
      {
        type: "list",
        content: "如何回應逆位戀人牌的訊息：",
        items: [
          "誠實地審視你當前關係或決策中的不滿之處",
          "問問自己：你是出於恐懼還是出於愛在做決定？",
          "花時間獨處，聆聽你的內心聲音而非外界期望",
          "重新評估你的個人價值觀與你的行動是否一致",
        ],
      },
      {
        type: "paragraph",
        content: "記住，無論戀人牌以正位還是逆位出現，它帶給你的最核心訊息永遠是：真正的愛——無論是對他人還是對自己——始終源於自由的選擇與靈魂的真實連結。",
      },
    ],
    relatedSlugs: ["reversed-cards", "shadow-work"],
  },
  {
    slug: "reversed-cards",
    category: "情緒成長",
    readTime: "5 分鐘閱讀",
    title: "逆位牌隱藏嘅力量",
    subtitle: "點解抽到逆位牌唔係壞兆頭，而係需要內在反思同能量轉換嘅提醒",
    excerpt: "點解抽到逆位牌唔係壞兆頭，而係需要內在反思同能量轉換嘅提醒。",
    date: "2024年5月14日",
    accentIcon: "rotate_right",
    gradientFrom: "#0a1520",
    imageSrc: "/images/blog/cosmic-tarot-hand.webp",
    imagePosition: "center",
    body: [
      {
        type: "paragraph",
        content: "「我抽到了逆位牌，是不是代表有壞事要發生？」這是許多初學者最常問的問題之一。答案是：不是的，完全不是這樣。",
      },
      {
        type: "heading",
        content: "逆位牌的正確理解方式",
      },
      {
        type: "paragraph",
        content: "逆位牌並不代表「壞牌」或「負面能量」。它更像是一面轉了方向的鏡子，折射出你內在世界中某些需要注意的部分——往往是那些被壓抑、被忽視、或尚未被整合的能量。",
      },
      {
        type: "quote",
        content: "逆位是塔羅牌在輕聲說：「嘿，這個部分需要你更多的關注。不是要懲罰你，而是在引導你。」",
      },
      {
        type: "heading",
        content: "逆位牌的三種能量模式",
      },
      {
        type: "insight",
        content: "能量受阻：正位牌所代表的能量在你的生命中暫時被阻塞或延遲。這不是永久狀態，而是邀請你找出阻礙的根源。",
      },
      {
        type: "insight",
        content: "能量內化：能量從外向行動轉向內在工作。例如，逆位的「力量」牌可能代表你正在進行深度的內在情緒整合，而非外在的行動。",
      },
      {
        type: "insight",
        content: "能量過度：偶爾，逆位代表某種能量被過度表達到了失衡的程度，需要重新調校。",
      },
      {
        type: "paragraph",
        content: "下次當逆位牌出現在你的牌陣中，試著帶著好奇而非恐懼去看待它。問問自己：「這張牌正位所代表的能量，我在生活的哪個角落正在以受阻或內化的方式體驗？」你可能會發現，逆位牌帶來的洞見往往比正位更深刻、更個人化。",
      },
    ],
    relatedSlugs: ["lovers-tarot", "shadow-work"],
  },
  {
    slug: "mercury-retrograde",
    category: "占星術",
    readTime: "6 分鐘閱讀",
    title: "水逆期間：靈魂避風港指南",
    subtitle: "利用宇宙生存策略，以優雅同戰術性嘅沉默嚟應對溝通混亂",
    excerpt: "利用我哋嘅宇宙生存策略，以優雅同戰術性嘅沉默嚟應對溝通混亂。",
    date: "2024年5月10日",
    accentIcon: "public",
    gradientFrom: "#0f0a20",
    imageSrc: "/images/blog/cosmic-third-eye.webp",
    imagePosition: "center",
    body: [
      {
        type: "paragraph",
        content: "每年三至四次，水星逆行的消息會在靈性圈子裡引發一陣驚呼。但水逆真的如此可怕嗎？讓我們用更細緻的視角來理解這個宇宙週期。",
      },
      {
        type: "heading",
        content: "水星逆行是甚麼？",
      },
      {
        type: "paragraph",
        content: "水星逆行（Mercury Retrograde）是從地球視角看去，水星似乎在向後移動的天文現象（實際上是地球和水星的相對速度差造成的視覺效果）。在占星學中，水星掌管溝通、旅行、合約、科技和思維過程，所以當它「逆行」時，這些領域往往會出現一些複雜情況。",
      },
      {
        type: "quote",
        content: "水逆不是來懲罰你的，它是宇宙邀請你慢下來，重新審視、修正和完成未竟之事的時期。",
      },
      {
        type: "heading",
        content: "水逆期間的「Re-」原則",
      },
      {
        type: "list",
        content: "水逆是一個特別適合以「Re-」開頭的行動的時期：",
        items: [
          "Reflect（反思）：重新審視你的計劃和關係",
          "Revise（修改）：完善現有的項目，而非開始新的",
          "Reconnect（重連）：與舊友、舊想法、舊記憶和解",
          "Rest（休息）：放慢腳步，讓身心靈充電",
          "Release（釋放）：放下不再服務你的人、事、物",
        ],
      },
      {
        type: "heading",
        content: "塔羅與水逆的結合",
      },
      {
        type: "paragraph",
        content: "在水逆期間做塔羅占卜，特別適合進行以「重新審視」為主題的問題。試試這些問題：「我在哪個溝通模式中需要更多清晰？」「有甚麼尚未完成的事情需要我回去處理？」「這段關係中，有甚麼我還沒有真正說出口的話？」",
      },
      {
        type: "paragraph",
        content: "記住，水逆期間最大的靈性課題是：學習在不確定性中保持內心的平靜。不是每件事都需要立即解決，有些事情只是需要更多時間和沉澱。",
      },
    ],
    relatedSlugs: ["shadow-work", "crystals-daily"],
  },
  {
    slug: "crystals-daily",
    category: "儀式與手作",
    readTime: "4 分鐘閱讀",
    title: "每日顯化嘅水晶選用",
    subtitle: "點樣將特定寶石同你嘅晨間塔羅牌結合，增強意圖並保護氣場",
    excerpt: "點樣將特定寶石同你嘅晨間塔羅牌結合，以增強你嘅意圖並保護你嘅氣場。",
    date: "2024年5月5日",
    accentIcon: "diamond",
    gradientFrom: "#0f1a14",
    imageSrc: "/images/blog/mystic-crystal-core.webp",
    imagePosition: "center",
    body: [
      {
        type: "paragraph",
        content: "將水晶的能量與每日塔羅練習結合，是許多靈性修行者發現的一種特別有效的方式，能夠加深與牌面訊息的連結，並將意圖更有效地錨定在物質層面。",
      },
      {
        type: "heading",
        content: "基本配對原則",
      },
      {
        type: "paragraph",
        content: "水晶與塔羅的配對可以依據多種方式進行：元素屬性（火、水、土、風）、顏色對應、或是直覺感應。最重要的是信任你自己的感覺——如果某顆水晶在你抽牌時不斷吸引你的目光，那就是它在呼喚你。",
      },
      {
        type: "heading",
        content: "常見塔羅主題的水晶推薦",
      },
      {
        type: "insight",
        content: "愛情占卜：玫瑰石英（Rose Quartz）是首選，它象徵無條件的愛與自我接納。在感情相關的牌陣中，將玫瑰石英放置在代表「當下」的牌上方。",
      },
      {
        type: "insight",
        content: "事業決策：虎眼石（Tiger's Eye）帶來清晰的目標感和行動力，特別適合與帝王牌、戰車牌搭配使用。",
      },
      {
        type: "insight",
        content: "靈性成長：紫水晶（Amethyst）加強直覺和靈性連結，是進行靈魂探索類問題時的理想夥伴。",
      },
      {
        type: "insight",
        content: "保護與界限：黑曜石（Obsidian）或黑碧璽（Black Tourmaline）在占卜時提供能量保護，特別適合在情緒敏感時期使用。",
      },
      {
        type: "heading",
        content: "晨間儀式建議",
      },
      {
        type: "list",
        content: "簡單但有效的每日晨間塔羅水晶儀式：",
        items: [
          "淨化你的水晶（月光浴、煙燻或聲音淨化）",
          "靜心三分鐘，設定今日的意圖",
          "抽出一張每日指引牌",
          "根據牌的主題選擇對應的水晶",
          "將水晶放在你的工作空間或貼身攜帶",
          "睡前記錄這一天與牌面訊息的共鳴之處",
        ],
      },
    ],
    relatedSlugs: ["shadow-work", "mercury-retrograde"],
  },
  {
    slug: "shadow-work",
    category: "情緒成長",
    readTime: "7 分鐘閱讀",
    title: "陰影工作：月亮嘅映射",
    subtitle: "解開隱藏喺黑暗中嘅自己，心理同靈魂整合嘅實用指南",
    excerpt: "解開隱藏喺黑暗中嘅自己。心理同靈魂整合嘅實用指南。",
    date: "2024年4月28日",
    accentIcon: "dark_mode",
    gradientFrom: "#0a0f20",
    imageSrc: "/images/blog/shadow-work-grimoire.webp",
    imagePosition: "center",
    body: [
      {
        type: "paragraph",
        content: "「陰影工作」（Shadow Work）這個詞源自心理學家卡爾·榮格的理論。他認為，每個人都有一個「陰影自我」——那些我們壓抑、否認或尚未整合的性格面向。塔羅，尤其是月亮牌，是探索這片內在黑暗土地的絕佳工具。",
      },
      {
        type: "heading",
        content: "甚麼是你的「陰影」？",
      },
      {
        type: "paragraph",
        content: "你的陰影包含那些你認為「不應該有」的情緒和特質——憤怒、嫉妒、自私、恐懼、脆弱……它們並不壞，它們只是被你的有意識心智判斷為「不可接受」而被推入黑暗中。問題是，被壓抑的東西並不會消失，它們會以間接的方式影響你的行為、關係和心理健康。",
      },
      {
        type: "quote",
        content: "「直到你讓無意識變成有意識，它就會主導你的生命，而你會稱之為命運。」——卡爾·榮格",
      },
      {
        type: "heading",
        content: "月亮牌與陰影工作",
      },
      {
        type: "paragraph",
        content: "在大阿爾克那中，月亮牌（The Moon）是陰影工作最直接的象徵。它描繪在月光下的大地，一隻狗和一隻狼同時嚎叫——它們代表我們的馴化面和野性面。遠處的路通向未知，水中的螃蟹從深處爬出。整張牌都在說：不要逃避你內心的黑暗，而是學習在其中行走。",
      },
      {
        type: "heading",
        content: "陰影工作塔羅提示",
      },
      {
        type: "list",
        content: "以下幾個問題可以作為你陰影工作占卜的起點：",
        items: [
          "在他人身上，我最不能接受的特質是甚麼？（往往是自己也有但不承認的）",
          "有甚麼情緒是我總是壓抑或快速略過的？",
          "在我的童年，有哪些部分的自己被教導是「不可以」的？",
          "當我感到最強烈的防禦反應時，那個觸發點在告訴我甚麼關於我自己的事？",
        ],
      },
      {
        type: "heading",
        content: "重要提醒",
      },
      {
        type: "paragraph",
        content: "陰影工作是深度的心理靈性練習，建議以循序漸進的方式進行，而非一次性深潛。如果在過程中浮現出強烈的情緒或創傷記憶，請尋求專業心理諮詢師的支持。面對陰影不是要消滅它，而是要與它和解，讓它成為你力量的一部分。",
      },
    ],
    relatedSlugs: ["reversed-cards", "lovers-tarot"],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slugs: string[]): BlogArticle[] {
  return slugs
    .map((s) => getBlogArticle(s))
    .filter((a): a is BlogArticle => a !== undefined);
}
