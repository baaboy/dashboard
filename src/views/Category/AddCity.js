import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddCity = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);
    const [child, setChild] = useState(null)
    const [province, setProvince] = useState([])
    const [provinceSelect, setProvinceSelect] = useState('')

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllProvince()
    }, [])
    const changeProviceSelect = (text)=>{
        setProvinceSelect(text.target.value)
    }
    const getAllProvince = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllProvinceInDashboard($level : Int!) {
                        getAllProvinceInDashboard(level : $level){
                            _id,
                            name_fa,
                            name_en
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level)
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllProvinceInDashboard;
            if(data){
                setProvince(data)
                setProvinceSelect(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeChildToTrue = ()=>{
        setChild(true)
    }
    const changeChildToFalse = ()=>{
        setChild(false)
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
            setErrorText('وارد کردن نام فارسی و انگلیسی الزامی میباشد')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation setCity($name_fa : String!, $name_en : String!, $province : ID!, $child : Boolean!, $level : Int!) {
                        setCity(name_fa : $name_fa, name_en : $name_en, province : $province, child : $child, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "name_fa" : nameFa,
                    "name_en" : nameEn,
                    "province" : provinceSelect,
                    "child" : child,
                    "level" : parseInt(level)
                }
            }
            axios({
                url:'/',
                method:'post',
                data : data
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
                    alert('َشهر جدید با موفقیت ثبت شد')
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
                    <h6>افزودن شهر</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewCity}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب استان</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={provinceSelect} onChange={changeProviceSelect}>
                                    {
                                        province.map((p, i)=>{
                                            return(
                                                <option key={i} value={p._id}>{`${p.name_fa} / ${p.name_en}`}</option>
                                            )
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
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
                        
                    </Row>
                    <FormGroup row className={classes.childTheJob}>
                            <Col md="3">
                                <Label>محله دارد؟</Label>
                            </Col>
                            <Col md="9">
                                <FormGroup check inline>
                                    <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" onChange={changeChildToTrue}/>
                                    <Label className="form-check-label" check htmlFor="inline-radio1">بله</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" onChange={changeChildToFalse}/>
                                    <Label className="form-check-label" check htmlFor="inline-radio2">خیر</Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
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
export default AddCity;