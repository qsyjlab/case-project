const keyMap = { text: "title", children: "children", id: "key" };

export const virtualTreeProps = {
  keyMap: {
    type: Object,
    default: () => keyMap,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  checkable: {
    type: Boolean,
    default: true,
  },
  checkedIds: {
    type: Array,
    default: () => [],
  },
  expandedIds: {
    type: Array,
    default: () => [],
  },
  treeData: {
    type: Array,
    default: () => [],
  },
  visibleHeight: {
    type: Number,
    default: 500,
  },
  nodeHeight: {
    type: Number,
    default: 28,
  },
  filterMethod:{
    type:Function,
  }
};

export const treeNodeItemProps = {
  keyMap: {
    type: Object,
    default: () => keyMap,
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
};
