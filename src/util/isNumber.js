import {Message} from 'antd';

function checkNumber(theObj) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test(theObj)) {
        Message.error('请输入数字编号');
        return false;
    }
    return true;
}
export default checkNumber;