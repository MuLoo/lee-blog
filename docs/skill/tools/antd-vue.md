## 覆盖组件样式 

由于业务的个性化需求，我们经常会遇到需要覆盖组件样式的情况，这里举个简单的例子。

- 基本组件样式覆盖
- [Modal 组件样式覆盖](#modal)
- [Button 组件圆角](#button)


```vue
<template>
    <div class="test-wrapper">
        <a-select>
            <a-select-option value="1">Option 1</a-select-option>
            <a-select-option value="2">Option 2</a-select-option>
            <a-select-option value="3">Option 3</a-select-option>
        </a-select>
    </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
// 使用 css 时可以用 >>> 进行样式穿透
.test-wrapper >>> .ant-select {
    font-size: 16px;
}
// 使用 scss, less 时，可以用 /deep/ 进行样式穿透
.test-wrapper /deep/ .ant-select {
    font-size: 16px;
}
// less CSS modules 时亦可用 :global 进行覆盖
.test-wrapper {
    :global {
        .ant-select {
            font-size: 16px;
        }
    }
}
</style>
```



<h2 id="modal">Modal 组件样式覆盖</h2>

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lxwnz2957l)

```vue
<template>
    <a-modal title="Basic Modal" wrapClassName="custom-modal" v-model="visible" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    }
  }
}
</script>
<style lang="less">
.custom-modal {
  .ant-modal-title {
    font-size: 2rem;
    color: #f00;
  }
}
</style>
```
> 需要注意覆盖 Modal 组件需要给组件属性 `wrapClassName` 设定一个自定义的 CSS 类名,不重复. 然后利用全局 CSS (不带 scoped ) 来进行覆盖, 这样不会影响到其他 Modal 组件的样式, 只对该组件生效
<h2 id="button">Button 组件圆角</h2>

注意: 该用法在 vue ant design 同步官方 ant 的 API 后则无需按照此配置使用
[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/84klzvymm2)

```vue
<template>
	<div>
		<a-button style="border-radius: 15px;" type="primary">Open Modal</a-button>
	</div>
</template>
```
