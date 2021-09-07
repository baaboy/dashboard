import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Badge,
  NavLink,
  Spinner,
  Button
} from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import classes from './banner.module.css';
import PropTypes from 'prop-types';

const JobUserItem = (props)=>{
    const [select, setSelect] = useState(props.select)
    
    useEffect(()=>{
        return(
            setSelect(props.select)
        )
    },[props.select])

    const changeSelect = ()=>{
        if(select == true){
            props.selectionFalse()
            setSelect(false)
        } else {
            props.selectionTrue()
            setSelect(true)
        }
    }
    return(
        <Col >
            <Card className="text-white bg-primary" >
                <CardHeader className={classes.row_view}>
                    <div className={classes.row_view}>
                        {
                            props.item.avatar_image !== null?
                            <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.avatar_image}`} className={classes.img1}/>
                            :null
                        }
                        <div style={{margin:10}}>
                            <h5>{props.item.business_title}</h5>
                            <h6>{`${props.item.name} ${props.item.last_name}`}</h6>
                        </div>
                    </div>
                    <AppSwitch className={'float-right mb-0'} label color={'success'} onChange={changeSelect} checked={select} defaultChecked={select} size={'lg'}/>
                </CardHeader>
                <CardBody className={classes.row_view}>
                    <div style={{width:'100%'}}>
                        <h5>{`تعداد امتیاز : ${props.item.number_rating}`}</h5>
                        <h5>{`میانگین امتیاز : ${props.item.average_rating}`}</h5>
                    </div>
                    {
                        props.item.background_image !== null?
                        <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.background_image}`} className={classes.img2}/>
                        :null
                    }
                </CardBody>
            </Card>
        </Col>
    )
}
export default JobUserItem;
JobUserItem.propTypes = {
    item: PropTypes.object.isRequired,
    select: PropTypes.bool.isRequired,
    selectionTrue: PropTypes.func.isRequired,
    selectionFalse: PropTypes.func.isRequired
};