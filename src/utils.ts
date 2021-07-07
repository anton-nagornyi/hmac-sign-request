export const isEmptyObject = (obj: any): boolean => {
  return obj.constructor === Object && Object.keys(obj).length === 0;
};
