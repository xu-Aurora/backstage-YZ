import { message } from 'antd';

const verifyContent = (content) => {
    for (let i in content) {
        if (!content[i] || content[i] === ' ') {
          message.error('请输入内容!', 1.5); 
          return false;
          break;
        }
    }
    return true;
}

export default verifyContent