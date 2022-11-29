<template>
  <div class="vui-tree vui-tree-small">
    <div
      class="vui-group-container"
      :style="{
        overflowY: 'auto',
        height: `${visibleHeight}px`,
      }"
      @scroll="handleTreeScroll"
      :ref="getConteinrRef"
    >
      <div className="vui-virtual-container" :style="virtualContainerStyles">
        <ul className="vui-tree-group vui-tree-virtual" :style="groupStyles">
          <TreeNodeItem
            v-for="item in visibelList"
            :key="item[keyMap.id]"
            :data="item"
            :keyMap="keyMap"
            :checkable="checkable"
            :isChecked="
              checkable
                ? getCheckedStatus(item, checkedArrIds, treeRelationMap, keyMap)
                : checkedArrIds.has(item[keyMap.id])
            "
            :isExpanded="expandedArrIds.has(item[keyMap.id])"
            @expanded="handleItemExpanded"
            @checked="handleItemChecked"
            @click="clickTreeNodeHandler"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getNewState,
  traverseRemove,
  getExpandedArrIds,
  getVisibleRange,
  getCheckedChildren,
  getCheckedParents,
  getCheckedStatus,
} from "./utils";

import TreeNodeItem from "./tree-node-item.vue";
import { virtualTreeProps } from "./virtual-tree";

import "./tree.css";
export default {
  components: {
    TreeNodeItem,
  },
  props: virtualTreeProps,
  data() {
    return {
      // treeData: [],
      virtualContainerStyles: {
        height: `${0}px`,
      },
      groupStyles: {
        transform: `translate(0, ${0}px)`,
      },
      treeList: [],
      visibelList: [],
      expandedArrIds: new Set(),
      checkedArrIds: new Set(),
      filterKeysSet: new Set(),
      treeRelationMap: {},
      scrollTop: 0,
      scrollEl: null,
      searchValue: null,
    };
  },
  computed: {},
  watch: {
    expandedIds(newVal) {
      if (newVal !== this.expandedArrIds) {
        const newExpanedIds = getExpandedArrIds(newVal, this.treeRelationMap);

        this.expandedArrIds = newExpanedIds;

        this.renderVisible();
      }
    },
    checkedIds(newVal) {
      if (newVal !== this.checkedArrIds) {
        this.checkedArrIds = new Set(this.checkedIds);
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    getCheckedStatus,
    search(val) {
      this.scrollTop = 0;

      this.scrollEl.scrollTop = 0;
      this.searchValue = val;

      this.renderVisible();
    },
    filter(query) {
      if (typeof this.filterMethod !== "function") return;

      this.searchValue = query;
      const { id: kid } = this.keyMap;
      const expandKeysSet = new Set();
      const hiddenVisibelKeys = new Set();
      const filter = this.filterMethod;
      const family = [];
      hiddenVisibelKeys.clear();

      function traverse(nodes = []) {
        nodes.forEach((node) => {
          const nodeKeyValue = node[kid];
          family.push(node);
          if (filter(query, node)) {
            family.forEach((m) => {
              expandKeysSet.add(m[kid]);
            });
          } else if (node.isLeaf) {
            hiddenVisibelKeys.add(nodeKeyValue);
          }

          const children = node.children;

          if (children) {
            traverse(children);
          }

          family.pop();
        });
      }

      traverse(this.treeData);

      this.filterKeysSet = expandKeysSet;
      this.scrollTop = 0;

      this.scrollEl.scrollTop = 0;
      this.renderVisible();

      this.expandedArrIds = expandKeysSet

      this.$emit("expanded", {}, true, this.expandedArrIds);
    },
    // 单点选择
    clickTreeNodeHandler(record, checked) {
      const id = record[this.keyMap.id];

      if (!this.multiple) {
        if (checked && !this.checkedArrIds.has(id)) {
          this.checkedArrIds.clear();
          this.checkedArrIds.add(id);
          this.$forceUpdate();
        }
      } else {
        if (checked && !this.checkedArrIds.has(id)) {
          this.checkedArrIds.add(id);
        } else if (!checked) {
          this.checkedArrIds.delete(id);
        }
      }

      this.$emit("checked", record, checked, this.checkedArrIds);
    },
    handleTreeScroll(e) {
      this.scrollTop = e.target.scrollTop || 0;

      this.renderVisible();
    },
    getConteinrRef(ref) {
      this.scrollEl = ref;
    },
    init() {
      const { list, obj, expandedArrIds, checkedArrIds } = getNewState({
        data: this.treeData,
        keysMap: this.keyMap,
        expandedIds: this.expandedIds,
        checkedIds: this.checkedIds,
      });
      this.treeList = list;
      this.treeRelationMap = obj;

      this.expandedArrIds = expandedArrIds;
      this.checkedArrIds = checkedArrIds;

      this.renderVisible();
    },
    renderVisible() {
      const { items, translateY, height } = getVisibleRange({
        treeData: this.treeData,
        scrollTop: this.scrollTop,
        visibleHeight: this.visibleHeight,
        itemHeight: this.nodeHeight,
        expandedArrIds: this.expandedArrIds,
        keysMap: this.keyMap,
        searchValue: this.searchValue,
        filterKeysSet: this.filterKeysSet,
      });
      this.visibelList = items;
      this.virtualContainerStyles = {
        height: `${height}px`,
      };
      this.groupStyles = {
        transform: `translate(0, ${translateY}px)`,
      };
    },
    handleItemChecked(record, isChecked) {
      const { id: kId, children: childrenKey } = this.keyMap;
      const { parentIds } = record;
      const strId = String(record[kId]);

      if (isChecked && !this.checkedArrIds.has(strId)) {
        this.checkedArrIds.add(strId);
        // 判断其父级&祖先节点是否需要被选中
        getCheckedParents(strId, this.checkedArrIds, this.treeRelationMap);
        // 选中其所有其子孙节点
        getCheckedChildren(strId, this.checkedArrIds, this.treeRelationMap);
      } else if (!isChecked) {
        // console.log('delete');
        this.checkedArrIds.delete(strId);
        // 移除祖先节点的选中状态
        parentIds.forEach((pId) => {
          if (this.checkedArrIds.has(pId)) {
            this.checkedArrIds.delete(pId);
          }
        });

        traverseRemove(this.checkedArrIds, record);
      }

      this.checkedArrIds = this.checkedArrIds;

      // this.renderVisible();

      // console.timeEnd("time start");
      this.$forceUpdate();
      this.$emit("checked", record, isChecked, this.checkedArrIds);

      // 递归移除当前节点及其子孙节点
      function traverseRemove(checkedArrIds, item) {
        const children = item?.[childrenKey];
        if (children && children.length) {
          children.forEach((pre) => {
            // const i = checkedIdsMap[pre[kId]];
            if (checkedArrIds.has(pre[kId])) {
              // console.log("pre", pre[kId]);
              checkedArrIds.delete(pre[kId]);
            }
            traverseRemove(checkedArrIds, pre);
          });
        }
      }
    },

    // 手动点击展开/收起 icon 的处理
    handleItemExpanded(record = {}, isExpanded, e) {
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

        this.expandedArrIds = this.expandedArrIds;

        this.renderVisible();
        this.$emit("expanded", record, isExpanded, this.expandedArrIds);
      }
    },
  },
};
</script>
