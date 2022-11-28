<template>
  <li
    :class="['vui-tree-item', isChecked === true ? 'is-checked' : ''] "
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

import { Checkbox } from "element-ui";

export default {
  name: "tree-node-item",
  components: {
    Expand,
    ElCheckbox: Checkbox,
    VCheckbox,
  },
  props: {
    keyMap: {
      type: Object,
      default: () => ({ text: "title", children: "children", id: "key" }),
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
    isChecked: {
      type: [Boolean, String],
      default: false,
    },
  },

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
    treeItemClickHandler(){

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
