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
  title: "진의 스윔트립",
  updated: "2026-11-21",

  countries: [
    { code: "KOR", name: "대한민국", state: "거주지 · 출발지", cls: "home", cities: "부산 (집)" },
    { code: "AUS", name: "호주", state: "다녀옴(2026-10) + 예정(11/19~28)", cls: "visited", cities: "퍼스·쿠지, 시드니, 선샤인코스트, 브리즈번" },
    { code: "SGP", name: "싱가포르", state: "다녀옴(2025-08 대회) · 경유 예정(11/19)", cls: "visited", cities: "창이공항, 시내 (2025-08 세계마스터즈)" },
    { code: "USA", name: "미국", state: "다녀옴(2026-03)", cls: "visited", cities: "로스앤젤레스·풀러턴·라하브라, 라스베이거스, 샌디에이고, 뉴욕" },
    { code: "TWN", name: "대만", state: "다녀옴(2026-06)", cls: "visited", cities: "가오슝, 펑후(마공), 캉딩(헝춘)" },
    { code: "HUN", name: "헝가리", state: "예정(2027-06)", cls: "future", cities: "부다페스트 (대회 출전 목표)" }
  ],

  cities: [
    { key: "busan",     name: "부산 (집)",              lon: 129.08, lat: 35.18,  kind: "home",    dx: 15,  dy: 18,  anchor: "start" },
    { key: "incheon",   name: "인천",                   lon: 126.44, lat: 37.46,  kind: "city",    dx: -12, dy: 24,  anchor: "end", visit: false },
    { key: "singapore", name: "싱가포르 창이",         lon: 103.99, lat: 1.36,   kind: "transit", dx: 15,  dy: -13, anchor: "start" },
    { key: "losangeles", name: "로스앤젤레스·풀러턴",    lon: -117.87, lat: 33.87, kind: "city",    dx: -12, dy: -4,  anchor: "end",   visit: true },
    { key: "newyork",    name: "뉴욕",                 lon: -74.01,  lat: 40.71, kind: "city",    dx: -12, dy: -8,  anchor: "end",   visit: true },
    { key: "taiwan",     name: "가오슝·펑후·캉딩",      lon: 120.10,  lat: 22.80, kind: "city",    dx: -12, dy: 2,   anchor: "end",   visit: true },
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
    activities: "바다사자 수영 · 하버브리지 트와일라잇 등반 · 본다이 런클럽 · 노사 돌고래 사파리 · 스카이다이빙 14,000ft · 남쪽 해안 드라이브(버셀턴 제티 러닝·슈가로프 록·카날 록스) (쿠지 10km는 기상으로 연기·불참)"
  },

  days: [
    {
      date: "2026-11-19", dow: "목", tz: "SGT (UTC+8)", city: "싱가포르",
      title: "부산 → 싱가포르, 창이 T1 환승호텔",
      weather: "비, 25~30℃, 강수 97%, UV 7 (오전·저녁 이슬비)", weatherAt: "2026-11-18",
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
      weather: "도착 시간대(08~10시) 구름 조금, 오후 한때 비, 16~24℃, 강수 58%, 오후 바람 20~24km/h", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "03:15", x: "SQ8494(스쿠트 TR52) 창이 T1 → 퍼스 T1 08:25 · 좌석 25A, 온라인 체크인 완료" },
        { t: "09:00", x: "Redspot MG3 렌트카 픽업 (DiscoverCars, A$333.44 결제 완료) — QuickerCheckout 사전 체크인 완료, 보증금 A$100 카드 사전승인(홀드) · 여권·실물 면허증·국제면허증·실물 카드 지참" },
        { t: "14:00", x: "쿠지 숙소 체크인 (Coogee WA)" },
        { t: "—",     x: "쿠지 10km 대회는 기상 악화로 11/28(토) 연기·불참이 확정(11/19) — 배번·수모·타이밍칩 수령 없음" }
      ]
    },
    {
      date: "2026-11-21", dow: "토", tz: "AWST", city: "퍼스·프레맨틀 → 버셀턴·슈가로프 록",
      title: "프레맨틀 50m 수영 → 버셀턴 제티 · 슈가로프 록 · 카날 록스",
      weather: "버셀턴 이슬비 가끔, 15~17℃, 강수 85%, 낮 바람 32~39km/h, 일출 05:04 · 일몰 19:04 (쿠지 일몰 18:59)", weatherAt: "2026-11-20",
      badge: "완료", badgeKind: "done",
      items: [
        { t: "06:25~07:15", x: "🏊 프레맨틀 레저 센터 (50m 야외 풀) — ⌚ 2,102 m · 50:16(이동 37:41) · 평균 2:23/100m(이동 1:48/100m) · 평균 심박 135 bpm · 515 kcal" },
        { t: "08:00~10:15", x: "쿠지 숙소 출발 → 버셀턴 제티 (Kwinana Fwy → Forrest Hwy → Bussell Hwy 약 210km·2시간 15분)" },
        { t: "오전·점심", x: "버셀턴 제티 & 포쇼어 산책 — ⌚ 가민 보행 2건 합계 3.28 km (2.61 km 52:06 + Busselton 0.67 km 30:48)" },
        { t: "오후", x: "슈가로프 록 · 카날 록스 해안 드라이브 후 쿠지 숙소 복귀 (중간 주유 Unleaded 91)" },
        { t: "—",     x: "쿠지 10km 대회(11/28 연기)는 귀국일과 겹쳐 불참 — A$94.00 전액 환불 요청 메일 발송(11/19, 회신 대기)" }
      ]
    },
    {
      date: "2026-11-22", dow: "일", tz: "AWST", city: "로킹엄",
      title: "로킹엄 — 15:00 제트스키 30분",
      weather: "대체로 흐림, 14~18℃, 오후 강수 0%, 바람 19km/h", weatherAt: "2026-11-18",
      badge: "확정", badgeKind: "done",
      items: [
        { t: "14:00", x: "제트스키 업체에 날씨 확인 전화 (+61 450 538 754)" },
        { t: "14:10~14:35", x: "쿠지 숙소 출발 → 로킹엄 제트스키장" },
        { t: "15:00", x: "로킹엄 제트스키 30분 — 예약 확정·A$137.09 결제 완료, 면책동의서 서명 완료" }
      ]
    },
    {
      date: "2026-11-23", dow: "월", tz: "AWST", city: "줄리언 베이",
      title: "줄리언 베이 바다사자 수영 07:00~09:30",
      weather: "구름 조금, 15~20℃, 강수 34%(오전 0%), 바람 9~14km/h, UV 8", weatherAt: "2026-11-18",
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
      weather: "시드니: 구름 많고 저녁 이슬비 가능(강수 12%), 17~23℃, UV 9, 등반 시간 바람 17~20km/h", weatherAt: "2026-11-18",
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
      weather: "흐림, 16~21℃, 낮 강수 0%, UV 6", weatherAt: "2026-11-18",
      badge: "", badgeKind: "",
      items: [
        { t: "06:15", x: "Bondi Beach Run Club (Bondi Surf Bathers' SLSC 앞, 무료·사전신청 없음, 브론테 5km 왕복) — 확정" },
        { t: "06:00", x: "본다이 아이스버그 수영 — 확정, 풀 운영 06:00~18:30 (목요일 휴무)" },
        { t: "오후", x: "시드니 시내(오페라하우스 등) — 확정 (글렌워스 밸리 승마는 하지 않음)" }
      ]
    },
    {
      date: "2026-11-26", dow: "목", tz: "AEDT → AEST (UTC+10)", city: "선샤인코스트",
      title: "시드니 → 선샤인코스트, 노사 돌고래 사파리",
      weather: "이슬비 가능, 19~25℃, 강수 40%(보트 시간대 9%), 보트 시간대 바람 24km/h", weatherAt: "2026-11-18",
      badge: "확정", badgeKind: "done",
      items: [
        { t: "08:10", x: "VA485 시드니 T2 → MCY 08:45 (좌석 24F) · 코튼 트리 에어비앤비 확정" },
        { t: "09:00", x: "SKYONE 온라인 사전 등록 마감 — 꼭 이 시각 전에" },
        { t: "—",     x: "코튼 트리 숙소에 짐 보관 (체크인은 투어 후 — 오전 짐 보관 가능 확인됨)" },
        { t: "11:30", x: "숙소 출발 → 노사 마리나 (차로 약 40분, 마리나 앞 다리 정체 대비해 12:30 체크인보다 일찍 출발)" },
        { t: "12:30", x: "노사 오션라이더 체크인 마감 — Noosa Marina, 2 Parkyn Court, Tewantin QLD (주차장 계단 아래 'NOOSA OCEANRIDER MEET HERE' 표지, 탑승 전 면책동의서 서명)" },
        { t: "13:00", x: "노사 돌고래 사파리 ~14:30 (90분 보트 · A$92.70 결제 완료) · 당일 아침 운항 여부 확인 0438 386 255" }
      ]
    },
    {
      date: "2026-11-27", dow: "금", tz: "AEST", city: "브리즈번",
      title: "칼룬드라 스카이다이빙 14,000ft → 브리즈번",
      weather: "칼룬드라 흐리고 이슬비 가능(09시 강수 11%), 21~24℃, UV 5, 오전 바람 17~19km/h", weatherAt: "2026-11-18",
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
      id: "coogee-10k", status: "불참 · 환불 요청", badgeKind: "", skip: true,
      date: "2026-11-28", name: "쿠지 비치 10km 오픈워터",
      official: "OWS Series Round 2 Coogee 10km — 11/21에서 11/28로 연기",
      place: "호주 퍼스 Coogee Beach",
      event: "오픈워터", distance: 10, distanceUnit: "km",
      temp: "", weather: { text: "원래 대회일(11/21) 예보는 15~19℃·대회 시간대 강수 0~8%였으나 기상 악화로 11/28 연기", at: "2026-11-18" },
      condition: "",
      summary: "쿠지 비치 10km — 기상으로 11/28 연기, 귀국일과 겹쳐 불참 (A$94.00 전액 환불 요청)",
      note: "11/21·22 이틀 예정이던 대회가 기상 예보 악화로 11/28(토) 하루(06:30~12:00 예상)로 연기됐고 기존 등록은 자동 이전됐습니다. 11/28은 JQ53 브리즈번 11:05 귀국편과 겹쳐 참가할 수 없어 주최측(ows@wa.swimming.org.au)에 해외 귀국 일정 사유를 적어 참가비 A$94.00 전액 환불을 요청한 상태입니다(2026-11-19 발송, 회신 대기). 대회 기록은 없습니다."
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
    },
    {
      id: "sg-2025-worlds", status: "완료", badgeKind: "done",
      date: "2025-08-11", name: "세계마스터즈 수영 (싱가포르 2025)",
      official: "World Aquatics Masters Championships – Singapore 2025",
      place: "싱가포르 OCBC 아쿠아틱 센터", event: "수영(풀) 200m 개인혼영 · 100m 배영",
      distance: "", distanceUnit: "km", temp: "", weather: "", condition: "",
      note: "남자 55–59세부 · 소속 SWIMON · 공식 결과 두 종목 모두 NT(기록 없음) — 결과지 2025-08-11·08-12 발행 · 레이스는 가민에 남지 않았고 대회 기간 실외 수영 1,204 m만 기록"
    },
    {
      id: "us-2026-mission-viejo", status: "완료", badgeKind: "done",
      date: "2026-03-08", name: "미션 비에호 마스터스 SCY 미트",
      official: "2026 Mission Viejo Nadadores Masters SCY Swim Meet (USMS 336-S004)",
      place: "미국 캘리포니아 미션 비에호 Marguerite Aquatic Center (25야드)", event: "200·100·50야드 자유형 · 100야드 개인혼영",
      distance: "", distanceUnit: "km", temp: "", weather: "", condition: "",
      note: "2026-03-08 결과 — 200야드 자유형 1위 · 100야드 개인혼영 3위 (상진님 확인) · 100·50야드 자유형도 출전 · 공식 결과지(USMS 회원 전용 · SwimPhone 아카이브 인증)는 열람하지 못해 공식 시간은 미확인 · 엔트리 기록 200야드 2:45.00 · 100야드 1:30.00 · 50야드 31.00 · 100야드 IM 1:30.00 (참가비 $50, Web Entry 2329484) · 가민에는 몸풀기 464 m만 기록"
    },
    {
      id: "tw-2026-penghu", status: "완료", badgeKind: "done",
      date: "2026-06-13", name: "오션맨 펑후 10km",
      official: "OCEANMAN PENGHU 2026 (국제 해수욕 펑후만)",
      place: "대만 펑후 마공", event: "오픈워터", distance: 10, distanceUnit: "km",
      temp: "25~29℃", weather: "", condition: "", time: "3:50:29",
      note: "공식 기록 Net 3:50:29 (타이완 BraveLog 타이밍) · 배번호 011122 · 남자 50-59 부문 6위(6/21) · 종합 43/103 · 부문 6위로 OCEANMAN 파이널 챔피언십 출전권 획득 · 가민 9,995 m 3:51:09 (2:19/100m · 평균 심박 140 · 최대 176 · 스트로크 5,937 · 랩 20)"
    }
  ],

  /* ── 수영장 · 바다수영 스팟 ──────────────────────────────────────
     2026-11-20 추가. 상진님이 실제로 수영한 곳(홈 그라운드·대회·여행)과
     앞으로 수영할 곳을 구분해 적었습니다.
       · kind   : "pool"(실내·풀) / "sea"(바다·오픈워터)
       · status : "home"(홈·계속) / "done"(다녀옴) / "plan"(예정) / "candidate"(후보)
       · water  : 확인된 수온·환경만. 모르면 빈 값("")으로 두고 화면에서 감춥니다.
       · features : 확인된 특징·유의점
       · record : 가민 커넥트·대회 공식 기록에서 확인된 값만
       · map    : 구글 지도 검색어(좌표를 확인하지 못한 곳은 이름으로만 연결)
     확인되지 않은 시설명·수치·레인 수는 넣지 않았습니다. */
  swimSpots: [
    {
      id: "songdo", name: "송도해수욕장", en: "Songdo Beach, Busan",
      kind: "sea", status: "home", city: "부산", country: "대한민국",
      map: "송도해수욕장 부산",
      water: "11월 수온 16.4~17℃ · 웻슈트 필요",
      features: ["안쪽 만이라 파고 0.1~0.5 m로 잔잔", "물때에 따라 수심·조류가 달라져 만조·간조 시각 확인", "새벽 입수는 어두워 부이 라이트 지참"],
      record: "새벽 바다수영 홈 스팟 — 2026-11-14 조건 확인(수온 16.4~17℃·13물·간조 04:14)"
    },
    {
      id: "busan-nsc", name: "부산국민체육센터", en: "Busan National Sports Center",
      kind: "pool", status: "home", city: "부산", country: "대한민국",
      map: "부산국민체육센터 수영장",
      water: "",
      features: ["귀국 뒤 겨울 훈련장 — 2026-11-18 12월 수영 등록 완료", "요일·시간대는 확인 중"],
      record: "2026-12부터 등록한 일정으로 훈련 예정",
      note: "레인 수·수온은 아직 확인하지 못했습니다."
    },
    {
      id: "changi", name: "창이공항 T1 환승호텔 루프탑 수영장", en: "Changi Transit Hotel T1 Rooftop Pool",
      kind: "pool", status: "done", city: "싱가포르 창이공항", country: "싱가포르",
      map: "Changi Airport Terminal 1 Transit Hotel",
      water: "가민 기록 온도 27~35℃",
      features: ["투숙객 무료 10:00~22:00 · 수건·샤워실 포함", "환승구역(Airside) 안 — 입국심사 없이 이용", "야외 루프탑이라 비 오면 이용이 어려움"],
      record: "2026-11-19 356 m · 29:55 · 평균 심박 89 (가민 커넥트)"
    },
    {
      id: "ocbc", name: "OCBC 아쿠아틱 센터", en: "OCBC Aquatic Centre",
      kind: "pool", status: "done", city: "싱가포르", country: "싱가포르",
      map: "OCBC Aquatic Centre Singapore",
      water: "",
      features: ["2025 세계마스터즈 수영(풀) 경기장", "남자 55–59세부 · 소속 SWIMON"],
      record: "2025-08-11 200 m 개인혼영 · 08-12 100 m 배영 — 공식 결과 두 종목 모두 NT"
    },
    {
      id: "mission-viejo", name: "마르게리트 아쿠아틱 센터", en: "Marguerite Aquatic Center, Mission Viejo",
      kind: "pool", status: "done", city: "미국 캘리포니아 미션 비에호", country: "미국",
      map: "Marguerite Aquatic Center Mission Viejo",
      water: "",
      features: ["25야드 야드풀 · USMS 336-S004 마스터스 SCY 미트", "2026 Mission Viejo Nadadores Masters SCY Swim Meet"],
      record: "2026-03-08 200야드 자유형 1위 · 100야드 개인혼영 3위 · 워밍업 464 m"
    },
    {
      id: "janet-evans", name: "재닛 에번스 수영장", en: "Janet Evans Swim Complex, Fullerton",
      kind: "pool", status: "done", city: "미국 캘리포니아 풀러턴", country: "미국",
      map: "Janet Evans Swim Complex Fullerton",
      water: "",
      features: ["2026-03 미국 여행의 주 훈련장 (3/5~3/7 나흘)"],
      record: "3/5 3,096 m(1:31:01) · 3/6 3,566 m(1:56:04) · 3/7 1,550 m + 1,135 m"
    },
    {
      id: "la-habra", name: "라하브라 숙소 수영장", en: "La Habra lodging pool",
      kind: "pool", status: "done", city: "미국 캘리포니아 라하브라", country: "미국",
      map: "La Habra California",
      water: "",
      features: ["숙소 수영장 — 짧은 몸풀기용"],
      record: "2026-03-03 128 m · 7:50 (가민 커넥트)"
    },
    {
      id: "newport", name: "뉴포트비치", en: "Newport Beach",
      kind: "sea", status: "done", city: "미국 캘리포니아 뉴포트비치", country: "미국",
      map: "Newport Beach California",
      water: "3월 수온 미확인",
      features: ["태평양 해변 오픈워터 — 파도·조류가 있는 바다"],
      record: "2026-03-22 1,245 m · 1:02:12 / 608 m · 12:53 (가민 커넥트)"
    },
    {
      id: "nyc-rec", name: "뉴욕 체육센터 실내 풀", en: "Recreation Center pool, New York",
      kind: "pool", status: "done", city: "미국 뉴욕", country: "미국",
      map: "Recreation Center pool New York",
      water: "",
      features: ["시설 정식 명칭은 가민 기록에 남아 있지 않음"],
      record: "2026-03-26 375 m · 37:36 · 평균 심박 137 (귀국일 아침)"
    },
    {
      id: "penghu", name: "펑후 오션맨 10K", en: "OCEANMAN Penghu 10 km",
      kind: "sea", status: "done", city: "대만 펑후 마공", country: "대만",
      map: "Penghu Magong Taiwan",
      water: "25~29℃",
      features: ["국제 해수욕 펑후만 코스 · 랩 20", "배번호 011122"],
      record: "2026-06-13 9,995 m · 3:51:09 · 2:19/100m · 공식 3:50:29 · 남자 50-59 부문 6위"
    },
    {
      id: "fremantle", name: "프레맨틀 레저 센터", en: "Fremantle Leisure Centre",
      kind: "pool", status: "done", city: "호주 퍼스 프레맨틀", country: "호주",
      map: "Fremantle Leisure Centre 10 Shuffrey St Fremantle",
      water: "50 m 야외 온수 풀 27~28℃ (25 m 실내 28~29℃)",
      features: ["10 Shuffrey St, Fremantle WA · 입장 A$8.30", "토요일 06:00~18:00 · 수건 지참 필수", "쿠지 숙소에서 차 12분(8.7 km)"],
      record: "2026-11-21 06:25 ⌚ 2,102 m · 50:16(이동 37:41) · 2:23/100m(이동 1:48) · 심박 135 bpm"
    },
    {
      id: "coogee", name: "쿠지 비치", en: "Coogee Beach, WA",
      kind: "sea", status: "plan", city: "호주 퍼스 쿠지", country: "호주",
      map: "Coogee Beach Western Australia",
      water: "",
      features: ["10km 대회는 기상으로 11/28 연기 — 귀국일과 겹쳐 불참", "2026-11-20~24 숙소 — 11/21 아침 수영은 프레맨틀 레저 센터에서"],
      record: "2026-11-20~24 쿠지 숙소 · 대회 기록 없음"
    },
    {
      id: "bondi", name: "본다이 아이스버그 수영장", en: "Bondi Icebergs Pool",
      kind: "pool", status: "plan", city: "호주 시드니 본다이", country: "호주",
      map: "Bondi Icebergs Pool 1 Notts Ave Bondi Beach",
      water: "태즈먼 해수가 들어오는 50 m 해수풀",
      features: ["1 Notts Ave, Bondi Beach NSW · 입장 A$10", "수요일 06:00~18:30 · 목요일만 청소 휴무", "사우나 있음"],
      record: "2026-11-25 06:15 본다이 런클럽(5 km) 뒤 수영 예정"
    },
    {
      id: "jurien", name: "줄리안 베이", en: "Jurien Bay",
      kind: "sea", status: "plan", city: "호주 서호주 줄리안 베이", country: "호주",
      map: "Jurien Bay Breakwater Drive",
      water: "",
      features: ["2026-11-23 07:00 바다사자 수영 (Jurien Bay Oceanic Experience)", "Breakwater Dr 06:45 체크인 · 쿠지에서 247.5 km(2시간 40분)", "해양포유류 60 m 이내 드론 금지"],
      record: "예약 R4PGCDN · AU$233.35 결제 완료"
    },
    {
      id: "mooloolaba", name: "물루라바 비치", en: "Mooloolaba Beach",
      kind: "sea", status: "candidate", city: "호주 선샤인코스트", country: "호주",
      map: "Mooloolaba Beach Queensland",
      water: "",
      features: ["깃발 구역에서 수영 — 라이프가드 07:30~17:00", "샤워·탈의실 있음 · 600번 버스 50센트", "숙소(코튼트리)에서 4.0 km"],
      record: "2026-11-26 오전 루틴 후보 — 미확정"
    },
    {
      id: "cotton-tree", name: "코튼트리 아쿠아틱 센터", en: "Cotton Tree Aquatic Centre",
      kind: "pool", status: "candidate", city: "호주 선샤인코스트", country: "호주",
      map: "Cotton Tree Aquatic Centre Maroochydore",
      water: "50 m 온수 풀 26℃",
      features: ["비·강풍으로 바다 수영이 어려울 때 대안"],
      record: "2026-11-26 후보 — 미확정"
    },
    {
      id: "balaton", name: "발라톤 호수", en: "Lake Balaton",
      kind: "sea", status: "plan", city: "헝가리 부다페스트(발라톤)", country: "헝가리",
      map: "Lake Balaton Hungary",
      water: "6월 말 22~25℃ 예상 (공식 발표 전)",
      features: ["2027 세계마스터즈 오픈워터 3K — 남자 60–64세부", "노슈트·민물이라 바다보다 부력이 적음"],
      record: "2027-06-29~30 출전 목표 — 등록 마감일 미공지"
    }
  ],

  /* ── 지난 여행 기록 ──────────────────────────────────────────────
     코코가 2026-11-18에 가민 커넥트 활동 목록(기간 필터)·CSV 내보내기와
     Gmail·Google 캘린더를 대조해 채운 기록입니다.
     · '⌚'로 시작하는 줄은 가민 커넥트 활동(현지 시각, 자동 기록)입니다.
     · 확인하지 못한 값은 지어내지 않고 "미확인"으로 적었습니다. */
  pastTrips: [
    {
      id: "2025-08-singapore",
      overline: "2025-08 · 싱가포르",
      title: "세계마스터즈 수영 — 싱가포르 2025",
      period: "2025-08-10 ~ 08-15 (5박 6일)",
      route: "부산 → 싱가포르 창이 (SQ615) · 귀국 제주항공 7C2662",
      race: "World Aquatics Masters Championships – Singapore 2025",
      totals: "가민 활동 12건 · 수영 2회 1.95 km · 시내 걷기 9건 36.2 km",
      note: "대회 공식 결과는 200m 개인혼영·100m 배영 모두 NT(기록 없음). 레이스 자체는 가민에 남지 않았습니다.",
      days: [
        { date: "2025-08-10", dow: "일", city: "부산 → 싱가포르", title: "출국 · 창이 도착", items: [
          { t: "07:40", x: "싱가포르항공 SQ615 부산(김해) → 창이 (구글 캘린더 출발 07:40·도착 14:10 KST)" },
          { t: "오후", x: "창이공항 도착 — 세계마스터즈 수영(경기일 8/7·8·10~14) 참가를 위해 입국" },
          { t: "16:42", x: "⌚ 실외 수영 749 m · 20:13 · 2:42/100m · 평균 심박 135 (활동 위치 표시는 없음)" }
        ] },
        { date: "2025-08-11", dow: "월", city: "싱가포르", title: "세계마스터즈 — 200m 개인혼영", items: [
          { t: "—", x: "200m 개인혼영 출전 (남자 55–59세부 · 소속 SWIMON) — 공식 결과 NT(기록 없음), 결과지 8/11 발행" },
          { t: "18:25", x: "⌚ 걷기 3.02 km · 54:56 · 심박 97" }
        ] },
        { date: "2025-08-12", dow: "화", city: "싱가포르", title: "세계마스터즈 — 100m 배영", items: [
          { t: "—", x: "100m 배영 출전 — 공식 결과 NT(기록 없음), 결과지 8/12 발행" },
          { t: "13:39", x: "⌚ 걷기 2.10 km · 38:00 · 심박 82" },
          { t: "17:10", x: "⌚ 걷기 9.63 km · 3:45:30 · 심박 71" }
        ] },
        { date: "2025-08-13", dow: "수", city: "싱가포르", title: "실외 수영 · 시내 이동", items: [
          { t: "13:11", x: "⌚ 걷기 2.64 km · 1:21:21" },
          { t: "14:33", x: "⌚ 실외 수영 1,204 m · 27:25 · 2:17/100m · 평균 심박 143" },
          { t: "15:13", x: "⌚ 걷기 0.42 km · 10:35" },
          { t: "15:29", x: "⌚ 걷기 12.35 km · 2:55:21 · 심박 84" }
        ] },
        { date: "2025-08-14", dow: "목", city: "싱가포르 → 창이공항", title: "마지막 날 · 심야 귀국편", items: [
          { t: "00:54", x: "⌚ 걷기 1.19 km · 16:49" },
          { t: "14:16", x: "⌚ 걷기 1.75 km · 1:02:56" },
          { t: "19:48", x: "⌚ 걷기 3.10 km · 32:35" },
          { t: "밤", x: "창이공항 T4로 이동" }
        ] },
        { date: "2025-08-15", dow: "금", city: "귀국", title: "7C2662 창이 → 김해", items: [
          { t: "00:35", x: "제주항공 7C2662 창이 T4 → 김해 08:10 (트립닷컴 운항 안내 메일)" }
        ] }
      ]
    },
    {
      id: "2026-03-usa",
      overline: "2026-03 · 미국",
      title: "미국 여행 — 마스터스 SCY 미트",
      period: "2026-03-02 ~ 03-27 (25박 26일)",
      route: "인천 → 로스앤젤레스 (YP101) · LA→뉴욕 (DL934) · 뉴욕→인천 (OZ221)",
      race: "2026 Mission Viejo Nadadores Masters SCY Swim Meet (2026-03-08)",
      totals: "가민 활동 57건 · 수영 14회 13.32 km · 트레드밀 1.8 km (걷기 기록은 운전·지하철이 섞여 거리 합계에서 제외)",
      note: "캘리포니아(풀러턴·라하브라·미션 비에호·샌디에이고·뉴포트비치), 라스베이거스, 조슈아트리, 디즈니랜드, 뉴욕을 다녀왔습니다.",
      days: [
        { date: "2026-03-02", dow: "월", city: "인천 → 로스앤젤레스", title: "출국 · 도착", items: [
          { t: "13:20", x: "에어프레미아 YP101 인천 → 로스앤젤레스 (구글 캘린더 기록)" },
          { t: "18:23", x: "⌚ Lynwood 러닝 0.06 km — 도착 직후 기록" },
          { t: "18:59", x: "⌚ 풀러턴 걷기 0.17 km · 26:50" }
        ] },
        { date: "2026-03-03", dow: "화", city: "라하브라", title: "숙소 근처 첫날", items: [
          { t: "10:41", x: "⌚ 라하브라 걷기 4.67 km · 1:03:24 · 심박 87" },
          { t: "12:08", x: "⌚ 실외 수영 128 m · 7:50 (숙소 수영장)" }
        ] },
        { date: "2026-03-04", dow: "수", city: "라하브라", title: "실내 트레드밀", items: [
          { t: "18:10", x: "⌚ 트레드밀 러닝 1.80 km · 38:43 · 심박 84" }
        ] },
        { date: "2026-03-05", dow: "목", city: "풀러턴", title: "재닛 에번스 수영장 첫 훈련", items: [
          { t: "10:00", x: "⌚ 랠프 B 클라크 공원 걷기 6.04 km · 1:22:10" },
          { t: "13:00", x: "⌚ 수영 508 m · 9:31 (1:53/100m)" },
          { t: "13:10", x: "⌚ 풀 수영 150 m · 9:16" },
          { t: "13:20", x: "⌚ 재닛 에번스 수영장 3,096 m · 1:31:01 · 2:56/100m · 심박 139" }
        ] },
        { date: "2026-03-06", dow: "금", city: "풀러턴 · 라하브라", title: "수영 3.6 km", items: [
          { t: "08:02", x: "⌚ 라하브라 걷기 4.26 km · 57:45" },
          { t: "13:01", x: "⌚ 재닛 에번스 수영장 3,566 m · 1:56:04 · 3:15/100m · 심박 131" }
        ] },
        { date: "2026-03-07", dow: "토", city: "풀러턴", title: "대회 전날 — 2부·3부 훈련", items: [
          { t: "13:08", x: "⌚ 재닛 에번스 2부 1,550 m · 49:30" },
          { t: "14:00", x: "⌚ 재닛 에번스 3부 1,135 m · 36:43" }
        ] },
        { date: "2026-03-08", dow: "일", city: "미션 비에호", title: "대회 — 미션 비에호 마스터스 SCY 미트, 4종목 출전", items: [
          { t: "07:52", x: "⌚ 몸풀기 464 m · 21:29 · 심박 130 (대회장 워밍업)" },
          { t: "오전~오후", x: "출전 4종목 — 200·100·50야드 자유형 · 100야드 개인혼영 (엔트리 2:45.00 · 1:30.00 · 31.00 · 1:30.00)" },
          { t: "—", x: "결과: 200야드 자유형 1위 · 개인혼영 100야드 3위 (상진님 확인) — 공식 결과지(USMS 회원 전용 · SwimPhone 아카이브 인증)는 열람하지 못해 공식 시간은 미확인" }
        ] },
        { date: "2026-03-09", dow: "월", city: "라하브라", title: "회복", items: [
          { t: "08:41", x: "⌚ 라하브라 걷기 4.11 km · 57:02" }
        ] },
        { date: "2026-03-10", dow: "화", city: "라스베이거스로 이동", title: "차로 이동", items: [
          { t: "03:31", x: "⌚ '여행 이동경로~ 1' 301 km — 운전 중 GPS 오기록(운동 아님)" },
          { t: "06:39", x: "⌚ '여행 이동경로~ 2' 782 km — 운전 중 GPS 오기록(운동 아님)" }
        ] },
        { date: "2026-03-12", dow: "목", city: "라스베이거스", title: "클라크 카운티", items: [
          { t: "18:58", x: "⌚ 걷기 5.01 km · 1:57:19" },
          { t: "21:50", x: "⌚ 35.56 km · 2:34:35 — 차량 이동 포함" }
        ] },
        { date: "2026-03-13", dow: "금", city: "라스베이거스", title: "귀환 이동", items: [
          { t: "11:24", x: "⌚ 421 km 기록 — 운전(GPS), 운동 기록 아님" }
        ] },
        { date: "2026-03-16", dow: "월", city: "조슈아트리", title: "별보기 여행", items: [
          { t: "16:07", x: "⌚ 브레아 38.14 km — 차량" },
          { t: "21:09", x: "⌚ 'Joshua tree 별보기~' 404 km 러닝 기록 — 운전 중 GPS(운동 아님)" }
        ] },
        { date: "2026-03-19", dow: "목", city: "애너하임", title: "디즈니랜드", items: [
          { t: "07:57", x: "⌚ 걷기 5.03 km · 1:43:32" },
          { t: "13:00", x: "⌚ 공원 안 이동 13.93 km · 9:20:10 (심박 86)" }
        ] },
        { date: "2026-03-21", dow: "토", city: "헌팅턴비치 · 오렌지", title: "해안 드라이브", items: [
          { t: "11:17", x: "⌚ 오렌지 22.62 km · 1:40:43 — 차량 포함" },
          { t: "16:26", x: "⌚ 헌팅턴비치 21.50 km · 34:15 — 차량 포함" }
        ] },
        { date: "2026-03-22", dow: "일", city: "샌디에이고 · 뉴포트비치", title: "바다 수영", items: [
          { t: "10:34", x: "⌚ 뉴포트비치 실외 수영 1,245 m · 1:02:12 · 심박 76" },
          { t: "11:54", x: "⌚ 뉴포트비치 실외 수영 608 m · 12:53 · 심박 117" },
          { t: "14:40", x: "⌚ 샌클레멘테·샌디에이고 걷기 (차량 포함)" }
        ] },
        { date: "2026-03-24", dow: "화", city: "로스앤젤레스 → 뉴욕", title: "DL934 뉴욕으로", items: [
          { t: "06:00", x: "델타 DL934 로스앤젤레스 → 뉴욕 JFK (구글 캘린더, 현지 출발 시각)" },
          { t: "14:13", x: "⌚ 뉴욕 걷기 25.51 km · 2:40:32 — 공항·지하철 이동 포함" },
          { t: "21:31", x: "⌚ 뉴욕 걷기 4.08 km · 24:07" }
        ] },
        { date: "2026-03-25", dow: "수", city: "뉴욕 · 저지시티", title: "맨해튼·저지시티", items: [
          { t: "07:42", x: "⌚ 뉴욕 29.11 km · 2:26:36 — 차량·지하철 포함" },
          { t: "10:15", x: "⌚ 저지시티 23.30 km · 5:26:46" },
          { t: "17:24", x: "⌚ 뉴욕 19.77 km · 1:01:04" }
        ] },
        { date: "2026-03-26", dow: "목", city: "뉴욕 → 귀국", title: "마지막 수영 · OZ221", items: [
          { t: "07:17", x: "⌚ 뉴욕 Recreation Center 풀 수영 375 m · 37:36 · 심박 137" },
          { t: "12:10", x: "아시아나 OZ221 뉴욕 JFK → 인천 (현지 출발 시각)" }
        ] },
        { date: "2026-03-27", dow: "금", city: "귀국", title: "인천 도착", items: [
          { t: "17:05", x: "인천 T1 도착 (구글 캘린더)" }
        ] }
      ]
    },
    {
      id: "2026-06-taiwan",
      overline: "2026-06 · 대만",
      title: "오션맨 펑후 10km — 대만",
      period: "2026-06-11 ~ 06-14 (3박 4일)",
      route: "부산 → 가오슝 (7C6255) → 펑후 → 캉딩 → 가오슝 → 부산 (7C6256)",
      race: "OCEANMAN PENGHU 2026 (국제 해수욕 펑후만) 10km",
      totals: "가민 활동 14건 · 수영 1회 9.99 km · 걷기·이동 11건",
      note: "공식 기록 3:50:29 (타이완 BraveLog 타이밍, 배번호 011122) — 남자 50-59 부문 6위로 OCEANMAN 파이널 챔피언십 출전권을 얻었습니다. 가민은 9,995 m 3:51:09 (2:19/100m · 평균 심박 140 · 최대 176 · 수온 25~29℃ · 랩 20). 대회 후 캉딩으로 이동해 하루 더 머물렀습니다.",
      days: [
        { date: "2026-06-11", dow: "목", city: "부산 → 가오슝 → 펑후", title: "출국 · 펑후 입도", items: [
          { t: "14:15", x: "제주항공 7C6255 부산 → 가오슝 (구글 캘린더)" },
          { t: "18:17", x: "⌚ 가오슝 샤오강 걷기 11.44 km · 3:15:37 — 공항·이동" },
          { t: "21:52", x: "⌚ 마공(펑후) 걷기 1.13 km · 31:32" }
        ] },
        { date: "2026-06-12", dow: "금", city: "펑후 마공", title: "대회 준비 · 등록", items: [
          { t: "09:00", x: "⌚ 마공 걷기 8.75 km · 2:56:50 · 심박 87" },
          { t: "11:57", x: "⌚ 마공 걷기 1.55 km · 40:38" },
          { t: "12:47", x: "⌚ 마공 걷기 0.70 km · 30:11" },
          { t: "14:56", x: "⌚ 마공 걷기 7.50 km · 2:11:22" },
          { t: "19:18", x: "⌚ 마공 걷기 2.41 km · 55:37" }
        ] },
        { date: "2026-06-13", dow: "토", city: "펑후 → 캉딩", title: "오션맨 펑후 10km 대회", items: [
          { t: "07:30", x: "⌚ 실외 수영 9,995 m · 3:51:09 · 2:19/100m · 평균 심박 140(최대 176) · 수온 25~29℃ · 스트로크 5,937 · 랩 20" },
          { t: "—", x: "공식 기록 Net 03:50:29 · 남자 50-59 부문 6위(6/21) · 종합 43/103 → OCEANMAN 파이널 챔피언십 출전권 획득 (배번호 011122)" },
          { t: "18:36", x: "⌚ 청청(車城) 이동 4.17 km — 차량, 캉딩으로 이동" },
          { t: "20:50", x: "⌚ 헝춘(캉딩) 걷기 0.31 km · 29:46" }
        ] },
        { date: "2026-06-14", dow: "일", city: "캉딩 → 부산", title: "아침 산책 · 귀국", items: [
          { t: "08:26", x: "⌚ 헝춘 걷기 1.80 km · 1:03:58 · 심박 75" },
          { t: "18:00", x: "제주항공 7C6256 가오슝 → 부산 (구글 캘린더, 한국시간 기준 표기)" }
        ] }
      ]
    }
  ],

  trainingNote: "참고(대회 기록 아님): 가민 커넥트 풀 훈련 최고 기록 — 400m 5:14, 750m 10:26, 1,000m 14:15, 1,500m 22:32. 3K 목표 페이스 판단용으로만 보세요.",

  todos: [
    { id: "t-skyone",   label: "🪂 SKYONE 온라인 사전 등록", due: "11/26 09:00까지" },
    { id: "t-noosa",    label: "🐬 노사 돌고래 사파리 당일 아침 운항 확인 (0438 386 255)", due: "11/26 오전" },
    { id: "t-kbus",     label: "🚌 K-BUS 인천공항 → 부산역 예매 (23:40편)", due: "11/23 전" },
    { id: "t-bridge",   label: "🧭 하버브리지 건강확인서 자가 체크 작성", due: "11/24 전" },
    { id: "t-coogee",  label: "🏊 쿠지 10km — 기상으로 11/28 연기, 귀국일과 겹쳐 불참·A$94.00 전액 환불 요청", due: "완료" },
    { id: "t-dolphin",  label: "🐬 로킹엄 돌고래 수영 — 기상 취소, A$242.55 전액 환불(11/18)", due: "완료" },
    { id: "t-jetski",   label: "🚤 로킹엄 제트스키 30분 — 예약·결제·면책동의서", due: "완료" },
    { id: "t-bnb27",    label: "🏨 브리즈번 숙소 — Holiday Inn Express Brisbane Central 예약", due: "완료" },
    { id: "t-return",   label: "✈️ JQ53 귀국편 — AU$1,380.80 결제·발권", due: "완료" }
  ],

  checklist: [
    { group: "수영 필수 (바다 수영·연습)", items: [
      { id: "c-swimcap", label: "🏊 수모 (연습용)" },
      { id: "c-goggles", label: "🥽 고글 (예비 1개 포함)" },
      { id: "c-suit",    label: "🩱 수영복" },
      { id: "c-warm",    label: "🧥 수영 후 방한 용품 (바람막이·보온 병·수건)" },
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
    { id: "b-race",     what: "쿠지 10km 대회 등록 (불참)",              prov: "OWS Series Round 2 · 11/28로 연기 → 귀국일과 겹쳐 불참, A$94.00 전액 환불 요청(11/19)", when: "11/21 → 11/28" },
    { id: "b-rockingham", what: "로킹엄 제트스키 30분",               prov: "A$137.09 결제 완료 · 면책동의서 서명 완료", when: "11/22" },
    { id: "b-sealion",  what: "바다사자 수영",                         prov: "Jurien Bay Oceanic Experience · AU$233.35 결제 완료", when: "11/23" },
    { id: "b-qf644",    what: "QF644 퍼스 → 시드니",                   prov: "콴타스", when: "11/24" },
    { id: "b-potts",    what: "시드니 숙소",                           prov: "Airbnb · 포츠포인트", when: "11/24~26" },
    { id: "b-bridge",   what: "하버브리지 트와일라잇 등반",            prov: "BridgeClimb · AUD 427 결제 완료 · 건강확인서 자가 체크 남음", when: "11/24" },
    { id: "b-va485",    what: "VA485 시드니 → 선샤인코스트",           prov: "버진오스트레일리아 · Choice A$318, 좌석 24F", when: "11/26" },
    { id: "b-noosa",    what: "노사 돌고래 사파리 13:00~14:30 (Noosa Oceanrider)", prov: "A$92.70 결제 완료 · 12:30까지 노사 마리나 체크인 · 기상 취소 시 전액 환불", when: "11/26" },
    { id: "b-cotton",   what: "코튼 트리 숙소",                        prov: "Airbnb · 호스트 Michele", when: "11/26~27" },
    { id: "b-skyone",   what: "SKYONE 스카이다이빙 14,000ft",          prov: "칼룬드라 · Ultimate 3자 촬영 AUD 639 결제 완료", when: "11/27" },
    { id: "b-hie",      what: "브리즈번 숙소 Holiday Inn Express Brisbane Central", prov: "조식 포함 · 현장결제 A$304 · 11/26 18:00까지 무료취소", when: "11/27~28" },
    { id: "b-jq53",     what: "JQ53 브리즈번 → 인천 (확정)",           prov: "젯스타 · AU$1,380.80 결제·발권 완료, 위탁 20kg 포함", when: "11/28" },
    { id: "b-kbus",     what: "인천공항 → 부산역 K-BUS (미예약)",      prov: "11/23 전 예매 예정", when: "11/28" }
  ]
};
