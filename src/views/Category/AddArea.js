import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddArea = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);
    const [province, setProvince] = useState([])
    const [provinceSelect, setProvinceSelect] = useState('')
    const [city, setCity] = useState([])
    const [citySelect, setCitySelect] = useState('')

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllProvince()
    }, [])
    const changeProviceSelect = (text)=>{
        let _id = text.target.value;
        setProvinceSelect(text.target.value)
        setCitySelect('')
        setCity([])
        getAllCity(_id)
    }
    const getAllCity = (_id)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllCityInDashboard($level : Int!, $province : ID!, $child : Boolean) {
                        getAllCityInDashboard(level : $level, province : $province, child : $child){
                            _id,
                            name_fa,
                            name_en
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "province" : _id,
                    "child" : true
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllCityInDashboard;
            if(data){
                setCity(data)
                setCitySelect(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeCitySelect = (text)=>{
        setCitySelect(text.target.value)
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
        }).then(async(response)=>{
            const data = response.data.data.getAllProvinceInDashboard;
            if(data){
                let _id = data[0]._id;
                setProvince(data)
                await setProvinceSelect(data[0]._id)
                getAllCity(_id)
            }
        }).catch((error)=>{
            console.log(error)
        })
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
        } else if(citySelect === ''){
            setError(true)
            setErrorText('شهر مربوط به محله را انتخاب کنید')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation setArea($name_fa : String!, $name_en : String!, $city : ID!, $level : Int!) {
                        setArea(name_fa : $name_fa, name_en : $name_en, city : $city, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "name_fa" : nameFa,
                    "name_en" : nameEn,
                    "city" : citySelect,
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
                    alert('محله جدید با موفقیت ثبت شد')
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
                    <h6>افزودن محله</h6>
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
                                <Label htmlFor="grouping">انتخاب شهر</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={citySelect} onChange={changeCitySelect}>
                                    {
                                        city.map((p, i)=>{
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
export default AddArea;