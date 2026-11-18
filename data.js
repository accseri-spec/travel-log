/* 초기 데이터 — travel-log/index.md, trips/2026-11-australia.md, competitions/README.md, checklist.md 에서 옮김
   공개 페이지이므로 여권번호·개인 전화번호·상세 주소·예약 코드는 넣지 않았습니다. */

/* ── 현지 날씨: 코코가 갱신하는 자리 ───────────────────────────────
   여행 기간(2026-11-19~28)의 최신 예보를 코코가 이 파일에서 직접 고칩니다.
   사이트에는 날씨를 직접 입력하는 칸이 없고, 여기 적힌 값만 표시됩니다.
     · days[i].weather   : "비·이슬비, 25~31℃, 강수 86%, UV 6" 처럼 한 줄 요약
     · days[i].weatherAt : 그 예보를 조회한 날 "2026-11-16" (없으면 표시 생략)
     · competitions[i].weather : { text: "이슬비 16~19℃, 강수 58%", at: "2026-11-16" }
   예보 범위 밖이면 "아직 예보 범위 밖 — 출발 전 확인" 처럼 그대로 적습니다.
   data.js 는 공개 파일이므로 날씨 외의 개인정보는 넣지 않습니다. */
window.TRIP = {
  name: "김상진",
  title: "김상진님의 평생 여행 로그",
  updated: "2026-11-18",

  countries: [
    { code: "KOR", name: "대한민국", state: "거주지 · 출발지", cls: "home", cities: "부산 (집)" },
    { code: "AUS", name: "호주", state: "다녀옴 + 예정(11/19~28)", cls: "visited", cities: "퍼스·쿠지, 시드니, 선샤인코스트, 브리즈번" },
    { code: "SGP", name: "싱가포르", state: "경유 예정(11/19)", cls: "transit", cities: "창이공항 T1 환승 (입국 없음)" },
    { code: "HUN", name: "헝가리", state: "예정(2027-06)", cls: "future", cities: "부다페스트 (대회 출전 목표)" }
  ],

  cities: [
    { key: "busan",     name: "부산 (집)",              lon: 129.08, lat: 35.18,  kind: "home",    dx: 15,  dy: 18,  anchor: "start" },
    { key: "incheon",   name: "인천",                   lon: 126.44, lat: 37.46,  kind: "city",    dx: -12, dy: 24,  anchor: "end", visit: false },
    { key: "singapore", name: "싱가포르 창이 (경유)",   lon: 103.99, lat: 1.36,   kind: "transit", dx: 15,  dy: -13, anchor: "start" },
    { key: "perth",     name: "퍼스 · 쿠지 11/20~24",   lon: 115.77, lat: -32.12, kind: "city",    dx: -12, dy: 46,  anchor: "end", visit: true },
    { key: "sydney",    name: "시드니 11/24~26",        lon: 151.21, lat: -33.87, kind: "city",    dx: 14,  dy: 44,  anchor: "start", visit: true },
    { key: "sunshine",  name: "선샤인코스트 11/26~27",  lon: 153.10, lat: -26.65, kind: "city",    dx: 16,  dy: -12, anchor: "start", visit: true },
    { key: "brisbane",  name: "브리즈번 11/27~28",      lon: 153.03, lat: -27.47, kind: "city",    dx: 16,  dy: 20,  anchor: "start", visit: true },
    { key: "budapest",  name: "부다페스트 2027-06",     lon: 19.04,  lat: 47.50,  kind: "future",  dx: -14, dy: -22, anchor: "end" }
  ],

  route: [
    { from: "busan",      to: "singapore", label: "SQ615",        curve: 0.14, lx: 30,  ly: -8 },
    { from: "singapore",  to: "perth",     label: "",             curve: 0.18 },
    { from: "perth",      to: "sydney",    label: "",             curve: -0.17 },
    { from: "sydney",     to: "sunshine",  label: "",             curve: 0.30 },
    { from: "sunshine",   to: "brisbane",  label: "",             curve: 0.06 },
    { from: "brisbane",   to: "incheon",   label: "JQ53",        curve: -0.16, lx: 46, ly: -6 }
  ],

  trip: {
    id: "2026-11-australia",
    title: "2026년 11월 호주 여행 (9박 10일)",
    period: "2026-11-19 ~ 11-28",
    route: "부산 → 싱가포르 경유 → 퍼스·쿠지 → 시드니 → 선샤인코스트 → 브리즈번",
    places: "싱가포르(경유) · 퍼스·쿠지 · 시드니 · 선샤인코스트 · 브리즈번",
    activities: "쿠지 10km 오픈워터 · 바다사자 수영 · 하버브리지 트와일라잇 등반 · 본다이 런클럽 · 스카이다이빙 14,000ft"
  },

  days: [
    {
      date: "2026-11-19", dow: "목", tz: "SGT (UTC+8)", city: "싱가포르",
      title: "부산 → 싱가포르, 창이 T1 환승호텔",
      weather: "비, 25~30℃, 강수 95%, UV 6", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "07:45", x: "SQ615 김해 → 창이 T2 13:35 (좌석 64C, 위탁 25kg) · 온라인 체크인 완료, 실물 탑승권은 김해 카운터에서" },
        { t: "—",     x: "위탁수하물은 퍼스로 직행 — 수영복·수경은 기내 수하물에" },
        { t: "19:30", x: "창이 T1 환승호텔 체크인 ~ 01:30 (현장 SGD 160 결제, 식사 미포함)" },
        { t: "22:00", x: "루프탑 수영장 이용 마감" }
      ]
    },
    {
      date: "2026-11-20", dow: "금", tz: "AWST (UTC+8)", city: "퍼스·쿠지",
      title: "싱가포르 → 퍼스(쿠지), 렌트카 픽업",
      weather: "도착 시간대 흐림, 오후 한때 비, 16~24℃, 강수 55%", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "03:15", x: "SQ8494(스쿠트 TR52) 창이 T1 → 퍼스 T1 08:25 · 좌석 25A, 온라인 체크인 완료" },
        { t: "09:00", x: "Redspot MG3 렌트카 픽업 (DiscoverCars, A$333.44 결제 완료) — QuickerCheckout 사전 체크인 완료, 보증금 A$100 카드 사전승인(홀드) · 여권·실물 면허증·국제면허증·실물 카드 지참" },
        { t: "14:00", x: "쿠지 숙소 체크인 (Coogee WA)" },
        { t: "—",     x: "쿠지 대회 배번·수모·타이밍칩은 오늘 사전 수령 없음 — 내일 06:00 해변 등록 텐트에서 받습니다" }
      ]
    },
    {
      date: "2026-11-21", dow: "토", tz: "AWST", city: "쿠지",
      title: "쿠지 비치 10km 오픈워터 대회",
      weather: "이슬비 가능·바람 많음, 15~19℃, 강수 45%, 오전 바람 24~27km/h", weatherAt: "2026-11-18",
      badge: "대회", badgeKind: "race",
      items: [
        { t: "06:00", x: "Coogee Beach 등록 텐트(6 Powell Rd)에서 06:00~07:00 사이 이름과 10km를 말하고 수모(일반부 빨강)·배번·넘버타투·타이밍칩 수령" },
        { t: "—",     x: "OWS Series Round 2 Coogee 10km · 주최측 최종 시간표와 일정 변동 공지 확인 필요" },
        { t: "—",     x: "행사장 상공 드론 금지 · 오전 바람 24~27km/h 예보라 해상 상태 확인 필요" }
      ]
    },
    {
      date: "2026-11-22", dow: "일", tz: "AWST", city: "로킹엄",
      title: "로킹엄 — 15:00 제트스키 30분 (돌고래 수영은 기상 취소)",
      weather: "대체로 흐림, 14~18℃, 오후 강수 0%, 바람 18km/h", weatherAt: "2026-11-18",
      badge: "확정", badgeKind: "done",
      items: [
        { t: "오전", x: "야생 돌고래 수영 — 번버리 업체 기상 취소, A$242.55 전액 환불 완료(카드 반영 최대 48시간)" },
        { t: "14:00", x: "제트스키 업체에 날씨 확인 전화 (+61 450 538 754)" },
        { t: "15:00", x: "로킹엄 제트스키 30분 — 예약 확정·A$137.09 결제 완료, 면책동의서 서명 완료" }
      ]
    },
    {
      date: "2026-11-23", dow: "월", tz: "AWST", city: "줄리언 베이",
      title: "줄리언 베이 바다사자 수영 07:00~09:30",
      weather: "맑음·바람 잔잔, 14~20℃, 강수 0%, UV 9", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "04:00", x: "쿠지 출발 (편도 2.5시간)" },
        { t: "06:45", x: "Jurien Bay Breakwater Dr 체크인" },
        { t: "07:00", x: "바다사자 수영 (AU$233.35 결제 완료) · 개인 방수카메라 가능(셀카봉 금지), 고프로 사진 무료 제공" },
        { t: "—",     x: "해양포유류 60m 이내 드론 금지" }
      ]
    },
    {
      date: "2026-11-24", dow: "화", tz: "AWST → AEDT (UTC+11)", city: "시드니",
      title: "퍼스 → 시드니, 하버브리지 트와일라잇 등반",
      weather: "시드니: 구름 많고 저녁 이슬비 가능, 16~22℃, 강수 43%, UV 9", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "06:00", x: "쿠지 체크아웃 → 06:30 렌트카 무인 반납 (국제운전면허증·실물 신용카드 필요)" },
        { t: "08:10", x: "QF644 퍼스 T4 → 시드니 T3 15:20" },
        { t: "17:50", x: "포츠포인트 숙소(3층·엘리베이터 없음) → 등반 체크인" },
        { t: "18:05", x: "하버브리지 트와일라잇 등반 ~21:05 — 예약 확정 (AUD 427, 여권·고무창 운동화, 폰·카메라 무료 락커)" },
        { t: "—",     x: "BridgeClimb 건강확인서 온라인 자가 체크 링크 수신 — 출발 전 작성" }
      ]
    },
    {
      date: "2026-11-25", dow: "수", tz: "AEDT", city: "시드니",
      title: "본다이 런클럽 + 본다이 아이스버그 수영",
      weather: "흐림, 16~21℃, 오전 이슬비 가능(강수 10%), UV 6", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "06:15", x: "Bondi Beach Run Club (Bondi Surf Bathers' SLSC 앞, 무료·사전신청 없음, 브론테 5km 왕복) — 확정" },
        { t: "06:00", x: "본다이 아이스버그 수영 — 확정, 풀 운영 06:00~18:30 (목요일 휴무)" },
        { t: "오후", x: "시드니 시내(오페라하우스 등) 또는 글렌워스 밸리(매일 16:30 말 떼 질주) — 조율 중" }
      ]
    },
    {
      date: "2026-11-26", dow: "목", tz: "AEDT → AEST (UTC+10)", city: "선샤인코스트",
      title: "시드니 → 선샤인코스트, 코튼 트리",
      weather: "이슬비 가능, 19~25℃, 강수 53%, 마루치도어 기준", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "08:10", x: "VA485 시드니 T2 → MCY 08:45 (좌석 24F) · 코튼 트리 에어비앤비 확정" },
        { t: "09:00", x: "SKYONE 온라인 사전 등록 마감 — 꼭 이 시각 전에" },
        { t: "13:00", x: "마루치도어 숙소 체크인 (오전 짐 보관 가능 확인됨)" }
      ]
    },
    {
      date: "2026-11-27", dow: "금", tz: "AEST", city: "브리즈번",
      title: "칼룬드라 스카이다이빙 14,000ft → 브리즈번",
      weather: "칼룬드라 오전 맑음, 20~24℃, 낮 강수 50%, UV 11", weatherAt: "2026-11-18",
      badge: "숙소 확정", badgeKind: "done",
      items: [
        { t: "08:15", x: "코튼트리 체크아웃" },
        { t: "09:00", x: "SKYONE 칼룬드라 Ultimate 3자 촬영 (14,000ft · AUD 639 결제 완료)" },
        { t: "—",     x: "우버 → 랜즈버러 역 → 브리즈번 센트럴 기차 (A$0.50, 약 75~80분)" },
        { t: "—",     x: "브리즈번 숙소: Holiday Inn Express Brisbane Central — 조식 포함, A$304 현장결제, 11/26 18:00까지 무료취소" }
      ]
    },
    {
      date: "2026-11-28", dow: "토", tz: "AEST", city: "귀국",
      title: "브리즈번 → 인천 → 부산 (JQ53 확정)",
      weather: "아직 예보 범위 밖 — 출발 전 확인", weatherAt: "",
      badge: "확정", badgeKind: "done",
      items: [
        { t: "11:05", x: "JQ53 브리즈번 → 인천 T1 19:55 — 발권 완료, 위탁 20kg 포함 (온라인 체크인 11/26 10:05 오픈)" },
        { t: "23:40", x: "인천 T1 → 부산역 K-BUS (11/23 전 최소 5명 확정 · 아직 미예약)" }
      ]
    }
  ],

  competitions: [
    {
      id: "coogee-10k", status: "예정", badgeKind: "race",
      date: "2026-11-21", name: "쿠지 비치 10km 오픈워터",
      official: "OWS Series Round 2 Coogee 10km",
      place: "호주 퍼스 Coogee Beach",
      event: "오픈워터", distance: 10, distanceUnit: "km",
      temp: "", weather: { text: "이슬비 가능 15~19℃, 강수 45%, 오전 바람 24~27km/h", at: "2026-11-18" },
      condition: "", note: "배번·수모·타이밍칩은 당일 06:00~07:00 해변 등록 텐트(6 Powell Rd)에서만 수령 — 11/20 사전 수령 없음"
    },
    {
      id: "au-2026-10", status: "기록 미입력", badgeKind: "warn",
      date: "", name: "2026년 10월 호주 수영대회",
      official: "", place: "호주 (도시 미입력)", event: "", distance: "", distanceUnit: "km",
      temp: "", weather: "", condition: "",
      note: "날짜·대회명·도시·종목·기록을 알려주시면 그때 채웁니다"
    },
    {
      id: "budapest-3k", status: "목표", badgeKind: "",
      date: "2027-06-29", dateEnd: "2027-06-30", name: "세계마스터즈 오픈워터 3K",
      official: "세계마스터즈 — 남자 60–64세부",
      place: "헝가리 부다페스트 (발라톤 호수 가능)", event: "오픈워터", distance: 3, distanceUnit: "km",
      temp: "", weather: { text: "6월 말 22~25℃ 민물로 예상 (공식 발표 전)", at: "" },
      condition: "", note: "등록 마감일은 아직 공지 전"
    }
  ],

  trainingNote: "참고(대회 기록 아님): 가민 커넥트 풀 훈련 최고 기록 — 400m 5:14, 750m 10:26, 1,000m 14:15, 1,500m 22:32. 3K 목표 페이스 판단용으로만 보세요.",

  todos: [
    { id: "t-skyone",   label: "🪂 SKYONE 온라인 사전 등록", due: "11/26 09:00까지" },
    { id: "t-kbus",     label: "🚌 K-BUS 인천공항 → 부산역 예매 (23:40편)", due: "11/23 전" },
    { id: "t-bridge",   label: "🧭 하버브리지 건강확인서 자가 체크 작성", due: "11/24 전" },
    { id: "t-timetable", label: "🕐 쿠지 10km 최종 시간표·일정 변동 공지 확인", due: "11/20" },
    { id: "t-syd25",    label: "🌆 11/25 오후 일정 정하기 (시내 관광 또는 글렌워스 밸리)", due: "11/24" },
    { id: "t-dolphin",  label: "🐬 로킹엄 돌고래 수영 — 기상 취소, A$242.55 전액 환불(11/18)", due: "완료" },
    { id: "t-jetski",   label: "🚤 로킹엄 제트스키 30분 — 예약·결제·면책동의서", due: "완료" },
    { id: "t-bnb27",    label: "🏨 브리즈번 숙소 — Holiday Inn Express Brisbane Central 예약", due: "완료" },
    { id: "t-return",   label: "✈️ JQ53 귀국편 — AU$1,380.80 결제·발권", due: "완료" }
  ],

  checklist: [
    { group: "수영 필수 (11/21 쿠지 10km)", items: [
      { id: "c-swimcap", label: "🏊 수모 (대회용은 당일 수령 · 연습용은 따로)" },
      { id: "c-goggles", label: "🥽 고글 (예비 1개 포함)" },
      { id: "c-suit",    label: "🩱 수영복" },
      { id: "c-warm",    label: "🧥 완주 후 방한 용품 (바람막이·보온 병·수건)" },
      { id: "c-garmin",  label: "⌚ 가민 워치 (충전 케이블 포함)" }
    ]},
    { group: "여행 서류", items: [
      { id: "c-passport", label: "🛂 여권 원본 (하버브리지 등반 때 필요)" },
      { id: "c-insurance", label: "📄 여행자보험 — DB손해보험 다이렉트 표준형 가입 완료(11/18, 24,580원) · 증권 사본 챙기기" },
      { id: "c-idp",      label: "🚗 국제운전면허증 + 실물 신용카드 (렌트카 픽업·무인 반납)" },
      { id: "c-eta",      label: "🖨️ 호주 ETA 승인 사본 (전자 연동 — 출력본 권장)" },
      { id: "c-bridgeform", label: "🏥 하버브리지 건강확인서 출력본" }
    ]},
    { group: "장비 · 기타", items: [
      { id: "c-deca",    label: "🎒 데카트론 5L 배낭 140g (11/17 배송 완료)" },
      { id: "c-drone",   label: "📷 DJI Mini 4K 드론 (249g 미만 · 배터리는 기내 반입)" },
      { id: "c-uwater",  label: "🤿 방수 카메라 (바다사자 투어용, 셀카봉 금지)" },
      { id: "c-plug",    label: "🔌 멀티 어댑터 (호주 I형 · 싱가포르 G형)" },
      { id: "c-med",     label: "💊 상비약 (멀미약 — 배 위 액티비티 많음)" },
      { id: "c-sun",     label: "🧴 자외선 차단제 (UV 10 예보일 있음)" },
      { id: "c-shoes",   label: "🎽 러닝화 — 하버브리지 등반은 고무창 운동화 필수" }
    ]}
  ],

  /* 공개 번호만 */
  emergency: [
    { org: "호주 경찰·화재·구급", num: "000", note: "24시간 · 휴대폰 112" },
    { org: "싱가포르 경찰", num: "999", note: "핫라인 1-800-225-0000" },
    { org: "싱가포르 구급·화재", num: "995", note: "앰블런스 동일" },
    { org: "영사안전콜센터", num: "+82-2-3210-0404", note: "24시간 · 호주 무료 0011-800-2100-0404" },
    { org: "동포콜센터", num: "+82-2-6747-0404", note: "24시간 · 국적·가족관계" },
    { org: "주호주 대사관", num: "+61-2-6270-4100", note: "캔버라 · 서호주(퍼스) 관할" },
    { org: "대사관 긴급(야간)", num: "+61-408-815-922", note: "캔버라·퍼스 등" },
    { org: "주시드니 총영사관", num: "+61-2-9210-0200", note: "NSW · 긴급 +61-403-546-058" },
    { org: "주브리즈번 출장소", num: "+61-7-3221-1440", note: "QLD(브리즈번·선샤인코스트)" },
    { org: "주싱가포르 대사관", num: "+65-6256-1188", note: "당직 +65-9654-3528" }
  ],

  consular: [
    "<b>퍼스·줄리언 베이·로킹엄(서호주)</b> — 주호주 대사관(캔버라) 관할: 근무시간 +61-2-6270-4100, 야간·사건사고 +61-408-815-922.",
    "<b>시드니(NSW)</b> — 주시드니 총영사관: Level 10, 44 Market Street, Sydney NSW 2000 · +61-2-9210-0200, 사건사고 +61-403-546-058.",
    "<b>선샤인코스트·브리즈번(QLD)</b> — 주브리즈번 출장소 +61-7-3221-1440.",
    "<b>싱가포르 경유 중</b> — 주싱가포르 대사관: 47 Scotts Road #08-00 Goldbell Towers · +65-6256-1188, 당직 +65-9654-3528."
  ],

  /* 숙소는 도시·지역만 (상세 주소는 비공개) */
  lodging: [
    { when: "11/19", name: "창이 T1 환승호텔", where: "싱가포르 창이공항 T1 환승구역" },
    { when: "11/20~24", name: "쿠지 에어비앤비", where: "호주 퍼스 쿠지 (Coogee WA)" },
    { when: "11/24~26", name: "포츠포인트 에어비앤비", where: "호주 시드니 포츠포인트 (Potts Point NSW)" },
    { when: "11/26~27", name: "코튼 트리 에어비앤비", where: "호주 선샤인코스트 마루치도어 (Maroochydore QLD)" },
    { when: "11/27~28", name: "Holiday Inn Express Brisbane Central", where: "호주 브리즈번 센트럴 (조식 포함 · 현장결제 A$304)" }
  ],

  /* 예약 코드: 사이트에는 이름만. 코드는 사용자가 이 기기에 직접 적음 */
  bookings: [
    { id: "b-transfer", what: "창이 T1 환승호텔 (11/19 19:30~01:30)", prov: "Changi Airport Transithotel · 현장 SGD 160 결제", when: "11/19" },
    { id: "b-sq615",    what: "SQ615 김해 → 창이",                    prov: "싱가포르항공 · 위탁 25kg, 좌석 64C · 온라인 체크인 완료", when: "11/19" },
    { id: "b-scoot",    what: "SQ8494(스쿠트 TR52) 창이 → 퍼스",       prov: "스쿠트 · 좌석 25A · 온라인 체크인 완료", when: "11/20" },
    { id: "b-car",      what: "렌트카 Redspot MG3",                    prov: "DiscoverCars · A$333.44 결제 완료 · QuickerCheckout 체크인 완료, 보증금 A$100 사전승인", when: "11/20~24" },
    { id: "b-coogee",   what: "쿠지 숙소",                             prov: "Airbnb · 호스트 Andrea", when: "11/20~24" },
    { id: "b-race",     what: "쿠지 10km 대회 등록",                   prov: "OWS Series Round 2 · 등록 완료", when: "11/21" },
    { id: "b-rockingham", what: "로킹엄 제트스키 30분",               prov: "A$137.09 결제 완료 · 면책동의서 서명 완료", when: "11/22" },
    { id: "b-sealion",  what: "바다사자 수영",                         prov: "Jurien Bay Oceanic Experience · AU$233.35 결제 완료", when: "11/23" },
    { id: "b-qf644",    what: "QF644 퍼스 → 시드니",                   prov: "콴타스", when: "11/24" },
    { id: "b-potts",    what: "시드니 숙소",                           prov: "Airbnb · 포츠포인트", when: "11/24~26" },
    { id: "b-bridge",   what: "하버브리지 트와일라잇 등반",            prov: "BridgeClimb · AUD 427 결제 완료 · 건강확인서 자가 체크 남음", when: "11/24" },
    { id: "b-va485",    what: "VA485 시드니 → 선샤인코스트",           prov: "버진오스트레일리아 · Choice A$318, 좌석 24F", when: "11/26" },
    { id: "b-cotton",   what: "코튼 트리 숙소",                        prov: "Airbnb · 호스트 Michele", when: "11/26~27" },
    { id: "b-skyone",   what: "SKYONE 스카이다이빙 14,000ft",          prov: "칼룬드라 · Ultimate 3자 촬영 AUD 639 결제 완료", when: "11/27" },
    { id: "b-hie",      what: "브리즈번 숙소 Holiday Inn Express Brisbane Central", prov: "조식 포함 · 현장결제 A$304 · 11/26 18:00까지 무료취소", when: "11/27~28" },
    { id: "b-jq53",     what: "JQ53 브리즈번 → 인천 (확정)",           prov: "젯스타 · AU$1,380.80 결제·발권 완료, 위탁 20kg 포함", when: "11/28" },
    { id: "b-kbus",     what: "인천공항 → 부산역 K-BUS (미예약)",      prov: "11/23 전 예매 예정", when: "11/28" }
  ]
};
