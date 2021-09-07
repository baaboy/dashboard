import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AppInfo = (props)=>{
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('android');
    const [name, setName] = useState('user');
    const [url, setUrl] = useState(['']);
    const [urlNameFa, setUrlNameFa] = useState(['']);
    const [urlNameEn, setUrlNameEn] = useState(['']);
    const [msgFa, setMsgFa] = useState('');
    const [msgEn, setMsgEn] = useState('');
    const [version, setVersion] = useState(1);
    const [required, setRequired] = useState(false)
    const app_type = ['android', 'ios']
    const app_name = ['user', 'job', 'marketer']
    const {dispatch} = useContext(AuthContext);
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')

    useEffect(()=>{
        dispatch({type:'check', payload:props})
    }, [])
    const changeType = (text)=>{
        setType(text.target.value)
    }
    const changeName = (text)=>{
        setName(text.target.value)
    }
    const changeUrl = ( {text,i})=>{
        url[i] = text.target.value;
        setUrl([...url])
    }
    const changeNameFaUrl = ( {text,i})=>{
        urlNameFa[i] = text.target.value;
        setUrlNameFa([...urlNameFa])
    }
    const changeNameEnUrl = ( {text,i})=>{
        urlNameEn[i] = text.target.value;
        setUrlNameEn([...urlNameEn])
    }
    const addUrl = ()=>{
        if(url.length <3) {
            url.push('')
            setUrl([...url])
            urlNameFa.push('')
            setUrlNameFa([...urlNameFa])
            urlNameEn.push('')
            setUrlNameEn([...urlNameEn])
        }
    }
    const removeUrl = ()=>{
        if(url.length > 1) {
            url.pop()
            setUrl([...url])
            urlNameFa.pop()
            setUrlNameFa([...urlNameFa])
            urlNameEn.pop()
            setUrlNameEn([...urlNameEn])
        }
    }
    const changeDescriptionFa = (text)=>{
        setMsgFa(text.target.value)
    }
    const changeDescriptionEn = (text)=>{
        setMsgEn(text.target.value)
    }
    const changeVersion = (text)=>{
        setVersion(text.target.value)
    }
    const changeRequiredToTrue = ()=>{
        setRequired(true)
    }
    const changeRequiredToFalse = ()=>{
        setRequired(false)
    }


    const selectionCategory = ()=>{
        const emptyUrl = url.find(i => i==='')
        const emptyUrlNameFa = urlNameFa.find(i => i==='')
        const emptyUrlNameEn = urlNameEn.find(i => i==='')
        if(type.trim() === '' || name.trim() === '' || msgFa.trim() === '' || msgEn.trim() === '' || version === 0){
            setError(true)
            setErrorText('وارد کردن همه موارد فرم الزامی میباشد')
        } else if(emptyUrlNameEn !== undefined || emptyUrlNameFa !== undefined || emptyUrl !== undefined ){
            console.log(emptyUrl)
            console.log(emptyUrlNameFa)
            console.log(emptyUrlNameEn)
            setError(true)
            setErrorText('فرم افزوده شده نمیتواند خالی بماند')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation addAppInfoItem($type : String!, $name : String!, $update_url : [String]!, $url_name_fa : [String]!, $url_name_en : [String]!, $update_msg_fa : String!, $update_msg_en : String!, $version : Int!, $required : Boolean!, $level : Int!) {
                        addAppInfoItem(type : $type, name : $name, update_url : $update_url, url_name_fa : $url_name_fa, url_name_en : $url_name_en, update_msg_fa : $update_msg_fa, update_msg_en : $update_msg_en, version : $version, required : $required, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "type" : type,
                    "name" : name,
                    "update_url" : url,
                    "url_name_fa" : urlNameFa,
                    "url_name_en" : urlNameEn,
                    "update_msg_fa" : msgFa,
                    "update_msg_en" : msgEn,
                    "version" : parseInt(version),
                    "required" : required,
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
                    alert('اطلاعات نرم افزار با موفقیت افزوده شد')
                    setUrl([''])
                    setUrlNameFa([''])
                    setUrlNameEn([''])
                    setMsgFa('')
                    setMsgEn('')
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
                    <h6>افزودن اطلاعات نرم افزار</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewCity}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب نوع نرم افزار</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={type} onChange={changeType}>
                                    {
                                        app_type.map((p, i)=>{
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
                                <Label htmlFor="grouping">انتخاب نام نرم افزار</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={name} onChange={changeName}>
                                    {
                                        app_name.map((p, i)=>{
                                            return(
                                                <option key={i} value={p}>{p}</option>
                                            )
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                        {
                            url.map((p, i)=>{
                                return(
                                    <Col key={i} xs="12" style={{marginTop:i===0?30:0}}>
                                        <FormGroup>
                                            {
                                                i === 0?
                                                <Label htmlFor="name">لینک</Label>
                                                :null
                                            }
                                            <Input 
                                                type="text" 
                                                id="url" 
                                                value={p} 
                                                onChange={(text)=>changeUrl({text, i})} 
                                                required 
                                            />
                                        </FormGroup>
                                    </Col>
                                )
                            })
                        }
                        <Col xs="12">
                            <Button style={{width:100, height:30, marginLeft:10, alignItems:'center', justifyContent:'center'}} onClick={addUrl}>
                                <h6 style={{color:'#fff'}}>افزودن</h6>
                            </Button>
                            <Button style={{width:100, height:30, marginRight:10, alignItems:'center', justifyContent:'center'}} onClick={removeUrl}>
                                <h6 style={{color:'#fff'}}>حذف</h6>
                            </Button>
                        </Col>
                        {
                            urlNameFa.map((p, i)=>{
                                return(
                                    <Col key={i} xs="12" style={{marginTop:i===0?30:0}}>
                                        <FormGroup>
                                            {
                                                i === 0?
                                                <Label htmlFor="name">نام فارسی لینک</Label>
                                                :null
                                            }
                                            <Input 
                                                type="text" 
                                                id="url_name_fa" 
                                                value={p} 
                                                onChange={(text)=>changeNameFaUrl({text, i})} 
                                                required 
                                            />
                                        </FormGroup>
                                    </Col>
                                )
                            })
                        }
                        <Col xs="12">
                            <Button style={{width:100, height:30, marginLeft:10, alignItems:'center', justifyContent:'center'}} onClick={addUrl}>
                                <h6 style={{color:'#fff'}}>افزودن</h6>
                            </Button>
                            <Button style={{width:100, height:30, marginRight:10, alignItems:'center', justifyContent:'center'}} onClick={removeUrl}>
                                <h6 style={{color:'#fff'}}>حذف</h6>
                            </Button>
                        </Col>
                        {
                            urlNameEn.map((p, i)=>{
                                return(
                                    <Col key={i} xs="12" style={{marginTop:i===0?30:0}}>
                                        <FormGroup>
                                            {
                                                i === 0?
                                                <Label htmlFor="name">نام انگلیسی لینک</Label>
                                                :null
                                            }
                                            <Input 
                                                type="text" 
                                                id="url_name_en" 
                                                value={p} 
                                                onChange={(text)=>changeNameEnUrl({text, i})} 
                                                required 
                                            />
                                        </FormGroup>
                                    </Col>
                                )
                            })
                        }
                        <Col xs="12">
                            <Button style={{width:100, height:30, marginLeft:10, alignItems:'center', justifyContent:'center'}} onClick={addUrl}>
                                <h6 style={{color:'#fff'}}>افزودن</h6>
                            </Button>
                            <Button style={{width:100, height:30, marginRight:10, alignItems:'center', justifyContent:'center'}} onClick={removeUrl}>
                                <h6 style={{color:'#fff'}}>حذف</h6>
                            </Button>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">متن فارسی پیام</Label>
                                <Input 
                                    type="textarea"
                                    rows="3"
                                    id="update_msg_fa" 
                                    value={msgFa} 
                                    onChange={changeDescriptionFa} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">متن انگلیسی پیام</Label>
                                <Input 
                                    type="textarea"
                                    rows="3"
                                    id="update_msg_en"  
                                    value={msgEn} 
                                    onChange={changeDescriptionEn} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">ورژن نرم افزار</Label>
                                <Input 
                                    type="number" 
                                    id="version"  
                                    value={version} 
                                    onChange={changeVersion} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup row className={classes.childTheJob}>
                        <Col md="4">
                            <Label>به روز رسانی ضروری است؟</Label>
                        </Col>
                        <Col md="5">
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" onChange={changeRequiredToTrue}/>
                                <Label className="form-check-label" check htmlFor="inline-radio1">بله</Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" onChange={changeRequiredToFalse}/>
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
export default AppInfo;