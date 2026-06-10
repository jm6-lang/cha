<template>
  <view class="container">
    <!-- 服务信息卡片 -->
    <view class="service-card">
      <view class="service-header">
        <view class="service-icon-wrap" :style="{ background: serviceInfo.bgColor }">
          <text class="service-icon">{{ serviceInfo.icon }}</text>
        </view>
        <view class="service-info">
          <text class="service-name">{{ name }}</text>
          <text class="service-desc">{{ serviceInfo.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 查询表单 -->
    <view class="form-card">
      <view class="form-title">查询信息</view>

      <!-- carrier: 手机号码 -->
      <view v-if="typeCode === 'carrier'" class="form-group">
        <text class="form-label">手机号码</text>
        <input
          v-model="form.phone"
          class="form-input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号码"
          placeholder-class="form-placeholder"
        />
      </view>

      <!-- identity: 姓名+身份证号 -->
      <template v-if="typeCode === 'identity'">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="请输入姓名"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idCard"
            class="form-input"
            maxlength="18"
            placeholder="请输入身份证号码"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- marriage: 姓名+身份证号 -->
      <template v-if="typeCode === 'marriage'">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="请输入姓名"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idCard"
            class="form-input"
            maxlength="18"
            placeholder="请输入身份证号码"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- risk: 姓名+身份证号 或 手机号 -->
      <template v-if="typeCode === 'risk'">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="请输入姓名"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idCard"
            class="form-input"
            maxlength="18"
            placeholder="请输入身份证号码"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-divider">
          <text class="form-divider-text">或</text>
        </view>
        <view class="form-group">
          <text class="form-label">手机号码</text>
          <input
            v-model="form.phone"
            class="form-input"
            type="number"
            maxlength="11"
            placeholder="请输入手机号码（与身份证号二选一）"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- finance: 姓名+身份证号 -->
      <template v-if="typeCode === 'finance'">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="请输入姓名"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idCard"
            class="form-input"
            maxlength="18"
            placeholder="请输入身份证号码"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- car: 车牌号+车架号 -->
      <template v-if="typeCode === 'car'">
        <view class="form-group">
          <text class="form-label">车牌号</text>
          <input
            v-model="form.plateNo"
            class="form-input"
            placeholder="请输入车牌号（如：京A12345）"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">车架号</text>
          <input
            v-model="form.vin"
            class="form-input"
            maxlength="17"
            placeholder="请输入车架号（VIN码）"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- package: 企业名称/统一社会信用代码 -->
      <template v-if="typeCode === 'package'">
        <view class="form-group">
          <text class="form-label">企业名称</text>
          <input
            v-model="form.companyName"
            class="form-input"
            placeholder="请输入企业名称"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-divider">
          <text class="form-divider-text">或</text>
        </view>
        <view class="form-group">
          <text class="form-label">统一社会信用代码</text>
          <input
            v-model="form.creditCode"
            class="form-input"
            maxlength="18"
            placeholder="请输入统一社会信用代码"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- report: 姓名+身份证号 -->
      <template v-if="typeCode === 'report'">
        <view class="form-group">
          <text class="form-label">姓名</text>
          <input
            v-model="form.name"
            class="form-input"
            placeholder="请输入姓名"
            placeholder-class="form-placeholder"
          />
        </view>
        <view class="form-group">
          <text class="form-label">身份证号</text>
          <input
            v-model="form.idCard"
            class="form-input"
            maxlength="18"
            placeholder="请输入身份证号码"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- 银行卡核验字段（银行卡三要素/银行卡四要素） -->
      <template v-if="name === '银行卡三要素' || name === '银行卡四要素'">
        <view class="form-group">
          <text class="form-label">银行卡号</text>
          <input
            v-model="form.bankCard"
            class="form-input"
            type="number"
            maxlength="19"
            placeholder="请输入银行卡号"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>

      <!-- IP 归属地查询 -->
      <template v-if="name === 'IP归属地查询'">
        <view class="form-group">
          <text class="form-label">IP地址</text>
          <input
            v-model="form.ip"
            class="form-input"
            placeholder="请输入IP地址（如：8.8.8.8）"
            placeholder-class="form-placeholder"
          />
        </view>
      </template>
    </view>

    <!-- 底部操作区 -->
    <view class="bottom-area">
      <view class="price-row">
        <text class="price-label">查询费用：</text>
        <text class="price-value">{{ serviceInfo.price }}</text>
      </view>
      <view class="query-btn" @tap="onQuery">
        <text class="query-btn-text">立即查询</text>
      </view>
    </view>

    <!-- 免责声明 -->
    <view class="disclaimer">
      <text class="disclaimer-text">免责声明：本平台查询结果仅供参考，不构成任何法律依据。用户需确保查询行为合法合规，因不当使用造成的后果由用户自行承担。请勿用于非法用途。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import {
  queryPhoneLabels,
  queryIdCardLocation,
  queryCompanyInfo,
  queryCarInfo,
  queryDishonest,
  queryBankInfo,
  queryIpLocation,
} from '@/api/free-apis';

const typeCode = ref('');
const name = ref('');

onLoad((q: any) => {
  typeCode.value = q?.typeCode || '';
  name.value = q?.name ? decodeURIComponent(q.name) : '';
});

const form = reactive({
  name: '',
  idCard: '',
  phone: '',
  plateNo: '',
  vin: '',
  companyName: '',
  creditCode: '',
  bankCard: '',
  ip: '',
});

// 服务信息映射
const serviceInfoMap: Record<string, Record<string, { icon: string; bgColor: string; desc: string; price: string }>> = {
  identity: {
    '实名核验': { icon: '🪪', bgColor: '#E8F5E9', desc: '验证姓名与身份证号是否匹配', price: '¥2.9' },
    '人像比对': { icon: '📷', bgColor: '#E8F5E9', desc: '身份证照片与本人人脸比对', price: '¥2.9' },
    '身份证二要素': { icon: '🪪', bgColor: '#E8F5E9', desc: '身份证姓名与号码一致性核验', price: '¥2.9' },
    '手机三要素': { icon: '📱', bgColor: '#E3F2FD', desc: '姓名+身份证+手机号一致性核验', price: '¥2.9' },
    '银行卡三要素': { icon: '💳', bgColor: '#E0F7FA', desc: '姓名+身份证+银行卡一致性核验', price: '¥2.9' },
    '护照核验': { icon: '📘', bgColor: '#E3F2FD', desc: '护照信息真伪核验', price: '¥2.9' },
    '驾照核验': { icon: '🚘', bgColor: '#FFF3E0', desc: '驾驶证信息真伪核验', price: '¥2.9' },
    '学历查询': { icon: '🎓', bgColor: '#F1F8E9', desc: '学历证书真伪查询', price: '¥2.9' },
    '个人征信': { icon: '👤', bgColor: '#E0F7FA', desc: '个人征信报告查询', price: '¥2.9' },
    '社交账号检测': { icon: '⭐', bgColor: '#FFF3E0', desc: '社交平台账号真实性检测', price: '¥2.9' },
    '虚假号码识别': { icon: '🚫', bgColor: '#FFEBEE', desc: '识别虚假/虚拟手机号码', price: '¥2.9' },
  },
  carrier: {
    '号码标记查询': { icon: '📱', bgColor: '#E3F2FD', desc: '查询手机号码的标记信息', price: '免费' },
    '号码归属地': { icon: '📍', bgColor: '#E3F2FD', desc: '查询手机号码归属地信息', price: '免费' },
    '取消标记': { icon: '✅', bgColor: '#E8F5E9', desc: '消除错误标记，恢复号码信誉', price: '¥2.9' },
    '号码估值': { icon: '💎', bgColor: '#FFF3E0', desc: '靓号评估与价值分析', price: '¥2.9' },
    '号码状态': { icon: '🔄', bgColor: '#E3F2FD', desc: '查询手机号码在网状态', price: '¥2.9' },
    '运营商认证': { icon: '📶', bgColor: '#E3F2FD', desc: '运营商实名认证查询', price: '¥2.9' },
    '携号转网': { icon: '🔀', bgColor: '#F3E5F5', desc: '查询号码携号转网状态', price: '¥2.9' },
    '虚拟号码检测': { icon: '💳', bgColor: '#E0F7FA', desc: '检测虚拟运营商号码', price: '¥2.9' },
    '骚扰电话识别': { icon: '📵', bgColor: '#FFEBEE', desc: '识别骚扰/诈骗电话号码', price: '免费' },
    '亲情号码': { icon: '📞', bgColor: '#FCE4EC', desc: '查询号码关联亲情号码', price: '¥2.9' },
  },
  marriage: {
    '婚姻状态查询': { icon: '💍', bgColor: '#FCE4EC', desc: '查询个人婚姻登记状态', price: '¥2.9' },
    '婚恋交友核验': { icon: '💑', bgColor: '#FCE4EC', desc: '核实对方真实身份与婚姻状况', price: '¥2.9' },
    '婚姻登记查询': { icon: '📜', bgColor: '#FFF3E0', desc: '查询婚姻登记记录信息', price: '¥2.9' },
    '离婚记录查询': { icon: '💍', bgColor: '#FCE4EC', desc: '查询离婚登记记录', price: '¥2.9' },
    '重婚查询': { icon: '✅', bgColor: '#E8F5E9', desc: '查询是否存在重婚记录', price: '¥2.9' },
    '情感风险评估': { icon: '💑', bgColor: '#FCE4EC', desc: '评估情感关系风险等级', price: '¥2.9' },
    '伴侣背调': { icon: '✅', bgColor: '#E8F5E9', desc: '全面伴侣背景调查', price: '¥2.9' },
    '婚前调查': { icon: '💑', bgColor: '#FCE4EC', desc: '婚前全面背景调查', price: '¥2.9' },
  },
  risk: {
    '司法诉讼查询': { icon: '⚖️', bgColor: '#F3E5F5', desc: '查询个人或企业涉诉信息', price: '¥2.9' },
    '法院公告': { icon: '🔨', bgColor: '#F3E5F5', desc: '查询法院公告信息', price: '¥2.9' },
    '失信被执行人': { icon: '🚫', bgColor: '#FFEBEE', desc: '查询老赖失信被执行人信息', price: '¥2.9' },
    '限制高消费': { icon: '⛔', bgColor: '#FFEBEE', desc: '查询限制高消费人员信息', price: '¥2.9' },
    '裁判文书': { icon: '⚖️', bgColor: '#F3E5F5', desc: '查询裁判文书信息', price: '¥2.9' },
    '开庭公告': { icon: '🚔', bgColor: '#F3E5F5', desc: '查询开庭公告信息', price: '¥2.9' },
    '执行信息': { icon: '🚔', bgColor: '#F3E5F5', desc: '查询执行案件信息', price: '¥2.9' },
    '司法拍卖': { icon: '📱', bgColor: '#E3F2FD', desc: '查询司法拍卖标的物信息', price: '¥2.9' },
    '立案信息': { icon: '🎲', bgColor: '#FFF3E0', desc: '查询案件立案信息', price: '¥2.9' },
    '行政处罚': { icon: '⚡', bgColor: '#FFF3E0', desc: '查询行政处罚记录', price: '¥2.9' },
    '税务违法': { icon: '🏴', bgColor: '#F3E5F5', desc: '查询税务违法记录', price: '¥2.9' },
    '网贷黑名单': { icon: '⚖️', bgColor: '#F3E5F5', desc: '查询网贷黑名单信息', price: '¥2.9' },
    '涉诉风险评估': { icon: '🎲', bgColor: '#FFF3E0', desc: '综合评估涉诉风险等级', price: '¥2.9' },
  },
  finance: {
    '个人信用报告': { icon: '📊', bgColor: '#E0F7FA', desc: '全面个人信用风险评估报告', price: '¥2.9' },
    '多头借贷检测': { icon: '🔍', bgColor: '#E0F7FA', desc: '检测是否存在多头借贷行为', price: '¥2.9' },
    '网贷记录查询': { icon: '💳', bgColor: '#E0F7FA', desc: '查询网贷平台借贷记录', price: '¥2.9' },
    '逾期记录查询': { icon: '💳', bgColor: '#E0F7FA', desc: '查询逾期还款记录', price: '¥2.9' },
    '银行卡黑名单': { icon: '✅', bgColor: '#E8F5E9', desc: '查询银行卡是否在黑名单中', price: '¥2.9' },
    '反欺诈检测': { icon: '📊', bgColor: '#E0F7FA', desc: '综合反欺诈风险评估', price: '¥2.9' },
    'P2P记录': { icon: '🏦', bgColor: '#E8EAF6', desc: '查询P2P平台借贷记录', price: '¥2.9' },
    '小贷记录': { icon: '🏦', bgColor: '#E8EAF6', desc: '查询小额贷款记录', price: '¥2.9' },
    '消费金融': { icon: '🏦', bgColor: '#E8EAF6', desc: '查询消费金融借贷记录', price: '¥2.9' },
    '信用评分': { icon: '🎯', bgColor: '#FFF3E0', desc: '个人信用评分查询', price: '¥2.9' },
    '资产调查': { icon: '📁', bgColor: '#FFF3E0', desc: '个人资产状况调查', price: '¥2.9' },
    '企业信用': { icon: '📊', bgColor: '#E0F7FA', desc: '企业信用评级查询', price: '¥2.9' },
    '个人破产': { icon: '✅', bgColor: '#E8F5E9', desc: '查询个人破产记录', price: '¥2.9' },
    '网贷催收': { icon: '⛔', bgColor: '#FFEBEE', desc: '查询网贷催收记录', price: '¥2.9' },
    '风险画像': { icon: '📈', bgColor: '#E0F7FA', desc: '个人风险画像分析', price: '¥2.9' },
    '关联风险': { icon: '💳', bgColor: '#E0F7FA', desc: '关联人风险传导分析', price: '¥2.9' },
    '资金异常': { icon: '🔍', bgColor: '#E0F7FA', desc: '资金流水异常检测', price: '¥2.9' },
    '洗钱风险': { icon: '📱', bgColor: '#E3F2FD', desc: '反洗钱风险评估', price: '¥2.9' },
    '投资风险': { icon: '💰', bgColor: '#FFF3E0', desc: '投资理财风险评估', price: '¥2.9' },
    '征信修复': { icon: '✅', bgColor: '#E8F5E9', desc: '征信修复方案咨询', price: '¥2.9' },
    '风险综合评估': { icon: '🔍', bgColor: '#E0F7FA', desc: '全面风险综合评估报告', price: '¥2.9' },
  },
  car: {
    '车辆信息查询': { icon: '🚗', bgColor: '#FFF3E0', desc: '查询车辆基本信息与状态', price: '¥2.9' },
    '车辆违章查询': { icon: '🚕', bgColor: '#FFF3E0', desc: '查询车辆违章记录', price: '¥2.9' },
    '车辆估值': { icon: '📏', bgColor: '#FFF3E0', desc: '车辆市场价值评估', price: '¥2.9' },
    '车辆出险记录': { icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆保险出险记录', price: '¥2.9' },
    '车辆年检': { icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆年检信息', price: '¥2.9' },
    '车辆过户记录': { icon: '🔍', bgColor: '#E0F7FA', desc: '查询车辆过户历史记录', price: '¥2.9' },
    '驾驶证扣分': { icon: '🛣️', bgColor: '#E8EAF6', desc: '查询驾驶证扣分情况', price: '¥2.9' },
    '车辆抵押': { icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆抵押状态信息', price: '¥2.9' },
    '车辆保险': { icon: '📏', bgColor: '#FFF3E0', desc: '查询车辆保险信息', price: '¥2.9' },
    '二手车检测': { icon: '🔧', bgColor: '#F1F8E9', desc: '二手车全面检测报告', price: '¥2.9' },
    '车牌归属': { icon: '🔄', bgColor: '#E3F2FD', desc: '查询车牌归属地信息', price: '¥2.9' },
    '事故记录': { icon: '✅', bgColor: '#E8F5E9', desc: '查询车辆事故记录', price: '¥2.9' },
    '维保记录': { icon: '💥', bgColor: '#FFEBEE', desc: '查询车辆维修保养记录', price: '¥2.9' },
    '车辆召回': { icon: '✅', bgColor: '#E8F5E9', desc: '查询车辆召回信息', price: '¥2.9' },
    '新车比价': { icon: '🚗', bgColor: '#FFF3E0', desc: '新车价格对比查询', price: '¥2.9' },
    '违章代缴': { icon: '✅', bgColor: '#E8F5E9', desc: '违章罚款代缴服务', price: '¥2.9+服务费' },
  },
  package: {
    '企业工商信息': { icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业工商注册详细信息', price: '¥2.9' },
    '企业关联关系': { icon: '🔗', bgColor: '#E8EAF6', desc: '查询企业股东与投资关系', price: '¥2.9' },
    '企业股东信息': { icon: '👔', bgColor: '#E8EAF6', desc: '查询企业股东详细信息', price: '¥2.9' },
    '企业风险扫描': { icon: '💰', bgColor: '#FFF3E0', desc: '全面扫描企业经营风险', price: '¥2.9' },
    '企业经营异常': { icon: '🏠', bgColor: '#FFEBEE', desc: '查询企业经营异常名录', price: '¥2.9' },
    '企业失信查询': { icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业失信被执行信息', price: '¥2.9' },
    '企业法人查询': { icon: '👤', bgColor: '#E8F5E9', desc: '查询企业法定代表人信息', price: '¥2.9' },
    '企业年报': { icon: '📊', bgColor: '#E0F7FA', desc: '查询企业年报信息', price: '¥2.9' },
    '企业对外投资': { icon: '🏢', bgColor: '#E8EAF6', desc: '查询企业对外投资情况', price: '¥2.9' },
  },
  report: {
    '深度背调报告': { icon: '📋', bgColor: '#F1F8E9', desc: '全面个人背景调查报告', price: '¥9.9' },
    '企业尽调报告': { icon: '📊', bgColor: '#F1F8E9', desc: '企业尽职调查深度报告', price: '¥9.9' },
  },
};

const serviceInfo = computed(() => {
  const categoryMap = serviceInfoMap[typeCode.value];
  if (categoryMap && categoryMap[name.value]) {
    return categoryMap[name.value];
  }
  return { icon: '📋', bgColor: '#F5F7FA', desc: '查询服务', price: '¥0.0' };
});

function onQuery() {
  // 表单验证
  if (typeCode.value === 'carrier') {
    if (!form.phone || form.phone.length < 11) {
      uni.showToast({ title: '请输入正确的手机号码', icon: 'none' });
      return;
    }
  } else if (typeCode.value === 'car') {
    if (!form.plateNo) {
      uni.showToast({ title: '请输入车牌号', icon: 'none' });
      return;
    }
  } else if (typeCode.value === 'package') {
    if (!form.companyName && !form.creditCode) {
      uni.showToast({ title: '请输入企业名称或信用代码', icon: 'none' });
      return;
    }
  } else if (typeCode.value === 'risk') {
    if (!form.name || (!form.idCard && !form.phone)) {
      uni.showToast({ title: '请填写完整查询信息', icon: 'none' });
      return;
    }
  } else {
    if (!form.name || !form.idCard) {
      uni.showToast({ title: '请填写完整查询信息', icon: 'none' });
      return;
    }
  }

  // 免费服务：直接查询
  if (serviceInfo.value.price === '免费') {
    handleFreeQuery();
    return;
  }

  // 付费服务：跳转到支付页
  uni.navigateTo({
    url: `/pages/pay/index?name=${encodeURIComponent(name.value)}&price=${encodeURIComponent(serviceInfo.value.price)}&typeCode=${typeCode.value}`,
  });
}

async function handleFreeQuery() {
  // carrier: 号码标记/归属地查询
  if (typeCode.value === 'carrier' && (name.value === '号码标记查询' || name.value === '号码归属地')) {
    const r = queryPhoneLabels(form.phone);
    uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(form.phone)}&_t=${Date.now()}` });
    return;
  }

  // 暂时免费的话直接到结果页
  if (name.value === '骚扰电话识别') {
    const r = queryPhoneLabels(form.phone);
    uni.navigateTo({ url: `/pages/hcc/result?number=${encodeURIComponent(form.phone)}&_t=${Date.now()}` });
    return;
  }
}

function onPaid() {
  // 占位
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 24rpx;
  background: $bg-page;
  min-height: 100vh;
  padding-bottom: 240rpx;
}

/* 服务信息卡片 */
.service-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.service-header {
  display: flex;
  align-items: center;
}

.service-icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.service-icon {
  font-size: 44rpx;
}

.service-info {
  flex: 1;
}

.service-name {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 4rpx;
}

.service-desc {
  font-size: 26rpx;
  color: $text-tertiary;
}

/* 查询表单 */
.form-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 24rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 26rpx;
  color: $text-secondary;
  margin-bottom: 12rpx;
  display: block;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: $bg-page;
  border-radius: $radius-md;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: $text-primary;
  box-sizing: border-box;
}

.form-placeholder {
  color: $text-placeholder;
  font-size: 28rpx;
}

.form-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16rpx 0;
}

.form-divider-text {
  font-size: 24rpx;
  color: $text-tertiary;
  background: $bg-card;
  padding: 0 24rpx;
  position: relative;
}

/* 底部操作区 */
.bottom-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $bg-card;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 26rpx;
  color: $text-secondary;
}

.price-value {
  font-size: 40rpx;
  font-weight: 700;
  color: $danger;
}

.query-btn {
  background: $primary;
  border-radius: 999rpx;
  padding: 20rpx 64rpx;
  flex-shrink: 0;
}

.query-btn-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

/* 免责声明 */
.disclaimer {
  margin-top: 24rpx;
  padding: 24rpx;
}

.disclaimer-text {
  font-size: 22rpx;
  color: $text-tertiary;
  line-height: 1.6;
}
</style>
