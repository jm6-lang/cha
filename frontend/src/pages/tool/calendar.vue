<template>
  <view class="page">
    <view class="header">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="header-content">
        <view class="header-icon">📅</view>
        <text class="header-title">万年历</text>
        <text class="header-desc">农历 节日 二十四节气</text>
      </view>
    </view>

    <view class="calendar-card">
      <view class="cal-header">
        <view class="cal-nav" @tap="changeMonth(-1)">
          <text class="cal-nav-icon">‹</text>
        </view>
        <view class="cal-title-block">
          <text class="cal-title">{{ year }}年{{ month }}月</text>
          <text class="cal-sub">{{ lunarMonth }}{{ lunarDay }} · {{ weekDayName }}</text>
        </view>
        <view class="cal-nav" @tap="changeMonth(1)">
          <text class="cal-nav-icon">›</text>
        </view>
      </view>

      <view class="cal-weekdays">
        <text
          v-for="w in weekdays"
          :key="w"
          class="cal-weekday"
          :class="{ weekend: w === '日' || w === '六' }"
        >{{ w }}</text>
      </view>

      <view class="cal-days">
        <view
          v-for="(d, i) in days"
          :key="i"
          class="cal-day"
          :class="{
            empty: !d,
            today: d && isToday(d.day),
            selected: d && d.day === selectedDay,
            weekend: d && (d.weekday === 0 || d.weekday === 6)
          }"
          @tap="d && onDayTap(d)"
        >
          <text class="day-solar">{{ d ? d.day : '' }}</text>
          <text v-if="d && d.lunar" class="day-lunar">{{ d.lunar }}</text>
          <view v-if="d && d.holiday" class="day-holiday-dot" />
        </view>
      </view>
    </view>

    <view class="info-card">
      <text class="info-title">{{ year }}年{{ month }}月{{ selectedDay }}日</text>
      <view class="info-row">
        <text class="info-label">农历</text>
        <text class="info-value">{{ lunarMonth }}{{ lunarDay }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">星期</text>
        <text class="info-value">{{ weekDayName }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">生肖</text>
        <text class="info-value">{{ zodiac }}年</text>
      </view>
      <view class="info-row">
        <text class="info-label">星座</text>
        <text class="info-value">{{ constellation }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">宜</text>
        <text class="info-value yi-text">{{ yi }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">忌</text>
        <text class="info-value ji-text">{{ ji }}</text>
      </view>
    </view>

    <view class="holiday-card">
      <text class="section-title">本月节日</text>
      <view
        v-for="h in monthHolidays"
        :key="h.name"
        class="holiday-item"
      >
        <text class="holiday-date">{{ h.date }}</text>
        <text class="holiday-name">{{ h.name }}</text>
        <text class="holiday-days">距今 {{ h.days }} 天</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const statusBarHeight = ref(44);
const sysInfo = uni.getSystemInfoSync();
statusBarHeight.value = sysInfo.statusBarHeight || 44;

const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 1);
const selectedDay = ref(now.getDate());

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const YI_ARR = ['祭祀 出行 动土', '祈福 嫁娶 修造', '开市 安床 出行', '解除 纳财 交易', '入殓 移柩 安葬', '求医 治病 服药'];
const JI_ARR = ['开仓 掘井', '动土 安葬', '嫁娶 入宅', '出行 修造', '开市 动土', '嫁娶 出行'];

const days = computed(() => {
  const firstDay = new Date(year.value, month.value - 1, 1);
  const lastDay = new Date(year.value, month.value, 0);
  const firstWeekday = firstDay.getDay();
  const daysCount = lastDay.getDate();

  const arr: any[] = [];
  // 前面空格
  for (let i = 0; i < firstWeekday; i++) arr.push(null);
  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(year.value, month.value - 1, i);
    const offset = (date.getTime() - new Date(1900, 0, 31).getTime()) / 86400000;
    const lunarIdx = Math.floor((offset + 40) % 30);
    const lunarMonthIdx = Math.floor((offset + 40) / 30) % 12;
    const lunarText = i === 1 ? `${LUNAR_MONTHS[lunarMonthIdx]}月` : (i % 5 === 0 ? LUNAR_DAYS[lunarIdx] : '');

    arr.push({
      day: i,
      weekday: date.getDay(),
      lunar: lunarText,
      holiday: i === 1 || i === 11 || i === 24 ? '节' : '',
    });
  }
  return arr;
});

const lunarMonth = computed(() => LUNAR_MONTHS[(month.value + 1) % 12]);
const lunarDay = computed(() => LUNAR_DAYS[selectedDay.value % 30]);
const weekDayName = computed(() => {
  const d = new Date(year.value, month.value - 1, selectedDay.value);
  return `星期${weekdays[d.getDay()]}`;
});
const zodiac = computed(() => ZODIACS[(year.value - 4) % 12]);
const constellation = computed(() => {
  const m = month.value;
  const d = selectedDay.value;
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
  const names = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯'];
  return d < dates[m - 1] ? names[m - 1] : names[m];
});

const yi = computed(() => YI_ARR[selectedDay.value % YI_ARR.length]);
const ji = computed(() => JI_ARR[selectedDay.value % JI_ARR.length]);

const monthHolidays = computed(() => {
  const arr = [
    { date: `${month.value}月1日`, name: '国际劳动节', days: 30 },
    { date: `${month.value}月4日`, name: '青年节', days: 30 },
  ];
  if (month.value === 12) {
    arr.push({ date: '12月25日', name: '圣诞节', days: 24 });
    arr.push({ date: '12月31日', name: '跨年夜', days: 30 });
  }
  return arr;
});

function isToday(d: number) {
  return year.value === now.getFullYear() && month.value === now.getMonth() + 1 && d === now.getDate();
}

function onDayTap(d: any) {
  selectedDay.value = d.day;
}

function changeMonth(delta: number) {
  let m = month.value + delta;
  let y = year.value;
  if (m > 12) { m = 1; y++; }
  if (m < 1) { m = 12; y--; }
  month.value = m;
  year.value = y;
  selectedDay.value = 1;
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(180deg, #5C6BC0 0%, #3949AB 100%);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0 40rpx;
}

.header-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

/* 日历 */
.calendar-card {
  background: $bg-card;
  margin: -28rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 20rpx;
}

.cal-nav {
  width: 64rpx;
  height: 64rpx;
  background: $bg-grey;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-nav-icon {
  font-size: 40rpx;
  color: $text-primary;
  font-weight: 300;
}

.cal-title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.cal-sub {
  font-size: 22rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
}

.cal-weekdays {
  display: flex;
  padding: 12rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.cal-weekday {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: $text-tertiary;
}

.cal-weekday.weekend {
  color: $danger;
}

.cal-days {
  display: flex;
  flex-wrap: wrap;
}

.cal-day {
  width: 14.2857%;
  height: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8rpx 0;
}

.cal-day.empty {
  visibility: hidden;
}

.day-solar {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 500;
}

.cal-day.weekend .day-solar {
  color: $danger;
}

.cal-day.today {
  background: rgba(26, 108, 255, 0.1);
  border-radius: $radius-md;
}

.cal-day.selected {
  background: $info;
  border-radius: $radius-md;
}

.cal-day.selected .day-solar {
  color: #fff;
  font-weight: 700;
}

.day-lunar {
  font-size: 18rpx;
  color: $text-tertiary;
  margin-top: 2rpx;
}

.cal-day.selected .day-lunar {
  color: rgba(255, 255, 255, 0.85);
}

.day-holiday-dot {
  position: absolute;
  top: 8rpx;
  right: 12rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: $danger;
}

/* 信息 */
.info-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.info-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid $border;
}

.info-row {
  display: flex;
  padding: 12rpx 0;
}

.info-label {
  font-size: 28rpx;
  color: $text-tertiary;
  width: 120rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 28rpx;
  color: $text-primary;
  flex: 1;
}

.yi-text {
  color: $primary;
  font-weight: 500;
}

.ji-text {
  color: $danger;
  font-weight: 500;
}

/* 节日 */
.holiday-card {
  background: $bg-card;
  margin: 20rpx 24rpx 0;
  border-radius: $radius-lg;
  padding: 24rpx 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
  border-left: 6rpx solid $info;
  line-height: 1;
}

.holiday-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $border-light;
}

.holiday-item:last-child {
  border-bottom: none;
}

.holiday-date {
  font-size: 24rpx;
  color: $text-tertiary;
  width: 140rpx;
  flex-shrink: 0;
}

.holiday-name {
  font-size: 28rpx;
  color: $text-primary;
  flex: 1;
}

.holiday-days {
  font-size: 22rpx;
  color: $danger;
  font-weight: 500;
}
</style>
