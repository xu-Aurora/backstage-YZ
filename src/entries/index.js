import dva from 'dva';
import createLoading from 'dva-loading';
import Routes from '../routes'
import Models from '../models'
import { message } from 'antd';
import './index.html';
import './index.less';

const ERROR_MSG_DURATION = 3; // 3 秒
// 1. Initialize
const app = dva({
 // history: browserHistory,
  onError(e) { //后台报错信息处理
    message.destroy();
     message.error(e.message, ERROR_MSG_DURATION);
     message.config({
      maxCount: 1,
    });
  }
});
// 2. Plugins
app.use(createLoading());
// app.use();

// 3. Model
Object.keys(Models).forEach((item) => {
  app.model(Models[item]);
})
// Moved to router.js
// 4. Router
app.router(Routes);
// 5. Start
app.start('#root');
