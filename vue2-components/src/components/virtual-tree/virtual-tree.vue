<template>
  <div class="vui-tree vui-tree-small">
    <div
      class="vui-group-container"
      style="overflow-y: auto"
      @scroll="handleTreeScroll"
    >
      <div className="vui-virtual-container" :style="virtualContainerStyles">
        <ul className="vui-tree-group vui-tree-virtual" :style="groupStyles">
          <TreeNodeItem
            v-for="item in visibelList"
            :key="item[keyMap.id]"
            :data="item"
            :keyMap="keyMap"
            :isExpanded="expandedArrIds.has(item[keyMap.id])"
            @expanded="handleItemExpanded"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {
  createTreeData,
  getNewState,
  traverseRemove,
  getExpandedArrIds,
  getVisibleRange,
} from "./utils";

import TreeNodeItem from "./tree-node-item.vue";

import "./tree.css";
export default {
  components: {
    TreeNodeItem,
  },
  props: {
    keyMap: {
      type: Object,
      default: () => ({ text: "title", children: "children", id: "key" }),
    },
    expandedIds: {
      type: Array,
      default: () => [],
    },
    treeData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // treeData: [],
      virtualContainerStyles: {
        height: "0px",
      },
      groupStyles: {
        transform: `translate(0, ${0}px)`,
      },
      treeList: [],
      visibelList: [],
      expandedArrIds: new Set(),
      treeRelationMap: {},
      scrollTop: 0,
      scrollEl: null,
    };
  },
  watch: {
    expandedIds(newVal) {
      if (newVal !== this.expandedArrIds) {
        // console.log('_newVal',_newVal);
        const newExpanedIds = getExpandedArrIds(newVal, this.treeRelationMap);

        this.expandedArrIds = newExpanedIds;
      }
    },
  },
  created() {},
  methods: {
    handleTreeScroll(e) {
      this.scrollTop = e.target.scrollTop || 0;

      this.renderVisible();
    },
    getConteinrRef(ref) {
      this.scrollEl = ref;
    },
    init() {
      const { list, obj } = getNewState({
        data: this.treeData,
        keysMap: this.keyMap,
        expandedIds: this.expandedIds,
      });
      this.treeList = list;

      console.log("liwst", list);
      this.treeRelationMap = obj;
      this.renderVisible();
    },
    renderVisible() {
      const { items, translateY, height } = getVisibleRange({
        treeData: this.treeData,
        scrollTop: this.scrollTop,
        visibleHeight: 500,
        itemHeight: 28,
        expandedArrIds: this.expandedArrIds,
        keysMap: this.keyMap,
      });
      this.visibelList = items;

      console.log('items',items);

      this.virtualContainerStyles = {
        height: `${height}px`,
      };
      this.groupStyles = {
        transform: `translate(0, ${translateY}px)`,
      };
    },

    // 手动点击展开/收起 icon 的处理
    handleItemExpanded(record = {}, isExpanded, e) {
      // console.log("isExpanded", isExpanded);

      const { childrenIds } = record;

      const { id: kId } = this.keyMap;
      const strId = String(record[kId]);

      const has = this.expandedArrIds.has(strId);
      if (childrenIds && childrenIds.length) {
        if (isExpanded && !has) {
          // 手动操作时不存在某个节点展开了，但其祖先节点没有展开的情况，所以不予处理
          this.expandedArrIds.add(strId);
        } else if (!isExpanded) {
          // 当收起时需要移除所有子孙节点，即收起所有子孙节点
          traverseRemove(this.expandedArrIds, this.treeRelationMap, strId);
        }

        this.renderVisible();
        this.$emit("expanded", record, isExpanded, this.expandedArrIds);

        this.expandedArrIds = this.expandedArrIds;
      }
    },
  },
};
</script>
<style scoped></style>
