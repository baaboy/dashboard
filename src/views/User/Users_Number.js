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
import axios from 'axios';
import classes from './user.module.css';

const Users_Number = (props)=>{
    const [numbers,setNumbers] = useState(null);
    useEffect(()=>{
        getNumbersOfUsers()
    },[])
    const getNumbersOfUsers = ()=>{
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getNumberOfAllUsers($_id : ID) {
                        getNumberOfAllUsers(_id : $_id){
                            status,
                            message,
                            number
                        }
                    }
                `,
                variables:{
                    "_id" : null
                }
            }
        }).then((response)=>{
            const {number} = response.data.data.getNumberOfAllUsers;
            setNumbers(number)
        }).catch((error)=>{
            console.log(error)
        })
    }
    return(
        <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    <h6 style={{fontSize:15, color:'#0693e3'}}>تعداد کاربران</h6>
                </CardHeader>
                <CardBody style={{backgroundColor:'green'}}>
                    <div className={classes.numberOfUsers}>
                        <h1 style={{fontSize:200, color:'#FFF'}}>{numbers}</h1>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default Users_Number;