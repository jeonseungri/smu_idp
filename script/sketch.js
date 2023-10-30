const fireworks = [];

let timeSpeed = 1;
let timeInFrame = 0;
const eachDayInTime = 120; // 몇이 증가하면 하루가 지난다? 1초 = 60
let todayNth = 0; //오늘 번호
let lastDayNth = 0; //지난번호
let weekNth = 0; //이번주
let month = 0;
let day = 0;

const weekText = [
  '4 조  7 3 9 5 8 6',
  '1 조  0 7 1 7 1 2',
  '5 조  2 4 3 4 3 0',
  '2 조  3 5 7 8 5 6',
  '3 조  8 4 6 5 8 1',
  '5 조  4 4 0 2 8 6',
  '3 조  0 5 5 8 3 8',
  '2 조  8 0 2 4 9 3',
  '3 조  7 1 1 0 6 7',
  '1 조  9 7 2 3 4 9',
  '1 조  7 1 8 2 7 3',
  '4 조  3 4 2 1 0 3',
  '3 조  3 4 2 1 0 3',
  '2 조  9 7 0 7 3 1',
  '3 조  9 2 4 7 4 8',
  '2 조  9 6 5 1 7 8',
  '2 조  8 4 4 5 7 8',
  '1 조  0 9 2 1 3 8',
  '3 조  8 0 3 7 5 7',
  '3 조  8 7 6 0 2 1',
];

const weekText2 = [
  '155회',
  '156회',
  '157회',
  '159회',
  '158회',
  '160회',
  '161회',
  '162회',
  '163회',
  '164회',
  '165회',
  '166회',
  '167회',
  '168회',
  '169회',
  '170회',
  '171회',
  '172회',
  '173회',
  '174회',
];

let thisWeekText = weekText[weekNth - 1]; // 현재 주차의 텍스트 초기화
let thisWeekText2 = weekText2[weekNth - 1];

// 좌우 마진
const mx = [80, 80]; // mx[0], mx[1]
// 각 요일별 폭죽 x좌표
const eachDayX = [0, 0, 0, 0, 0, 0];
// 상하 마진
const my = [200, 200];
// 폭죽 솟는 최대 높이
const fireworksHMax = 610;
// 폭죽의 최소 속도
const fireworksVelMin = 50;
// 폭죽의 최대 속도
const fireworksVelMax = 100;
let gravity;
const windMag = 0.1; //잔상
const frictionC = 0.5; //크기

let pg;

function setup() {
  setSketchContainer(3 / 1.8, 'canvas');

  const timeSlider = document.getElementById('timeSpeed');
  timeSlider.addEventListener('input', (evt) => {
    // console.log(evt.target.value);
    timeSpeed = Number(evt.target.value);
  });
  // 좌우 마진 반영해 각 요일별 폭죽 x좌표 등분
  for (let idx = 0; idx < 6; idx++) {
    eachDayX[idx] = ((width - mx[0] - mx[1]) / 7) * (idx + 1) + mx[0];
  }

  gravity = createVector(0, 0.1);
  console.log(eachDayX);

  // background(255);

  pg = createGraphics(width, height);
}

