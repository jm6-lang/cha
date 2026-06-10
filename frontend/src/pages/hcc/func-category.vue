<template>
  <view class="container">
    <!-- 分类头部 -->
    <view class="category-header">
      <view class="category-icon-wrap" :style="{ background: categoryInfo.bgColor }">
        <text class="category-icon">{{ categoryInfo.icon }}</text>
      </view>
      <view class="category-info">
        <text class="category-name">{{ categoryInfo.name }}</text>
        <text class="category-desc">共 {{ services.length }} 项服务</text>
      </view>
    </view>

    <!-- 服务列表 -->
    <view class="service-list">
      <view
        v-for="(svc, i) in services"
        :key="i"
        class="service-item"
        @tap="onServiceTap(svc)"
      >
        <view class="svc-left">
          <view class="svc-icon-wrap" :style="{ background: svc.bgColor }">
            <text class="svc-icon">{{ svc.icon }}</text>
          </view>
          <view class="svc-info">
            <view class="svc-name-row">
              <text class="svc-name">{{ svc.name }}</text>
              <view v-if="svc.tag" class="svc-tag" :style="{ background: svc.tagBg, color: svc.tagColor }">
                <text class="svc-tag-text">{{ svc.tag }}</text>
              </view>
            </view>
            <text class="svc-desc">{{ svc.desc }}</text>
          </view>
        </view>
        <view class="svc-right">
          <text class="svc-price" v-if="svc.price">{{ svc.price }}</text>
          <text class="svc-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const typeCode = ref('');

onLoad((q: any) => {
  typeCode.value = q?.typeCode || '';
});

// 分类元信息
const categoryMap: Record<string, { name: string; icon: string; bgColor: string }> = {
  identity: { name: '身份核验', icon: '🛡️', bgColor: '#E8F5E9' },
  carrier: { name: '号码服务', icon: '📱', bgColor: '#E3F2FD' },
  marriage: { name: '婚姻情感', icon: '💍', bgColor: '#FCE4EC' },
  risk: { name: '司法涉诉', icon: '⚖️', bgColor: '#F3E5F5' },
  finance: { name: '金融风控', icon: '💳', bgColor: '#E0F7FA' },
  car: { name: '车辆查询', icon: '🚗', bgColor: '#FFF3E0' },
  package: { name: '企业查询', icon: '🏢', bgColor: '#E8EAF6' },
  report: { name: '专业报告', icon: '📊', bgColor: '#F1F8E9' },
};

const categoryInfo = computed(() => {
  return categoryMap[typeCode.value] || { name: '功能分类', icon: '📋', bgColor: '#F5F7FA' };
});

