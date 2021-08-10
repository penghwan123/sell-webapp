/**
 * 使用mockjs提供mock数据接口
 */
import Mock from 'mockjs';
import data from './data.json';

// 返回goods的接口
Mock.mock('/goods', { code: 0, data: data.goods });
// 返回ratings的接口
Mock.mock('/ratings', { code: 0, data: data.ratings });
// 返回seller接口
Mock.mock('/seller', { code: 0, data: data.seller });