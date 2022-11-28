// 构建 dataSource 数据
const createDataSource = (rows, cols) => {
  const result = [];
  for (let i = 0; i < rows; i++) {
    const item = {};
    for (let j = 0; j < cols; j++) {
      item[`col_${j}`] = `ROW--${i}, COLUMN--${j}`;
    }
    result.push(item);
  }
  return result;
};

// 构建 columns 列信息
const createColumns = (data) => {
  const item = data[0];
  const columns = [];
  Object.keys(item).forEach((key) => {
    columns.push({
      code: key,
      name: key,
      width: 180,
    });
  });
  return columns;
};
