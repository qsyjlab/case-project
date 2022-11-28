<template>
  <label class="v-checkbox">
    <!-- {{ indeterminate }} -->
    <span
      :class="[
        'v-checkbox__input',
        checked && !indeterminate ? 'is-checked' : '',
        indeterminate ? 'is-indeterminate' : '',
      ]"
    >
      <!-- class="v-checkbox__original" -->
      <input
        class="v-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        v-model="checked"
      />
      <span class="v-checkbox__inner"></span>
    </span>
    <span class="v-checkbox__label">
      <slot></slot>
    </span>
  </label>
</template>
<script>
import "./checkbox.css";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String,Boolean],
      default: false,
    },
    // 半选状态
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {

        if(typeof newVal === 'string')  {
          this.checked = false
        }
        if (newVal !== oldVal) {
          this.checked = newVal;
        }
      },
      immediate: true,
    },
    indeterminate: {
      handler(newVal) {
        if (newVal) {
          this.checked = false;
        }
      },
      immediate: true,
    },
    checked(newVal) {

      // console.log('newVal checkbox',newVal);
      this.$emit("change", newVal);
    },
  },
  methods: {},
};
</script>
<style scoped></style>
