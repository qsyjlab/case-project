<template>
  <div>

      <VirtualTree
        :ref="virtualTreeRef"
        @expanded="onExpanded"
        :tree-data="treeData"
        :expanded-ids="expandedIds"
      />
    <!-- <VirtualTable /> -->
  </div>
</template>
<script>
// import VirtualTable from "./components/virtual-table/virtual-table.vue";

import VirtualTree from "./components/virtual-tree/virtual-tree.vue";

import { createTreeData } from "./components/virtual-tree/utils";
export default {
  components: {
    // VirtualTable,
    VirtualTree,
  },
  data() {
    return {
      expandedIds: [],
      treeData: createTreeData(),
    };
  },
  created() {
    // this.$refs.virtualTreeRef.init()

    console.log('this.tree Data',this.treeData);
  },
  methods: {
    virtualTreeRef(ref) {
      console.log("ref", ref);



      ref.init();
    },
    onExpanded(record, isExpanded, arr) {
      this.expandedIds = Array.from(arr);
    },
  },
};
</script>
<style scoped></style>