const timer = (adder) => {
  // 타이머 오름
  timeInFrame += adder;
  // 시간을 기준으로 몇번째 날인지 계산
  const calcedTodayNth = parseInt(timeInFrame / eachDayInTime);
  // 이전 날짜랑 비교해서 날짜 달라졌다면
  if (calcedTodayNth !== lastDayNth) {
    // 몇 일이 지나버렸는지 계산
    const howManyDayPassed = calcedTodayNth - lastDayNth;
    // 지나버린 날짜만큼 반복
    for (
      let eachDayPassed = 0;
      eachDayPassed < howManyDayPassed;
      eachDayPassed++
    ) {
      // 몇 번째 날짜인지 변수 업데이트
      todayNth = lastDayNth + eachDayPassed + 1;
      // 해당 날짜가 몇번째 주인지 변수 업데이트
      weekNth = parseInt((todayNth - 1) / 6) + 1;

      // eachDayData의 최대 인덱스를 초과하면 중지하도록.
      // 조회하려는 인덱스가 어레이 크기와 같거나 더 크면 그만하도록.
      // 최대 인덱스 = 어레이.length -1
      if (todayNth - 1 >= eachDayData.length) return;

      // ----- 월과 요일을 출력
      month = eachDayData[todayNth - 1].month; // 터지는 이유------ 문제
      day = eachDayData[todayNth - 1].day;
      // console.log(`${month} 월 ${day} 일`);

      // 주차 업데이트 ---------
      if (weekNth <= weekText.length) {
        thisWeekText = weekText[weekNth - 1];
        thisWeekText2 = weekText2[weekNth - 1];
      }

      // 인덱스로 환산
      const idxForEachDayData = todayNth - 1;
      const idxForWinningNums = weekNth - 1;
      // 오늘자 데이터와 해당하는 주차 당첨정보 가져오기
      const todaysData = eachDayData[idxForEachDayData];
      const thisWeekWinningNum = winningNums[idxForWinningNums];
      // 위 둘 중 하나라도 정보가 없으면 그만함 안그러면 터짐
      if (todaysData === undefined || thisWeekWinningNum === undefined) break;
      // 데이터베이스에 계산된 날짜, 주차 정보 추가
      todaysData.dayNth = todayNth;
      todaysData.weekNth = weekNth;

      todaysData.month = month; //----- '월'을 추가하고 싶었다 : 전승리
      todaysData.day = day; //----- '일'을 추가하고 싶었다 : 전승리

      thisWeekWinningNum.weekNth = weekNth;
      // 하루에 몇개나 맞췄는지 담을 변수
      let sumHowManyMached = 0;
      // 각 조별 몇개나 맞췄는지 담을 변수
      todaysData.howManyMached = [];
      // 각 조별로 함수 실행
      todaysData.lottoSequences.forEach((eachLottoSequence, idx) => {
        // 이번 조에서 몇개나 맞췄는지 담을 변수에 만든 함수를 통한 결과 담기
        const howManyMached = comparingWinningNum(
          eachLottoSequence,
          thisWeekWinningNum.winningSequence
        );
        // 이번 조의 당첨 결과를 어레이에 푸쉬
        todaysData.howManyMached.push(howManyMached);
        // 이번 조의 당첨 결과를 변수에 누적 (하루 집계용)
        sumHowManyMached += howManyMached;
      });
      // 각 조별로 계산이 끝난 결과를 데이터베이스에 추가
      todaysData.sumHowManyMached = sumHowManyMached;
      // console.log(todaysData, thisWeekWinningNum);
      // console.log(todaysData.howManyMached);
      calcMoney(todaysData.howManyMached);
      console.log(money);
      fireworks.push(new Fireworks(todaysData, thisWeekWinningNum));
    }
  }
  lastDayNth = calcedTodayNth;
};
//당첨금
let money = 0;

const calcMoney = (matchNumArry) => {
  matchNumArry.forEach((eachMatchNum) => {
    if (eachMatchNum === 1) {
      money += 1000;
    } else if (eachMatchNum === 2) {
      money += 5000;
    }
  });
};

const comparingWinningNum = (aSequence, winningSequence) => {
  let cnt = 0;
  for (let idx = 5; idx >= 0; idx--) {
    if (aSequence[idx] !== winningSequence[idx]) break;
    cnt++;
  }
  return cnt;
};

function draw() {
  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].update(gravity, windMag, frictionC);
    if (fireworks[idx].isDead) {
      fireworks.splice(idx, 1);
      // console.log(fireworks.length);
    }
  }
  background(0, 10);
  timer(timeSpeed);
  for (let idx = fireworks.length - 1; idx >= 0; idx--) {
    fireworks[idx].display();
  }
  //요일
  const weekdays = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'];
  pg.clear();
  pg.textFont('inter');
  pg.fill(255);
  pg.textSize(18);
  pg.textAlign(CENTER);

  for (let idx = 0; idx < weekdays.length; idx++) {
    pg.text(weekdays[idx], eachDayX[idx], height - 40);
  }
  // 데이터
  pg.textFont('inter');
  pg.textSize(14);
  pg.textAlign(LEFT);
  pg.text(`${month}   월    ${day}   일`, 40, 50);
  pg.text(`${weekNth}   주    ${todayNth}   일째`, 40, 75);
  // 당첨 1등
  pg.textFont('inter');
  pg.textSize(18);
  pg.textAlign(CENTER);
  pg.text(`${thisWeekText}`, width / 2, 78);
  // 회차
  pg.textAlign(CENTER);
  pg.textSize(26);
  pg.textFont('establishRetrosans');
  pg.text(`${thisWeekText2}`, width / 2, 50);

  //점선
  const numLines = Math.floor(height / 10) + 1;
  const dashLength = 5; // 점선의 간격
  // 행운 점수
  for (let y = 0; y < numLines; y++) {
    const yPos = 160 + y * 63;
    const yyPos = 163 + y * 63;
    pg.textFont('inter');
    pg.textSize(14);
    pg.textAlign(LEFT);
    pg.textStyle(NORMAL);
    const num = 100 - y * 10;
    if (num > 0) {
      pg.text(num, 45, yPos + 10);
    }

    if (num < 10) {
      continue;
    }

    if (y < numLines - 1) {
      pg.stroke(100);
      for (let x = 80; x <= width - 80; x += dashLength * 2) {
        pg.line(x, yyPos, x + dashLength, yyPos);
      }
    }

    pg.noStroke();
  }

  //  당첨금
  pg.textFont('inter');
  pg.textAlign(RIGHT);
  pg.textSize(18);
  pg.fill(60, 230, 0);
  pg.text(`${money}  원`, width - 80, 70);

  image(pg, 0, 0);
}
