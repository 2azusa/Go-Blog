// // src/utils.ts

// // 将字符串转换为 camelCase (处理 PascalCase 和 snake_case)
// const toCamel = (str: string): string => {
//   if (str.startsWith('_')) {
//     return str; // 保留特殊字段如 __v
//   }
//   return str.replace(/([_A-Z])/g, (match, p1, offset) => {
//     if (offset === 0) {
//       return p1.toLowerCase();
//     }
//     // 如果是下划线，则去掉下划线并将后面字母大写
//     if (p1.startsWith('_')) {
//       return p1.substring(1).toUpperCase();
//     }
//     // 如果是大写字母，则保持原样（主要用于已是camelCase的场景）
//     return p1;
//   }).replace(/^([A-Z])/, (match) => match.toLowerCase()); // 确保首字母小写
// };

// // 检查是否为纯粹的对象
// const isObject = (obj: any): boolean => {
//   return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
// };

// // 递归地将对象或数组中的所有键转换为 camelCase
// export const keysToCamel = (obj: any): any => {
//   if (isObject(obj)) {
//     const newObj: { [key: string]: any } = {};
//     Object.keys(obj).forEach((key) => {
//       newObj[toCamel(key)] = keysToCamel(obj[key]);
//     });
//     return newObj;
//   } else if (Array.isArray(obj)) {
//     return obj.map((i) => keysToCamel(i));
//   }
//   return obj;
// };