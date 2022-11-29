<template>
  <li
    :class="[
      'vui-tree-item',
      !checkable && isChecked === true ? 'is-checked' : '',
    ]"
    :key="data[keyMap.id]"
    :style="{ paddingLeft: `${pLen * 24}px` }"
    @click="treeItemClickHandler"
  >
    <span :class="['vui-tree-item-title']">
      <span
        :class="['vui-tree-item__expand-icon', !isExpanded ? 'expand' : '']"
        v-if="data.children"
        @click="handleExpandIconClick"
      >
        <expand />
      </span>
      <span v-else style="padding: 0 10px"></span>

      <span style="margin-right: 10px" v-if="checkable">
        <!-- <v-checkbox
          v-if="isChecked === 'some'"
          :indeterminate="isChecked === 'some'"
          @change="checkChangeHandler"
        />

        <v-checkbox v-else :value="isChecked" @change="checkChangeHandler" /> -->
        <ElCheckbox
          :indeterminate="isChecked === 'some'"
          :value="isChecked"
          @change="checkChangeHandler"
        />
      </span>
      <span>{{ data[keyMap.text] }} --- {{ isChecked }} </span>
    </span>
  </li>
</template>
<script>
import Expand from "./icon/expand.vue";

import VCheckbox from "../checkbox/checkbox.vue";
import { treeNodeItemProps } from "./virtual-tree";

import { Checkbox } from "element-ui";

export default {
  name: "tree-node-item",
  components: {
    Expand,
    ElCheckbox: Checkbox,
    VCheckbox,
  },
  props: treeNodeItemProps,
  data() {
    return {
      pLen: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.pLen = this.data.parentIds?.length || 0;
    },
    checkChangeHandler(val) {
      this.$emit("checked", this.data, val);
    },
    treeItemClickHandler() {
      if (this.checkable) return;
      this.$emit("click", this.data, !this.isChecked);
    },
    handleExpandIconClick(e) {
      e.stopPropagation();

      let _expanded = this.isExpanded;
      if (_expanded === "some") {
        _expanded = false;
      }
      const result = !_expanded;

      this.$emit("expanded", this.data, result);
    },
  },
};
</script>
