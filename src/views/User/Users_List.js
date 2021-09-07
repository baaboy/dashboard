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
  Pagination,
  PaginationItem,
  PaginationLink,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
  Input
} from 'reactstrap';
import axios from 'axios';
import classes from './user.module.css';
import Spinner from 'reactstrap/lib/Spinner';
const Users_List = (props)=>{
    const [page,setPage] = useState(1);
    const [users,setUsers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [searchBarValue, setSearchBarValue] = useState('')
    useEffect(()=>{
        getAllUsers()
    },[])
    const getAllUsers = ()=>{
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllUser($page : Int, $limit : Int) {
                        getAllUser(page : $page, limit : $limit){
                            _id,
                            user_name,
                            name,  
                            avatar_image,
                            verified_account,
                            online,
                            last_seen
                        }
                    }
                `,
                variables:{
                    "page" : page,
                    "limit" : 20
                }
            }
        }).then((response)=>{
            console.log(response)
            const error = response.data.errors
            const data = response.data.data.getAllUser;
            if(data){
                setUsers(data)
                setPage(page + 1)
                setLoading(false)
            } else if(error) {
                const {message} = response.data.errors[0]
                alert(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const searchUser = ()=>{

    }
    return(
        <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    <Col>
                        <Input
                            type={'text'}
                            placeholder={'جستجوی کاربران'}
                            value={searchBarValue}
                            onChange={searchUser}
                            style={{height:50}}
                        />
                    </Col>
                </CardHeader>
                <CardBody>
                    <div className={classes.user_list_section}>
                        {
                            loading?
                            <Spinner/>:
                            users.map(item=>
                                <div onClick={()=>alert('sdf')} key={item._id} className={classes.user_list} style={item.online?{backgroundColor:'#adff2f'}:{}}>
                                    
                                    {
                                        item.avatar_image?
                                        <img className={classes.user_img} src={`${process.env.REACT_APP_PUBLIC_URL}${item.avatar_image}`} alt={item.avatar_image} />
                                        :
                                        <i className="fa fa-user-circle" style={{fontSize:80, color:'#ccc'}}/>
                                    }
                                    <h5 style={{color:'#000'}}>
                                        {
                                            item.verified_account?
                                            <i className="fa fa-check-circle" style={{fontSize:20, color:'#0088cc'}}/>
                                            :null
                                        }
                                        {item.user_name}
                                    </h5>
                                    <h6 style={{color:'#666'}}>{item.name}</h6>
                                    <h6 style={{color:'green', fontSize:11}}>{item.last_seen}</h6>
                                    
                                </div>
                            )
                        }
                        
                    </div>
                </CardBody>
                <CardFooter>
                    <Pagination>
                        <PaginationItem>
                            <PaginationLink previous tag="button" />
                        </PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">
                            1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">
                            2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">
                            3
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">
                            4
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">
                            5
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink next tag="button" />
                        </PaginationItem>
                    </Pagination>
                </CardFooter>
            </Card>
        </div>
    )
}
export default Users_List;