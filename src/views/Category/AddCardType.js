import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddCardType = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [minNumber, setMinNumber] = useState(0)
    const [price, setPrice] = useState(0)
    const [designCost, setDesignCost] = useState(0)
    const [shippingCost, setShippingCost] = useState(0)
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);

    useEffect(()=>{
        dispatch({type:'check', payload:props})
    },[])

    const changeNameFa = (text)=>{
        setNameFa(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeNameEn = (text)=>{
        setNameEn(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeMinNumber = (text)=>{
        setMinNumber(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changePrice = (text)=>{
        setPrice(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeDesignCost = (text)=>{
        setDesignCost(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeShippingCost = (text)=>{
        setShippingCost(text.target.value)
        setError(false)
        setErrorText('')
    }
    const selectionCategory = ()=>{
        if(nameFa.trim() === '' || nameEn.trim() === '' || minNumber === 0 || price === 0 || designCost === 0 || shippingCost === 0){
            setError(true)
            setErrorText('پر کردن تمام موارد فرم الزامی میباشد')
        } else {
            const level = localStorage.getItem('level')
            console .log(level)
            setLoading(true)
            setError(false)
            setErrorText('')
            axios({
                url:'/',
                method:'post',
                data : {
                    query : `
                        mutation addCardTypes($name_fa : String!, $name_en : String!, $min_number : Int!, $price : Int!, $design_cost : Int!, $shipping_cost : Int!, $level : Int!) {
                            addCardTypes(name_fa : $name_fa, name_en : $name_en, min_number : $min_number, price : $price, design_cost : $design_cost, shipping_cost : $shipping_cost, level : $level){
                                status,
                                message
                            }
                        }
                    `,
                    variables:{
                        "name_fa" : nameFa,
                        "name_en" : nameEn,
                        "min_number" : parseInt(minNumber),
                        "price" : parseInt(price),
                        "design_cost" : parseInt(designCost),
                        "shipping_cost" : parseInt(shippingCost),
                        "level" : parseInt(level)
                    }
                }
            }).then((response)=>{
                setLoading(false)
                if(response.data.errors){
                    const {message} = response.data.errors[0].data[0]
                    setError(true)
                    setErrorText(message)
                } else {
                    setError(false)
                    setErrorText('')
                    setNameFa('')
                    setNameEn('')
                    alert('نوع کارت ویزیت جدید با موفقیت اضافه شد')
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    return(
        <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    <h6>افزودن کارت ویزیت جدید</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewJobMedia}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="name">نام فارسی</Label>
                                <Input 
                                    type="text" 
                                    id="name_fa" 
                                    value={nameFa} 
                                    onChange={changeNameFa} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">نام انگلیسی</Label>
                                <Input 
                                    type="text" 
                                    id="name_en"  
                                    value={nameEn} 
                                    onChange={changeNameEn} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">حداقل تیراژ کارت</Label>
                                <Input 
                                    type="number" 
                                    id="min_number"  
                                    value={minNumber} 
                                    onChange={changeMinNumber} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">قیمت هر عدد کارت (تومان)</Label>
                                <Input 
                                    type="number" 
                                    id="price"  
                                    value={price} 
                                    onChange={changePrice} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">هزینه طراحی (تومان)</Label>
                                <Input 
                                    type="number" 
                                    id="design_cost"  
                                    value={designCost} 
                                    onChange={changeDesignCost} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">هزینه ارسال (تومان)</Label>
                                <Input 
                                    type="number" 
                                    id="shipping_cost"  
                                    value={shippingCost} 
                                    onChange={changeShippingCost} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    {
                        error?
                        <h6 className={classes.errorText} style={{marginTop:30}}>{errorText}</h6>
                        :null
                    }
                    <Button className={classes.addBtn} onClick={selectionCategory}>
                        {
                            loading?
                            <Spinner size="sm" style={{color:'#FFF'}}/>
                            :
                            <h5 style={{color:'#fff'}}>افزودن</h5>
                        }
                    </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default AddCardType;

