import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddPrivacyPolicy = (props)=>{
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('user');
    const [titleFa, setTitleFa] = useState('');
    const [titleEn, setTitleEn] = useState('');
    const [textFa, setTextFa] = useState('');
    const [textEn, setTextEn] = useState('');
    const [number, setNumber] = useState(0);
    const users = ['user', 'job', 'marketer'];
    const {dispatch} = useContext(AuthContext);
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    useEffect(()=>{
        dispatch({type:'check', payload:props})
    }, [])
    
    const changeUser = (text)=>{
        setUser(text.target.value)
    }
    const changeNumber = (text)=>{
        setNumber(text.target.value)
    }
    const changeTitleFa = (text)=>{
        setTitleFa(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeTitleEn = (text)=>{
        setTitleEn(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeTextFa = (text)=>{
        setTextFa(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeTextEn = (text)=>{
        setTextEn(text.target.value)
        setError(false)
        setErrorText('')
    }
    const selectionCategory = ()=>{
        if(user.trim() === '' || textEn.trim() === '' || textFa.trim() === '' || number === 0){
            setError(true)
            setErrorText('وارد کردن متن فارسی و انگلیسی الزامی میباشد')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation addPrivacyPolicy($user : String!, $number : Int!, $title_fa : String, $title_en : String, $text_fa : String!, $text_en : String!, $level : Int!) {
                        addPrivacyPolicy(user : $user, number : $number, title_fa : $title_fa, title_en : $title_en, text_fa : $text_fa, text_en : $text_en, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "user" : user,
                    "number" : parseInt(number),
                    "title_fa" : titleFa.trim() === ''?null:titleFa,
                    "title_en" : titleEn.trim() === ''?null:titleEn,
                    "text_fa" : textFa,
                    "text_en" : textEn,
                    "level" : parseInt(level)
                }
            }
            axios({
                url:'/',
                method:'post',
                data : data
            }).then((response)=>{
                console.log(response)
                setLoading(false)
                if(response.data.errors){
                    const {message} = response.data.errors[0].data[0]
                    setError(true)
                    setErrorText(message)
                } else {
                    alert('بند قوانین با موفقیت افزوده شد')
                    setTitleFa('')
                    setTitleEn('')
                    setTextFa('')
                    setTextEn('')
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
                    <h6>افزودن قوانین و مقررات</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewCity}>
                    <Row>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب نوع کاربر</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={user} onChange={changeUser}>
                                    {
                                        users.map((p, i)=>{
                                            return(
                                                <option key={i} value={p}>{p}</option>
                                            )
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">شماره</Label>
                                <Input 
                                    type="number" 
                                    id="version"  
                                    value={number} 
                                    onChange={changeNumber} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">عنوان فارسی</Label>
                                <Input 
                                    type="text" 
                                    id="name_fa" 
                                    value={titleFa} 
                                    onChange={changeTitleFa} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">عنوان انگلیسی</Label>
                                <Input 
                                    type="text" 
                                    id="name_en"
                                    value={titleEn} 
                                    onChange={changeTitleEn} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">متن فارسی</Label>
                                <Input 
                                    type="textarea" 
                                    id="name_fa"   
                                    rows="6"
                                    value={textFa} 
                                    onChange={changeTextFa} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">متن انگلیسی</Label>
                                <Input 
                                    type="textarea" 
                                    id="name_en"  
                                    rows="6"
                                    value={textEn} 
                                    onChange={changeTextEn} 
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
export default AddPrivacyPolicy;