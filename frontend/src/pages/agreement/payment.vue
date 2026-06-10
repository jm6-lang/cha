<template>
  <view class="page">
    <view class="page-card">
      <text class="doc-title">支付协议</text>
      <text class="doc-updated">最后更新日期：2024年12月01日</text>

      <view class="doc-section">
        <text class="section-title">一、协议范围</text>
        <text class="section-text">本协议适用于您在数查平台使用各种支付服务进行的交易行为，包括但不限于：充值、购买查询服务、开通 VIP 会员、购买优惠券等。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">二、支付渠道</text>
        <text class="section-text">1. 平台支持的支付渠道包括：</text>
        <text class="section-text">（1）微信支付：支持零钱、绑定银行卡</text>
        <text class="section-text">（2）支付宝：支持余额、余额宝、绑定银行卡、花呗</text>
        <text class="section-text">（3）银联支付：支持各家银行储蓄卡、信用卡</text>
        <text class="section-text">2. 第三方支付平台的服务由相应服务商提供，平台不对其服务质量承担责任。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">三、交易安全</text>
        <text class="section-text">1. 平台采用银行级 SSL 加密传输，保障支付安全。</text>
        <text class="section-text">2. 不存储您的完整银行卡号、支付密码等敏感信息。</text>
        <text class="section-text">3. 建议您在安全网络环境下进行支付操作。</text>
        <text class="section-text">4. 如发现账户异常，请立即联系客服冻结账户。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">四、订单生效</text>
        <text class="section-text">1. 支付成功后系统将自动创建订单并提供查询服务。</text>
        <text class="section-text">2. 查询服务一旦消费，不支持退款。</text>
        <text class="section-text">3. 如遇网络异常导致重复支付，重复支付金额将原路退回。</text>
        <text class="section-text">4. 订单详情可在"我的-订单"中查看。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">五、退款规则</text>
        <text class="section-text">1. 未消费的支付金额 7 天内可申请退款。</text>
        <text class="section-text">2. 已消费的金额（已使用查询服务、已开通会员等）不可退款。</text>
        <text class="section-text">3. 充值赠送的优惠券、积分等奖励，扣除相应价值后退款。</text>
        <text class="section-text">4. 退款时效：3-15 个工作日，具体到账时间以第三方支付平台为准。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">六、争议处理</text>
        <text class="section-text">1. 因支付引发的争议，平台将协助调取相关交易记录。</text>
        <text class="section-text">2. 如您对交易有任何异议，请在 30 天内联系客服。</text>
        <text class="section-text">3. 双方应友好协商解决，协商不成的可提交平台所在地法院诉讼解决。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">七、协议变更</text>
        <text class="section-text">本协议可能根据法律法规变化、业务调整等情况更新，更新后将通过站内通知告知。继续使用支付服务即视为接受变更后的协议。</text>
      </view>

      <view class="doc-section">
        <text class="section-title">八、联系我们</text>
        <text class="section-text">如对支付有任何问题，可联系客服：</text>
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