// 各分类服务数据
const serviceData: Record<string, Array<{
  name: string;
  icon: string;
  bgColor: string;
  desc: string;
  price: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  typeCode: string;
}>> = {
  identity: [
    { name: '实名核验', icon: '🪪', bgColor: '#E8F5E9', desc: '验证姓名与身份证号是否匹配', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '人像比对', icon: '📷', bgColor: '#E8F5E9', desc: '身份证照片与本人人脸比对', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '身份证二要素', icon: '🪪', bgColor: '#E8F5E9', desc: '身份证姓名与号码一致性核验', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '手机三要素', icon: '📱', bgColor: '#E3F2FD', desc: '姓名+身份证+手机号一致性核验', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '银行卡三要素', icon: '💳', bgColor: '#E0F7FA', desc: '姓名+身份证+银行卡一致性核验', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '护照核验', icon: '📘', bgColor: '#E3F2FD', desc: '护照信息真伪核验', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '驾照核验', icon: '🚘', bgColor: '#FFF3E0', desc: '驾驶证信息真伪核验', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '学历查询', icon: '🎓', bgColor: '#F1F8E9', desc: '学历证书真伪查询', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '个人征信', icon: '👤', bgColor: '#E0F7FA', desc: '个人征信报告查询', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'identity' },
    { name: '社交账号检测', icon: '⭐', bgColor: '#FFF3E0', desc: '社交平台账号真实性检测', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
    { name: '虚假号码识别', icon: '🚫', bgColor: '#FFEBEE', desc: '识别虚假/虚拟手机号码', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'identity' },
  ],
  carrier: [
    { name: '号码标记查询', icon: '📱', bgColor: '#E3F2FD', desc: '查询手机号码的标记信息', price: '免费', tag: '免费', tagBg: '#E8F8EF', tagColor: '#07C160', typeCode: 'carrier' },
    { name: '号码归属地', icon: '📍', bgColor: '#E3F2FD', desc: '查询手机号码归属地信息', price: '免费', tag: '免费', tagBg: '#E8F8EF', tagColor: '#07C160', typeCode: 'carrier' },
    { name: '清除标记', icon: '✅', bgColor: '#E8F5E9', desc: '消除错误标记，恢复号码信誉', price: '¥5-28', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'carrier' },
    { name: '号码估值', icon: '💎', bgColor: '#FFF3E0', desc: '靓号评估与价值分析', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
    { name: '号码状态', icon: '🔄', bgColor: '#E3F2FD', desc: '查询手机号码在网状态', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
    { name: '运营商认证', icon: '📶', bgColor: '#E3F2FD', desc: '运营商实名认证查询', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
    { name: '携号转网', icon: '🔀', bgColor: '#F3E5F5', desc: '查询号码携号转网状态', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
    { name: '虚拟号码检测', icon: '💳', bgColor: '#E0F7FA', desc: '检测虚拟运营商号码', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
    { name: '骚扰电话识别', icon: '📵', bgColor: '#FFEBEE', desc: '识别骚扰/诈骗电话号码', price: '免费', tag: '免费', tagBg: '#E8F8EF', tagColor: '#07C160', typeCode: 'carrier' },
    { name: '亲情号码', icon: '📞', bgColor: '#FCE4EC', desc: '查询号码关联亲情号码', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'carrier' },
  ],
  marriage: [
    { name: '婚姻状态查询', icon: '💍', bgColor: '#FCE4EC', desc: '查询个人婚姻登记状态', price: '¥2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'marriage' },
    { name: '婚恋交友核验', icon: '💑', bgColor: '#FCE4EC', desc: '核实对方真实身份与婚姻状况', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
    { name: '婚姻登记查询', icon: '📜', bgColor: '#FFF3E0', desc: '查询婚姻登记记录信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
    { name: '离婚记录查询', icon: '💍', bgColor: '#FCE4EC', desc: '查询离婚登记记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
    { name: '重婚查询', icon: '✅', bgColor: '#E8F5E9', desc: '查询是否存在重婚记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
    { name: '情感风险评估', icon: '💑', bgColor: '#FCE4EC', desc: '评估情感关系风险等级', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'marriage' },
    { name: '伴侣背调', icon: '✅', bgColor: '#E8F5E9', desc: '全面伴侣背景调查', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'marriage' },
    { name: '婚前调查', icon: '💑', bgColor: '#FCE4EC', desc: '婚前全面背景调查', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'marriage' },
  ],
  risk: [
    { name: '司法诉讼查询', icon: '⚖️', bgColor: '#F3E5F5', desc: '查询个人或企业涉诉信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '法院公告', icon: '🔨', bgColor: '#F3E5F5', desc: '查询法院公告信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '失信被执行人', icon: '🚫', bgColor: '#FFEBEE', desc: '查询老赖失信被执行人信息', price: '¥2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'risk' },
    { name: '限制高消费', icon: '⛔', bgColor: '#FFEBEE', desc: '查询限制高消费人员信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '裁判文书', icon: '⚖️', bgColor: '#F3E5F5', desc: '查询裁判文书信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '开庭公告', icon: '🚔', bgColor: '#F3E5F5', desc: '查询开庭公告信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '执行信息', icon: '🚔', bgColor: '#F3E5F5', desc: '查询执行案件信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '司法拍卖', icon: '📱', bgColor: '#E3F2FD', desc: '查询司法拍卖标的物信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '立案信息', icon: '🎲', bgColor: '#FFF3E0', desc: '查询案件立案信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '行政处罚', icon: '⚡', bgColor: '#FFF3E0', desc: '查询行政处罚记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '税务违法', icon: '🏴', bgColor: '#F3E5F5', desc: '查询税务违法记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '网贷黑名单', icon: '⚖️', bgColor: '#F3E5F5', desc: '查询网贷黑名单信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'risk' },
    { name: '涉诉风险评估', icon: '🎲', bgColor: '#FFF3E0', desc: '综合评估涉诉风险等级', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'risk' },
  ],
  finance: [
    { name: '个人信用报告', icon: '📊', bgColor: '#E0F7FA', desc: '全面个人信用风险评估报告', price: '¥2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'finance' },
    { name: '多头借贷检测', icon: '🔍', bgColor: '#E0F7FA', desc: '检测是否存在多头借贷行为', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '网贷记录查询', icon: '💳', bgColor: '#E0F7FA', desc: '查询网贷平台借贷记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '逾期记录查询', icon: '💳', bgColor: '#E0F7FA', desc: '查询逾期还款记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '银行卡黑名单', icon: '✅', bgColor: '#E8F5E9', desc: '查询银行卡是否在黑名单中', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '反欺诈检测', icon: '📊', bgColor: '#E0F7FA', desc: '综合反欺诈风险评估', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: 'P2P记录', icon: '🏦', bgColor: '#E8EAF6', desc: '查询P2P平台借贷记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '小贷记录', icon: '🏦', bgColor: '#E8EAF6', desc: '查询小额贷款记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '消费金融', icon: '🏦', bgColor: '#E8EAF6', desc: '查询消费金融借贷记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '信用评分', icon: '🎯', bgColor: '#FFF3E0', desc: '个人信用评分查询', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '资产调查', icon: '📁', bgColor: '#FFF3E0', desc: '个人资产状况调查', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'finance' },
    { name: '企业信用', icon: '📊', bgColor: '#E0F7FA', desc: '企业信用评级查询', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '个人破产', icon: '✅', bgColor: '#E8F5E9', desc: '查询个人破产记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '网贷催收', icon: '⛔', bgColor: '#FFEBEE', desc: '查询网贷催收记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '风险画像', icon: '📈', bgColor: '#E0F7FA', desc: '个人风险画像分析', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '关联风险', icon: '💳', bgColor: '#E0F7FA', desc: '关联人风险传导分析', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '资金异常', icon: '🔍', bgColor: '#E0F7FA', desc: '资金流水异常检测', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '洗钱风险', icon: '📱', bgColor: '#E3F2FD', desc: '反洗钱风险评估', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'finance' },
    { name: '投资风险', icon: '💰', bgColor: '#FFF3E0', desc: '投资理财风险评估', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'finance' },
    { name: '征信修复', icon: '✅', bgColor: '#E8F5E9', desc: '征信修复方案咨询', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'finance' },
    { name: '风险综合评估', icon: '🔍', bgColor: '#E0F7FA', desc: '全面风险综合评估报告', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'finance' },
  ],
  car: [
    { name: '车辆信息查询', icon: '🚗', bgColor: '#FFF3E0', desc: '查询车辆基本信息与状态', price: '¥2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'car' },
    { name: '车辆违章查询', icon: '🚕', bgColor: '#FFF3E0', desc: '查询车辆违章记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆估值', icon: '📏', bgColor: '#FFF3E0', desc: '车辆市场价值评估', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆出险记录', icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆保险出险记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆年检', icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆年检信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆过户记录', icon: '🔍', bgColor: '#E0F7FA', desc: '查询车辆过户历史记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '驾驶证扣分', icon: '🛣️', bgColor: '#E8EAF6', desc: '查询驾驶证扣分情况', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆抵押', icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆抵押状态信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆保险', icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆保险信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '二手车检测', icon: '🔧', bgColor: '#F1F8E9', desc: '二手车全面检测报告', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'car' },
    { name: '车牌归属', icon: '🔄', bgColor: '#E3F2FD', desc: '查询车牌归属地信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '事故记录', icon: '✅', bgColor: '#E8F5E9', desc: '查询车辆事故记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '维保记录', icon: '💥', bgColor: '#FFEBEE', desc: '查询车辆维修保养记录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '车辆召回', icon: '✅', bgColor: '#E8F5E9', desc: '查询车辆召回信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '新车比价', icon: '🚗', bgColor: '#FFF3E0', desc: '新车价格对比查询', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
    { name: '违章代缴', icon: '✅', bgColor: '#E8F5E9', desc: '违章罚款代缴服务', price: '¥2.9+服务费', tag: '', tagBg: '', tagColor: '', typeCode: 'car' },
  ],
  package: [
    { name: '企业工商信息', icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业工商注册详细信息', price: '¥2.9', tag: '热门', tagBg: '#FFF0E8', tagColor: '#FF8F1F', typeCode: 'package' },
    { name: '企业关联关系', icon: '🔗', bgColor: '#E8EAF6', desc: '查询企业股东与投资关系', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业股东信息', icon: '👔', bgColor: '#E8EAF6', desc: '查询企业股东详细信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业风险扫描', icon: '💰', bgColor: '#FFF3E0', desc: '全面扫描企业经营风险', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'package' },
    { name: '企业经营异常', icon: '🏠', bgColor: '#FFEBEE', desc: '查询企业经营异常名录', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业失信查询', icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业失信被执行信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业法人查询', icon: '👤', bgColor: '#E8F5E9', desc: '查询企业法定代表人信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业年报', icon: '📊', bgColor: '#E0F7FA', desc: '查询企业年报信息', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
    { name: '企业对外投资', icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业对外投资情况', price: '¥2.9', tag: '', tagBg: '', tagColor: '', typeCode: 'package' },
  ],
  report: [
    { name: '深度背调报告', icon: '📋', bgColor: '#F1F8E9', desc: '全面个人背景调查报告', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'report' },
    { name: '企业尽调报告', icon: '📊', bgColor: '#F1F8E9', desc: '企业尽职调查深度报告', price: '¥5.9', tag: '专业', tagBg: '#E8F0FF', tagColor: '#1A6CFF', typeCode: 'report' },
  ],
};

const services = computed(() => {
  return serviceData[typeCode.value] || [];
});

function onServiceTap(svc: any) {
  uni.navigateTo({
    url: `/pages/hcc/func-query?typeCode=${svc.typeCode}&name=${encodeURIComponent(svc.name)}`,
  });
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 24rpx;
  background: $bg-page;
  min-height: 100vh;
}

/* 分类头部 */
.category-header {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.category-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.category-icon {
  font-size: 48rpx;
}

.category-info {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4rpx;
}

.category-desc {
  font-size: 26rpx;
  color: $text-tertiary;
}

/* 服务列表 */
.service-list {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 8rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $border;
}

.service-item:last-child {
  border-bottom: none;
}

.svc-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.svc-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.svc-icon {
  font-size: 36rpx;
}

.svc-info {
  flex: 1;
  min-width: 0;
}

.svc-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.svc-name {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 500;
}

.svc-tag {
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  flex-shrink: 0;
}

.svc-tag-text {
  font-size: 20rpx;
  font-weight: 500;
}

.svc-desc {
  font-size: 24rpx;
  color: $text-tertiary;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.svc-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.svc-price {
  font-size: 28rpx;
  color: $danger;
  font-weight: 600;
  margin-right: 8rpx;
}

.svc-arrow {
  color: $text-tertiary;
  font-size: 32rpx;
}
</style>
