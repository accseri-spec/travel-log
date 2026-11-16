/* 김상진님의 운동 로그 — 초기 데이터
   출처: 가민 커넥트 활동 내보내기(workout-log/source/*.csv), 동기화 2026-11-16 10:40
   개인정보(이메일·가민 계정·전화번호·주소)는 넣지 않습니다. */
var WORKOUT_DATA = {
  meta: {
    owner: "김상진",
    title: "운동 로그",
    syncedAt: "2026-11-16 10:40",
    source: "가민 커넥트 활동 내보내기",
    autoSync: "매일 22:00 자동 동기화",
    coverage: "2026-04-01 ~ 2026-11-16"
  },

  /* 2027 세계마스터즈 3K — 목표 대회 */
  race: {
    name: "세계마스터즈 오픈워터 3K",
    division: "남자 60–64세부",
    date: "2027-06-29",
    endDate: "2027-06-30",
    place: "헝가리 부다페스트",
    goalTime: "45:42 ~ 45:47",
    goalPace: "1:31.5 /100m",
    goalBasis: "2017 부다페스트 같은 연령부 메달권 기록",
    myPace: "1:30.1 /100m",
    myBasis: "1,500 m 개인 최고(2026-11-11) 기준",
    gap: "1.4초 /100m 앞섬",
    task: "이 페이스를 3,000 m까지 끌고 가는 지구력"
  },

  /* 가까운 대회 (여행 로그와 같은 일정) */
  next: {
    name: "쿠지 비치 10km 오픈워터",
    date: "2026-11-21",
    place: "호주 퍼스 Coogee Beach"
  },

  /* 구간 요약 — 원본(index.md) 값 그대로 */
  windows: [
    {
      label: "이번 달",
      sub: "11/1 ~ 11/16",
      swim: { n: 6, km: 14.92 },
      run: { n: 1, km: 5.91 },
      strength: 3,
      note: "가민 기록 6회 합계 14,915 m (월 집계 표기는 14.91 km)"
    },
    {
      label: "지난주",
      sub: "11/9 ~ 11/15",
      swim: { n: 4, km: 9.17 },
      run: { n: 1, km: 5.91 },
      strength: 3,
      note: "월~일 기준"
    },
    {
      label: "최근 30일",
      sub: "10/18 ~ 11/16",
      swim: { n: 13, km: 42.9 },
      run: { n: 9, km: 56.7 },
      strength: 4,
      note: "러닝 56.7 km에는 10/22 트랙 4.77 km, 10/27 15.34 km 포함"
    }
  ],

  /* 월별 누적 (가민 활동 집계). 11월은 1~16일 */
  monthly: [
    { month: "2026-04", label: "4월", swim: { n: 16, km: 50.79 }, run: { n: 0, km: 0 }, strength: 0 },
    { month: "2026-05", label: "5월", swim: { n: 21, km: 116.12 }, run: { n: 0, km: 0 }, strength: 0, tag: "펑후 10K 직전 피크" },
    { month: "2026-06", label: "6월", swim: { n: 16, km: 55.02 }, run: { n: 1, km: 6.57 }, strength: 2 },
    { month: "2026-07", label: "7월", swim: { n: 19, km: 48.91 }, run: { n: 6, km: 12.75 }, strength: 8 },
    { month: "2026-08", label: "8월", swim: { n: 15, km: 48.22 }, run: { n: 2, km: 4.94 }, strength: 2 },
    { month: "2026-09", label: "9월", swim: { n: 16, km: 51.42 }, run: { n: 1, km: 0.93 }, strength: 1 },
    { month: "2026-10", label: "10월", swim: { n: 19, km: 73.03 }, run: { n: 10, km: 57.76 }, strength: 3, tag: "6,500 m 최장 수영(10/25) 포함" },
    { month: "2026-11", label: "11월", swim: { n: 6, km: 14.92 }, run: { n: 1, km: 5.91 }, strength: 3, tag: "1~16일" }
  ],

  /* 개인 최고 기록 — 가민 '최근 12주' (8/16~11/16) */
  pr: {
    swimAsOf: "가민 '최근 12주' 기준 · 400~1,500 m는 모두 2026-11-11",
    swim: [
      { dist: "400 m", time: "5:23", pace: "1:20.8 /100m", date: "2026-11-11" },
      { dist: "750 m", time: "10:26", pace: "1:23.5 /100m", date: "2026-11-11" },
      { dist: "1,000 m", time: "14:15", pace: "1:25.5 /100m", date: "2026-11-11" },
      { dist: "1,500 m", time: "22:32", pace: "1:30.1 /100m", date: "2026-11-11" },
      { dist: "최장 수영", time: "6,500 m", pace: "—", date: "2026-10-25" }
    ],
    runAsOf: "최근 12주 · 러닝 '항상' 기록은 3월 가민 오기록(이동경로) 때문에 쓰지 않음",
    run: [
      { dist: "1 km", time: "5:57", pace: "5:57 /km", date: "2026-10-23" },
      { dist: "1 mi", time: "9:51", pace: "6:07 /km", date: "2026-10-23" },
      { dist: "5K", time: "32:44", pace: "6:33 /km", date: "2026-10-23" },
      { dist: "최장 러닝", time: "15.34 km", pace: "—", date: "2026-10-27" }
    ]
  },

  /* 11월 상세 기록 10건 (가민 원본). 최신 순 */
  records: [
    {
      id: "2026-11-15-0702-swim",
      date: "2026-11-15", time: "07:02", sport: "swim", place: "실외 수영",
      distanceM: 4447, seconds: 5687, pace: "2:08 /100m",
      hrAvg: 133, hrMax: 158, kcal: 884,
      extra: "랩 9 · 최고 랩 9:22.2 · 스트로크 2,069 · SWOLF 44 · 수온 16~23℃",
      fact: "이번 달 최장·최다 칼로리 세션."
    },
    {
      id: "2026-11-14-1429-run",
      date: "2026-11-14", time: "14:29", sport: "run", place: "트레드밀 러닝",
      distanceKm: 5.91, seconds: 3146, pace: "8:52 /km",
      hrAvg: 125, hrMax: 152, kcal: 490,
      extra: "랩 6 · 최고 랩 7:17.4 · 평균 케이던스 147 · 걸음 7,762",
      fact: "야외가 아닌 실내(트레드밀) 기록."
    },
    {
      id: "2026-11-14-1526-strength",
      date: "2026-11-14", time: "15:26", sport: "strength", place: "근력 훈련",
      seconds: 2731, sets: 11, hrAvg: 120, hrMax: 155, kcal: 346,
      extra: "11세트 · 총 174회 반복"
    },
    {
      id: "2026-11-12-0809-swim",
      date: "2026-11-12", time: "08:09", sport: "swim", place: "풀 수영",
      distanceM: 1425, seconds: 2758, pace: "1:58 /100m",
      hrAvg: 134, hrMax: 161, kcal: 452,
      extra: "스트로크 530 · SWOLF 39 · 이동 시간 28:04"
    },
    {
      id: "2026-11-11-1019-strength",
      date: "2026-11-11", time: "10:19", sport: "strength", place: "근력 훈련",
      seconds: 1913, sets: 12, hrAvg: 98, hrMax: 140, kcal: 171,
      extra: "12세트 · 총 172회 반복"
    },
    {
      id: "2026-11-11-0808-swim",
      date: "2026-11-11", time: "08:08", sport: "swim", place: "풀 수영",
      distanceM: 1975, seconds: 2873, pace: "2:26 /100m",
      hrAvg: 142, hrMax: 181, kcal: 491,
      extra: "스트로크 571 · SWOLF 44",
      fact: "같은 세션에서 12주 개인 최고 4개: 400 m 5:23 · 750 m 10:26 · 1,000 m 14:15 · 1,500 m 22:32. 세션 평균 2:26은 휴식이 긴 세트 구성 때문이고, 구간 최고 속도는 위 값입니다."
    },
    {
      id: "2026-11-10-0820-swim",
      date: "2026-11-10", time: "08:20", sport: "swim", place: "풀 수영",
      distanceM: 1325, seconds: 2151, pace: "2:42 /100m",
      hrAvg: 124, hrMax: 177, kcal: 317,
      extra: "스트로크 445 · SWOLF 49"
    },
    {
      id: "2026-11-09-1717-strength",
      date: "2026-11-09", time: "17:17", sport: "strength", place: "근력 훈련",
      seconds: 4493, sets: 29, hrAvg: 90, hrMax: 126, kcal: 319,
      extra: "29세트 · 총 337회 반복"
    },
    {
      id: "2026-11-08-0828-swim",
      date: "2026-11-08", time: "08:28", sport: "swim", place: "풀 수영",
      distanceM: 2000, seconds: 3753, pace: "1:56 /100m",
      hrAvg: 123, hrMax: 161, kcal: 501,
      extra: "랩 24 · 최고 랩 0:24.2 · 스트로크 740 · SWOLF 38",
      fact: "이번 달 풀 수영 중 평균 페이스가 가장 빨랐던 날."
    },
    {
      id: "2026-11-03-0600-swim",
      date: "2026-11-03", time: "06:00", sport: "swim", place: "실외 수영",
      distanceM: 3743, seconds: 5335, pace: "2:22 /100m",
      hrAvg: 117, hrMax: 150, kcal: 656,
      extra: "랩 8 · 최고 랩 5:54.5 · 스트로크 1,737 · SWOLF 47 · 수온 17~24℃",
      fact: "8랩. 랩 거리가 일정하지 않아 랩 기록만 그대로 적었습니다."
    }
  ],

  /* 빈 날 메모용 달력 (11월) — 기록이 없는 날도 컨디션을 남길 수 있게 */
  days: [
    { date: "2026-11-01", dow: "일" }, { date: "2026-11-02", dow: "월" },
    { date: "2026-11-03", dow: "화" }, { date: "2026-11-04", dow: "수" },
    { date: "2026-11-05", dow: "목" }, { date: "2026-11-06", dow: "금" },
    { date: "2026-11-07", dow: "토" }, { date: "2026-11-08", dow: "일" },
    { date: "2026-11-09", dow: "월" }, { date: "2026-11-10", dow: "화" },
    { date: "2026-11-11", dow: "수" }, { date: "2026-11-12", dow: "목" },
    { date: "2026-11-13", dow: "금" }, { date: "2026-11-14", dow: "토" },
    { date: "2026-11-15", dow: "일" }, { date: "2026-11-16", dow: "월" }
  ]
};
