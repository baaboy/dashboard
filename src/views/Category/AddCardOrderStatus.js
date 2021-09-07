import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddCardOrderStatus = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [step, setStep] = useState(0)
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);

    useEffect(()=>{
        dispatch({type:'check', payload:props})
    },[])

    const changeStep = (text)=>{
        setStep(text.target.value)
    }

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

    const selectionCategory = ()=>{
        if(nameFa.trim() === '' || nameEn.trim() === ''){
            setError(true)
            setErrorText('نام فارسی و انگلیسی برای ایجاد وضعیت سفارش الزامی میباشد.')
        } else {
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            axios({
                url:'/',
                method:'post',
                data : {
                    query : `
                        mutation addNewOrderStatus($name_fa : String!, $name_en : String!, $step : Int!, $level : Int!) {
                            addNewOrderStatus(name_fa : $name_fa, name_en : $name_en, step : $step, level : $level){
                                status,
                                message
                            }
                        }
                    `,
                    variables:{
                        "name_fa" : nameFa,
                        "name_en" : nameEn,
                        "step" : parseInt(step),
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
                    alert('وضعیت سفارش جدید با موفقیت ثبت شد')
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
                    <h6>افزودن وضعیت سفارش جدید</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addGroupingJob}>
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
                                <Label htmlFor="name">شماره مرحله وضعیت سفارش</Label>
                                <Input 
                                    type="number" 
                                    id="step"  
                                    value={step} 
                                    onChange={changeStep} 
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
export default AddCardOrderStatus;

