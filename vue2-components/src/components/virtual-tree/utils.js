// 构建 dataSource 所需的数据
export function createTreeData(path = "0", level = 3, count = 10) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const key = `${path}-${i}`;
    const treeNode = {
      title: key,
      label: key,
      key,
    };

    if (level === 1 && key === "0-0-0-0") {
      // 构建100万个子节点
      treeNode.children = createTreeData(key, level - 1, 100000);
    } else if (level > 0) {
      treeNode.children = createTreeData(key, level - 1 , 2);
    }

    list.push(treeNode);
  }
  return list;
}

export function getNewState(paramater = {}) {
  const { data, keysMap ,expandedIds } = paramater;
  // obj 的数据结构为 { [key: string]: treeItem } 的格式；并补充 parentIds, paretNames, $pos 等辅助数据，后面可能需要使用到
  const { obj, list } = resolveTreeDataToList(data, keysMap);

  const expandedArrIds = getExpandedArrIds(expandedIds, obj);

  return { obj, list , expandedArrIds };
}

function resolveTreeDataToList(treeData, keysMap) {
  const { id: kId, children, text } = keysMap;
  // 将 Tree 结构的数据打平成一个 list 存在其中，用于渲染
  const list = [];
  // 将 Tree 中的每一项使用 id(key) 作为键存到 obj 中，方便后续通过 id(key) 取数
  const obj = {};

  // 使用递归遍历所有数据
  traverseData(treeData);

  return { obj, list };

  function traverseData(tree, pIds, pNames, pLevels) {
    const parentIds = pIds || [];
    const parentNames = pNames || [];
    const levels = pLevels || [];

    return tree.map((info, i) => {
      const levs = [].concat(levels);
      levs.push(i);

      // 记录位置信息，即 tree 中的 path，有'_'链接
      info.$pos = levs.join("_");
      if (!info[kId]) {
        info[kId] = info.$pos;
      }
      // 记录所有的祖先节点 Id
      info.parentIds = parentIds;
      info.parentNames = parentNames;

      list.push(info);
      obj[info[kId]] = info;

      if (info[children] && info[children].length) {
        const newParentIds = parentIds.slice();
        const newParentNames = parentNames.slice();
        const strId = String(info[kId]);

        newParentIds.push(strId);
        newParentNames.push(info[text]);

        info.childrenIds = traverseData(
          info[children],
          newParentIds,
          newParentNames,
          levs
        );
      }
      return String(info[kId]);
    });
  }
}

export function getExpandedArrIds(expandedIds, obj) {

  // debugger
  // 将数字转换成Set类型；原因是Set类型的性能会更好
  let expandedArrIds = new Set();
  if (expandedIds instanceof Array) {
    expandedArrIds = new Set(expandedIds);
  } else if (!(expandedIds instanceof Set)) {
    expandedArrIds = new Set();
    console.error("expandedIds 属性仅支持 Array 或 Set 类型");
  }

  // 检查指定展开节点的父级节点是否被展开，如果未被展开则设置为展开
  expandedArrIds.forEach((id) => {
    const { parentIds = [] } = obj[id] || {};
    parentIds.forEach((pId) => {
      if (!expandedArrIds.has(pId)) {
        expandedArrIds.add(pId);
      }
    });
  });
  return expandedArrIds;
}

// 递归移除当前节点及其子孙节点
export function traverseRemove(expandedArrIds, obj, id) {
  const sId = String(id);
  if (expandedArrIds.has(sId)) {
    const { childrenIds: cIds = [] } = obj[id];
    expandedArrIds.delete(sId, 1);

    if (cIds.length) {
      cIds.forEach((cId) => {
        traverseRemove(expandedArrIds, obj, cId);
      });
    }
  }
}




/**
 * 入参说明：
 * treeData: 当前用于渲染树的数据
 * scrollTop: 滚动条滚动的Top值
 * visibleHeight: 可视区域高度
 * itemHeight: 渲染树的单项高度
 * expandedArrIds: 被收起的节点Key
 * keysMap: 用于隐射字段的键值对
 */

 const OFFSET_VERTICAL = 200

export function getVisibleRange({
  treeData = [],
  scrollTop,
  visibleHeight,
  itemHeight,
  expandedArrIds,
  keysMap
}) {
  // idKey: id对应的键名；childrenKey: 子节点对应的键名
  const { id: idKey, children: childrenKey } = keysMap

  let totalHeight = 0 // 树形结构内容的总高度；
  // 0: 顶部被隐藏阶段；1: 可视区域阶段；2: 可视区域以下阶段；
  // 注：此处的可视区域包含上下缓冲区
  let currentStep = 0
  let translateY = 0 // 纵向需要被移动的值
  const items = []

  // 递归解析树形结构的数据，计算整体高度并找出需要在可视区域内展示的内容
  loopData(treeData)

  function loopData(list) {
    list.forEach(item => {
      const key = item[idKey]
      const children = item[childrenKey]
      totalHeight += itemHeight

      if (currentStep === 0) {
        if (totalHeight >= scrollTop - OFFSET_VERTICAL) {
          currentStep += 1
          // 开始收集需要渲染的项
          items.push(item)
        } else {
          translateY += itemHeight
        }
      } else if (currentStep === 1) {
        items.push(item)
        if (totalHeight > scrollTop + visibleHeight + OFFSET_VERTICAL) {
          // 结束收集可渲染项
          currentStep += 1
        }
      }

      if (children && children.length && expandedArrIds.has(key)) {
        loopData(children)
      }
    })
  }

  return {
    items,
    translateY,
    height: totalHeight
  }
}