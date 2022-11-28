<template>
  <div>
    
    <VirtualTree
      :ref="virtualTreeRef"
      :tree-data="treeData"
      :expanded-ids="expandedIds"
      :checked-ids="checkedIds"
      @expanded="onExpanded"
      @checked="onChecked"
    />

    <!-- <VirtualTable /> -->
  </div>
</template>
<script>
// import VirtualTable from "./components/virtual-table/virtual-table.vue";

import VirtualTree from "./components/virtual-tree/virtual-tree.vue";

// import Checkbox from "./components/checkbox/checkbox.vue";

import { createTreeData } from "./components/virtual-tree/utils";
export default {
  components: {
    // Checkbox,
    // VirtualTable,
    VirtualTree,
  },
  data() {
    return {
      checked: false,
      expandedIds: ["0-9-0-0"],
      checkedIds: ["0-9-0-0"],
      treeData: createTreeData(),
    };
  },
  created() {
    setTimeout(() => {
      this.expandedIds.push("0-7-0");
    }, 3000);
  },
  methods: {
    virtualTreeRef(ref) {
      // ref.init();
    },
    onExpanded(record, isExpanded, arr) {
      this.expandedIds = Array.from(arr);
    },
    onChecked(record, isChecked, arr) {
      this.checkedIds = Array.from(arr);
    },
  },
};
</script>
