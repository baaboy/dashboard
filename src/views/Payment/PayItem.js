import React, { useState } from 'react';
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
import axios from 'axios';
import classes from './payment.module.css';
import PropTypes from 'prop-types';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const PayItem = (props)=>{
    const [loadingCode, setLoadingCode] = useState(false)
    const [preparing, setPreparing] = useState(props.item.order_status.step > 1?true:false)
    const [sent, setSent] = useState(props.item.order_status.step > 2?true:false)
    const [delivered, setDelivered] = useState(props.item.order_status.step > 3?true:false)
    const [generateCode, setGenerateCode] = useState(props.item.generate_code)
    const [lodingDownload, setLoadingDownload] = useState(false)
    const [listSelectNewTable, setListSelectNewTable] = useState([])

    const preparingFunction = ()=>{
        if(preparing == true){
            setPreparing(false)
            setSent(false)
            setDelivered(false)
            const step = 1;
            const back_step = true;
            operationQuery(step, back_step)
        } else{
            setPreparing(true)
            const step = 2;
            const back_step = false;
            operationQuery(step, back_step)
        }
    }
    const sentFunction = ()=>{
        if(sent == true){
            setSent(false)
            setDelivered(false)
            const step = 2;
            const back_step = true;
            operationQuery(step, back_step)
        } else{
            setPreparing(true)
            setSent(true)
            const step = 3;
            const back_step = false;
            operationQuery(step, back_step)
        }
    }
    const deliveredFunction = ()=>{
        if(delivered == true){
            setDelivered(false)
            const step = 3;
            const back_step = true;
            operationQuery(step, back_step)
        } else{
            setPreparing(true)
            setSent(true)
            setDelivered(true)
            const step = 4;
            const back_step = false;
            operationQuery(step, back_step)
        }
    }
    const operationQuery = (step, back_step)=>{
        const level = localStorage.getItem('level')
        let data = {
            query : `
                mutation updatePaymentStatusBar($payment : ID!, $step : Int!, $level : Int!, $job_user : ID!, $back_step : Boolean!) {
                    updatePaymentStatusBar(payment : $payment, step : $step, level : $level, job_user : $job_user, back_step : $back_step){
                        status,
                        message
                    }
                }
            `,
            variables:{
                "payment" : props.item._id,
                "step" : step,
                "level" : parseInt(level),
                "job_user" : props.item.job_user._id,
                "back_step" : back_step
            }
        }
        axios({
            url:'/',
            method:'post',
            data : data
        }).then((response)=>{
            console.log(response)
        }).catch((error)=>{
            console.log(error)
        })
    }
    const generateCodeRating = ()=>{
        let number = 0;
        for (let index = 0; index < props.item.card_order.length; index++) {
            const element = props.item.card_order[index].card_number;
            number += element
        }
        const level = localStorage.getItem('level')
        setLoadingCode(true)
        let data = {
            query : `
                mutation generateRatingCode($job_user : ID!, $payment : ID!, $number : Int!, $level : Int!) {
                    generateRatingCode(job_user : $job_user, payment : $payment, number : $number, level : $level){
                        status,
                        message
                    }
                }
            `,
            variables:{
                "job_user" : props.item.job_user._id,
                "payment" : props.item._id,
                "number" : number,
                "level" : parseInt(level)
            }
        }
        axios({
            url:'/',
            method:'post',
            data : data
        }).then((response)=>{
            setLoadingCode(false)
            console.log(response)
            const data = response.data.data.generateRatingCode;
            const error = response.data.errors
            if(data){
                setGenerateCode(true)
            } else if(error) {
                alert('مشکلی پیش آمد. دوباره امتحان کنید')
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const downloadCodeRating = ()=>{
        setLoadingDownload(true)
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query downloadRatingCode($payment : ID!, $job_user : ID!, $level : Int!) {
                        downloadRatingCode(payment : $payment, job_user : $job_user, level : $level){
                            code
                        }
                    }
                `,
                variables:{
                    "payment" : props.item._id,
                    "job_user" : props.item.job_user._id,
                    "level" : parseInt(level)
                }
            }
        }).then((response)=>{
            const error = response.data.errors
            const data = response.data.data.downloadRatingCode;
            if(data){
                let setData = []
                for (let index = 0; index < data.length; index++) {
                    const element = data[index].code;
                    setData.push({name : element})
                }
                setListSelectNewTable(setData)
                setLoadingDownload(false)
            } else if(error) {
                alert('مشکلی پیش آمد. دوباره امتحان کنید')
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    
    return(
        <Col style={{marginBlock:50}}>
                        <Card className={props.item.payment?"border-success":"border-danger"} >
                            <CardHeader className={classes.title_header}>
                                <div className={classes.title_header}>
                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.job_user.qr}`} className={classes.img1}/>
                                    <div>
                                        <h6 className={classes.user_title1}>{props.item.job_user.business_title}</h6>
                                        <h6 className={classes.user_title2}>{`${props.item.job_user.name} ${props.item.job_user.last_name}`}</h6>
                                        {
                                            props.item.job_user.landline_phone !==null?
                                            <h6 className={classes.user_title3}>{`${props.item.job_user.phone} --- ${props.item.job_user.landline_phone}`}</h6>
                                            :
                                            <h6 className={classes.user_title3}>{props.item.job_user.phone}</h6>
                                        }
                                        {
                                            props.item.job_user.area !== null?
                                            <h6 className={classes.user_title3}>{`${props.item.job_user.province.name_fa} - ${props.item.job_user.city.name_fa} - ${props.item.job_user.area.name_fa}`}</h6>
                                            :
                                            <h6 className={classes.user_title3}>{`${props.item.job_user.province.name_fa} - ${props.item.job_user.city.name_fa}`}</h6>
                                        }
                                        <h6 className={classes.user_title3}>{props.item.job_user.address}</h6>
                                    </div>
                                </div>
                                
                                <div className={classes.title_header_switch}>
                                    <div className={classes.switch_item_lable}>
                                        {
                                            props.item.payment == true?
                                            <Badge color="success" className="float-right"><h6 className={classes.text_badg}>پرداخت موفق</h6></Badge>
                                            :
                                            <Badge color="danger" className="float-right" ><h6 className={classes.text_badg}>پرداخت ناموفق</h6></Badge>
                                        }
                                    </div>
                                    {
                                        props.item.payment?
                                        <div className={classes.switch_item_lable}>
                                            <AppSwitch className={'float-right mb-0'} label onChange={preparingFunction} checked={preparing} color={'success'} defaultChecked={preparing} size={'sm'}/>
                                            <h6 className={classes.user_title4}>در حال آماده سازی</h6>
                                        </div>
                                        :
                                        null
                                    }
                                    {
                                        props.item.payment?
                                        <div className={classes.switch_item_lable}>
                                            <AppSwitch className={'float-right mb-0'} onChange={sentFunction} checked={sent} label color={'success'} defaultChecked={sent} size={'sm'}/>
                                            <h6 className={classes.user_title4}>ارسال شد</h6>
                                        </div>
                                        :
                                        null
                                    }
                                    {
                                        props.item.payment?
                                        <div className={classes.switch_item_lable}>
                                            <AppSwitch className={'float-right mb-0'} label color={'success'} onChange={deliveredFunction} checked={delivered} defaultChecked={delivered} size={'sm'}/>
                                            <h6 className={classes.user_title4}>تحویل داده شد</h6>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </CardHeader>
                            <CardBody>
                                {
                                    <div>
                                        <div className={classes.row_view}>
                                            <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.job_user.job.image}`} className={classes.img2}/>
                                            <h6 className={classes.text_body7}>{props.item.job_user.job.name_fa}</h6>
                                        </div>
                                        {
                                            props.item.job_user.floor_sub !== null && props.item.job_user.floor_sub.length > 0?
                                            <div className={classes.row_view}>
                                                {
                                                    props.item.job_user.floor_sub.map((p, i)=>{
                                                        return(
                                                            <h6 className={classes.text_body7}>{p.name_fa}</h6>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                }
                                {
                                    props.item.card_order.map((item, index)=>{
                                        return(
                                            <div key={index} className={classes.body1}>
                                                <h5 className={classes.text_body1}>{`${item.card_number} کارت از نوع ${item.card_type.name_fa}`}</h5>
                                                <h6 className={classes.text_body2}>{`قیمت هر کارت ${item.card_type.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان، هزینه طراحی ${item.card_type.design_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان، هزینه ارسال ${item.card_type.shipping_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</h6>
                                            </div>
                                        )
                                    })
                                }
                                <div>
                                    {
                                        props.item.marketer_discount !== null?
                                        <h5 className={classes.text_body2}>{`تخفیف بازاریاب : ${props.item.marketer_discount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</h5>
                                        :null
                                    }
                                    <div className={classes.row_view}>
                                        {
                                            props.item.payment?
                                            <h5 className={classes.text_body3}>{`مبلغ پرداختی : ${props.item.price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</h5>
                                            :
                                            <h5 className={classes.text_body3}>{`قیمت کل : ${props.item.price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</h5>
                                        }
                                        <NavLink
                                            data-placement="bottom"
                                            href={`https://www.zarinpal.com/pg/StartPay/${props.item.resnumber}`}
                                            target="_blank"
                                        >
                                            {props.item.resnumber}
                                        </NavLink>
                                    </div>
                                    <div className={classes.body_border}/>
                                    <h5 className={classes.text_body4}>توضیحات سفارش</h5>
                                    <h5 className={classes.text_body8}>{props.item.description.description}</h5>
                                    {
                                        props.item.description.phone.length > 0?
                                        <div className={classes.row_view}>
                                        <h5 className={classes.text_body4}>شماره تلفن برای چاپ روی کارت : </h5>
                                        {
                                            props.item.description.phone.map((item, index)=>{
                                                return(
                                                    <h5 className={classes.text_body6} key={index}>{`${item}`}</h5>
                                                )
                                            })
                                        }
                                        </div>
                                        :null
                                    }
                                    {
                                        props.item.description.img_path1 !== null || props.item.description.img_path2 !== null || props.item.description.img_path3 !== null?
                                        <div>
                                            <h5 className={classes.text_body4}>طرح یا لوگوی پیشنهادی برای استفاده در طرح کارت ویزیت :</h5>
                                            <div className={classes.row_view}>
                                                {
                                                    props.item.description.img_path1 !== null?
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.description.img_path1}`} className={classes.img1}/>
                                                    :null
                                                }
                                                {
                                                    props.item.description.img_path2 !== null?
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.description.img_path2}`} className={classes.img1}/>
                                                    :null
                                                }
                                                {
                                                    props.item.description.img_path3 !== null?
                                                    <img src={`${process.env.REACT_APP_PUBLIC_URL}${props.item.description.img_path3}`} className={classes.img1}/>
                                                    :null
                                                }
                                            </div>
                                        </div>   
                                        :null 
                                    }

                                    <div className={classes.body_border}/>
                                    <h5 className={classes.text_body4}>آدرس پستی برای ارسال کالا</h5>
                                    <div className={classes.row_view}>
                                        <h5 className={classes.text_body4}>شهر - </h5>
                                        <h5 className={classes.text_body8}>{props.item.postal_address.city}</h5>
                                    </div>
                                    <div className={classes.row_view}>
                                        <h5 className={classes.text_body4}>آدرس پستی - </h5>
                                        <h5 className={classes.text_body8}>{props.item.postal_address.postal_address}</h5>
                                    </div>
                                    {
                                        props.item.postal_address.plaque !== null?
                                        <div className={classes.row_view}>
                                            <h5 className={classes.text_body4}>پلاک - </h5>
                                            <h5 className={classes.text_body8}>{props.item.postal_address.plaque}</h5>
                                        </div>
                                        :null
                                    }
                                    {
                                        props.item.postal_address.unit !== null?
                                        <div className={classes.row_view}>
                                            <h5 className={classes.text_body4}>واحد - </h5>
                                            <h5 className={classes.text_body8}>{props.item.postal_address.unit}</h5>
                                        </div>
                                        :null
                                    }
                                    {
                                        props.item.postal_address.postal_code !== null?
                                        <div className={classes.row_view}>
                                            <h5 className={classes.text_body4}>کد پستی - </h5>
                                            <h5 className={classes.text_body8}>{props.item.postal_address.postal_code}</h5>
                                        </div>
                                        :null
                                    }
                                    {
                                        props.item.postal_address.my_own_receiver == false?
                                        <div className={classes.row_view}>
                                            <h5 className={classes.text_body4}>نام دریافت کننده محصول - </h5>
                                            <h5 className={classes.text_body8}>{props.item.postal_address.recipiert_name}</h5>
                                        </div>
                                        :null
                                    }
                                    {
                                        props.item.postal_address.my_own_receiver == false?
                                        <div className={classes.row_view}>
                                            <h5 className={classes.text_body4}>شماره تماس دریافت کننده محصول - </h5>
                                            <h5 className={classes.text_body8}>{props.item.postal_address.recipiert_phone}</h5>
                                        </div>
                                        :null
                                    }
                                </div>
                            </CardBody>
                            {
                                props.item.payment == true?
                                <CardFooter className={classes.footer} >
                                    {
                                        listSelectNewTable.length > 10?
                                        <ExcelFile filename={props.item.job_user.business_title} element={<button>دانلود فایل اکسل</button>}>
                                            <ExcelSheet data={listSelectNewTable} name={`${props.item.job_user.name} ${props.item.job_user.last_name}`}>
                                                <ExcelColumn label="Code" value="name"/>
                                            </ExcelSheet>
                                        </ExcelFile>
                                        :null
                                    }
                                    
                                    <Button className={classes.btn} disabled={!generateCode} onClick={downloadCodeRating}>
                                        {
                                            lodingDownload?
                                            <Spinner size="sm" style={{color:'#FFF'}}/>
                                            :
                                            <h6 className={classes.text_btn}>ایجاد فایل اکسل</h6>
                                        }
                                    </Button>
                                    <Button className={classes.btn} disabled={generateCode} onClick={generateCodeRating}>
                                        {
                                            loadingCode?
                                            <Spinner size="sm" style={{color:'#FFF'}}/>
                                            :
                                            <h6 className={classes.text_btn}>تولید کد یک بار مصرف</h6>
                                        }
                                    </Button>
                                </CardFooter>
                                :null
                            }
                        </Card>
                    </Col>
    )
}
export default PayItem;
PayItem.propTypes = {
    item: PropTypes.object.isRequired
};