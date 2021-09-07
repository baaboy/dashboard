import React, {useState} from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const DefaultAside = (props) => {
    const [activeTab, setActiveTab] = useState('1')
    const toggle =(tab)=> {
      if (activeTab !== tab) {
        setActiveTab(tab)
      }
    }
    const { children, ...attributes } = props;

    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink className={classNames({ active: activeTab === '1' })}
                     onClick={() => {
                       toggle('1');
                     }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classNames({ active: activeTab === '2' })}
                     onClick={() => {
                       toggle('2');
                     }}>
              <i className="icon-speech"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classNames({ active: activeTab === '3' })}
                     onClick={() => {
                       toggle('3');
                     }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            
          </TabPane>
          <TabPane tabId="2" className="p-3">
            <div className="message">
              
            </div>
          </TabPane>
          <TabPane tabId="3" className="p-3">
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
