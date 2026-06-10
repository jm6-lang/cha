<template>
  <view class="page">
    <view class="page-card">
      <text class="doc-title">举报规则</text>
      <text class="doc-updated">最后更新日期：2024年12月01日</text>

      <view class="doc-section">
        <text class="section-title">一、举报范围</text>
        <text class="section-text">数查平台欢迎用户举报以下类型的违规信息：</text>
        <text class="section-text">1. 诈骗电话、钓鱼电话</text>
        <text class="section-text">2. 骚扰电话、恶意推销</text>
        <text class="section-text">3. 虚假企业信息</text>
        <text class="section-text">4. 失信企业未公示</text>
        <text class="section-text">5. 身份冒用、隐私泄露</text>
        <text class="section-text">6. 其他违法违规信息</text>
      </view>

      <view class="doc-section">
        <text class="section-title">二、举报方式</text>
        <text class="section-text">1. 在查询结果页点击"举报"按钮</text>
        <text class="section-text">2. 在个人中心点击"意见反馈"</text>
        <text class="section-text">3. 拨打客服热线 400-888-9999</text>
        <text class="section-text">4. 发送邮件至 report@shucha.com</text>
      </view>

      <view class="doc-section">
        <text class="section-title">三、举报要求</text>
        <text class="section-text">1. 举报信息应真实、客观，不得捏造事实</text>
        <text class="section-text">2. 应尽可能提供详细说明、相关截图、证据等</text>
        <text class="section-text">3. 同一事项请勿重复举报</text>
        <text class="section-text">4. 应提供有效的联系方式以便核实</text>
      </view>

      <view class="doc-section">
        <text class="section-title">四、处理流程</text>
        <text class="section-text">1. 平台收到举报后 24 小时内初步审核</text>
        <text class="section-text">2. 复杂情况 3-5 个工作日内处理完成</text>
        <text class="section-text">3. 处理结果将通过站内消息或电话通知</text>
        <text class="section-text">4. 紧急情况（涉及诈骗等）将优先处理</text>
      </view>

      <view class="doc-section">
        <text class="section-title">五、保护措施</text>
        <text class="section-text">1. 平台对举报人信息严格保密</text>
        <text class="section-text">2. 严禁任何形式的打击报复行为</text>
        <text class="section-text">3. 配合有关部门调查的，平台将提供必要协助</text>
      </view>

      <view class="doc-section">
        <text class="section-title">六、奖励机制</text>
        <text class="section-text">1. 举报经核实有效，可获得相应积分奖励</text>
        <text class="section-text">2. 协助破获重大案件的，将给予额外奖励</text>
        <text class="section-text">3. 详情可咨询客服</text>
      </view>

      <view class="doc-section">
        <text class="section-title">七、违规处理</text>
        <text class="section-text">对恶意举报、虚假举报的：</text>
        <text class="section-text">1. 首次警告</text>
        <text class="section-text">2. 二次限制使用</text>
        <text class="section-text">3. 严重者永久封号</text>
        <text class="section-text">4. 涉嫌违法的，移送司法机关</text>
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
