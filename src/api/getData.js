import { getRequest, postRequest, putRequest } from 'assets/js/fetch';
import { baseUrl } from './env';
// 登录
export const login = (data) => postRequest(`${baseUrl}/api/User/login`, data);

// 生成手机验证码 
export const getVerifyCode = (data) => postRequest(`${baseUrl}/api/User/mobile/code/send`, data);

// 重置密码
export const resetPassword = (data) => putRequest(`${baseUrl}/api/User/password/reset`, data);

// 个人中心
export const getUserInfo = () => getRequest(`${baseUrl}/api/User/info`);
// 更改密码
export const changePassword = (data) => putRequest(`${baseUrl}/api/User/password/update`, data);

// 修改手机号
export const changePhone = (data) => putRequest(`${baseUrl}/api/User/mobile/update`, data);

// 获取任务卡列表
export const getTaskList = (learnTaskId) => getRequest(`${baseUrl}/api/LearnTask/detail/${learnTaskId}`);

// 获取作业卡任务卡详情
export const getTaskCenter = (data) => getRequest(`${baseUrl}/api/LearnTask/list`, data);

// 获取学生学习的书本的状态
export const getStuLearnBooks = (data) => getRequest(`${baseUrl}/api/LearnTask/book/629BEA83-A921-4B1C-8944-D855583BBAC2`);

// 更新课本为非new状态
export const updateBookState = (data) => postRequest(`${baseUrl}/api/LearnTask/book/disableNew`, data);

// 获取未完成任务数量
export const getUnFinishTask = (code) => getRequest(`${baseUrl}/api/LearnTask/count?state=${code}`);

// 获取个人中心
export const getPersonalCenter = (data) => getRequest(`${baseUrl}/api/User/info`, data);

//应用完成
export const applicationDone = data => postRequest(`${baseUrl}/api/StudyExerciseDetail`, data);

//任务更新
export const taskUpdate = data => putRequest(`${baseUrl}/api/LearnTask/application/update`, data);