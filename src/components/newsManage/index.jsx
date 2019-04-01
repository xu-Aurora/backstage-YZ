import React, {Component} from 'react';
import {Tabs} from 'antd';
import styles from './index.less';

import NewsList from './newsList/index.jsx';
import NewsTemplate from './newsTemplate/index.jsx';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className={styles.commonBox}>
                <div className={styles.title} >
                    <Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: 24, color: '#999999',marginTop:8}}>
                        <TabPane tab={'消息列表'} key="1">
                            <NewsList />
                        </TabPane>
                        <TabPane tab={'消息模版'} key="2">
                            <NewsTemplate />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default App;