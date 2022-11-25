<template>
  <li
    class="vui-tree-item"
    :key="data[keyMap.id]"
    :style="{ paddingLeft: `${pLen * 24}px` }"
  >
    <span :class="['vui-tree-item-title']">
      <span :class="['vui-tree-item__expand-icon', !isExpanded ? 'expand' : '']"  v-if="data.children" @click="handleExpandIconClick">
        <Expand/>
      </span>
      <span v-else style="padding: 0 10px"></span>

      <span class="text">{{ data[keyMap.text] }}</span>
    </span>
  </li>
</template>
<script>
import Expand from "./icon/expand.vue";
export default {
  name: "tree-node-item",
  components: {
    Expand,
  },
  props: {
    keyMap: {
      type: Object,
      default: () => ({ text: "title", children: "children", id: "key" }),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    isExpanded: {
      type: Boolean,
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
    handleExpandIconClick(e) {
      e.stopPropagation();
      const result = !this.isExpanded;

      this.$emit("expanded", this.data, result);
    },
  },
};
</script>

