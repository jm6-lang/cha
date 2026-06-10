<template>
  <view class="page">
    <view class="page-card">
      <text class="doc-title">充值协议</text>
      <text class="doc-updated">最后更新日期：2024年12月01日</text>

      <view class="doc-section">
        <text class="section-title">一、协议说明</text>
        <text class="section-text">本协议是您与数查平台之间就充值服务所订立的有效合约。在您充值前，请仔细阅读本协议全部条款，一旦完成充值即视为您接受本协议全部内容。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">二、充值方式</text>
        <text class="section-text">1. 平台提供多种充值方式：</text>
        <text class="section-text">（1）微信支付</text>
        <text class="section-text">（2）支付宝</text>
        <text class="section-text">（3）银行卡支付</text>
        <text class="section-text">2. 部分支付方式可能因银行或第三方平台政策调整而临时不可用，请以实际支付页面显示为准。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">三、充值金额</text>
        <text class="section-text">1. 单次充值最低金额为 ¥10，最高金额为 ¥50,000。</text>
        <text class="section-text">2. 平台不收取充值手续费，但部分银行可能对信用卡支付有限额要求。</text>
        <text class="section-text">3. 充值金额到账后可在"我的-钱包"中查看。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">四、充值用途</text>
        <text class="section-text">1. 充值金额仅限用于平台内付费查询、购买服务、开通会员等消费场景。</text>
        <text class="section-text">2. 充值金额不支持直接提取现金，仅可通过"提现"功能将佣金部分提现。</text>
        <text class="section-text">3. 充值赠送的优惠券、积分等奖励，遵循相应活动规则使用。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">五、退款政策</text>
        <text class="section-text">1. 充值后未使用的金额，7 天内可申请全额退款。</text>
        <text class="section-text">2. 已使用的金额（消费、购买服务、开通会员等）不支持退款。</text>
        <text class="section-text">3. 退款申请提交后，3-5 个工作日内原路退回。</text>
        <text class="section-text">4. 因平台问题导致无法正常服务的，全额退款。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">六、风险提示</text>
        <text class="section-text">1. 请通过官方渠道充值，谨防钓鱼网站。</text>
        <text class="section-text">2. 平台不会通过任何非官方渠道要求您转账或充值。</text>
        <text class="section-text">3. 充值即视为自愿消费，请理性充值。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">七、客服支持</text>
        <text class="section-text">如对充值有任何疑问，可联系客服：</text>
        <text class="section-text">客服电话：400-888-9999</text>
        <text class="section-text">在线客服：9:00-21:00</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  background: $bg-page;
  min-height: 100vh;
  padding: 24rpx;
}

.page-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 40rpx 32rpx;
}

.doc-title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  margin-bottom: 12rpx;
}

.doc-updated {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
  text-align: center;
  margin-bottom: 40rpx;
}

.doc-section {
  margin-bottom: 28rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 16rpx;
}

.section-text {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 6rpx;
}
</style>
