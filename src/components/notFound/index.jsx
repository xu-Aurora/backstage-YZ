import React from 'react';
import { Button } from 'antd';
import styles from './notFound.less';
import { Link} from 'dva/router';

const notFound = () => {
  return (
    <div className={styles.normal}>
      <div className={styles.container}>
        <p className={styles.desc}>未找到该页面</p>
        <Link to="/1/app/home">
          <Button type="primary" className={styles.btn}>返回首页</Button>
        </Link>
      </div>
    </div>
  );
};

export default notFound;
