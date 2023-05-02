import * as moment from 'moment';

//用于抛出http filter错误时，提供时间戳。
export const formatDate = (dateNum: string | number): string => {
  return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
};
