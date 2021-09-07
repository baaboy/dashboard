import React, { lazy, Suspense, useContext, useState, useEffect } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import classes from './user.module.css';
const Users_Report = (props)=>{
    return(
        <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    <h6>کاربران گزارش شده</h6>
                </CardHeader>
                <CardBody>

                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>
        </div>
    )
}
export default Users_Report;