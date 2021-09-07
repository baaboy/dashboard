import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddAdCategory = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [iconName, setIconName] = useState('')
    const [iconType, setIconType] = useState('')
    const [boolParent, setBoolParent] = useState(null)
    const [parent, setParent] = useState([])
    const [selectParent, setSelectParent] = useState(null)
    const [child, setChild] = useState(null)
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
    const changeIconName = (text)=>{
        setIconName(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeIconType = (text)=>{
        setIconType(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeChildToTrue = ()=>{
        setChild(true)
    }
    const changeChildToFalse = ()=>{
        setChild(false)
    }
    const changeBoolParentToTrue = ()=>{
        setBoolParent(true)
        getAllAdCategory()
    }
    const changeBoolParentToFalse = ()=>{
        setBoolParent(false)
    }
    const getAllAdCategory = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllAdCategoryInDashboard($level : Int!) {
                        getAllAdCategoryInDashboard(level : $level){
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
            const data = response.data.data.getAllAdCategoryInDashboard;
            if(data){
                setParent(data)
                setSelectParent(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeSelectParent = (text)=>{
        setSelectParent(text.target.value)
    }
    const selectionCategory = ()=>{
        if(nameFa.trim() === '' || nameEn.trim() === '' || iconName.trim() === '' || iconType.trim() === '' || child === null){
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
                        mutation addAdvertisingCategory($name_fa : String!, $name_en : String!, $icon_name : String!, $icon_type : String!, $parent : ID, $child : Boolean!, $level : Int!) {
                            addAdvertisingCategory(name_fa : $name_fa, name_en : $name_en, icon_name : $icon_name, icon_type : $icon_type, parent : $parent, child : $child, level : $level){
                                status,
                                message
                            }
                        }
                    `,
                    variables:{
                        "name_fa" : nameFa,
                        "name_en" : nameEn,
                        "icon_name" : iconName,
                        "icon_type" : iconType,
                        "parent" : boolParent === true?selectParent:null,
                        "child" : child,
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
                    setIconName('')
                    setIconType('')
                    alert('دسته بندی جدید با موفقیت ثبت شد')
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
                    <h6>افزودن دسته بندی جدید آگهی</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewJobMedia}>
                    <FormGroup row className={classes.childTheAdCategory}>
                        <Col md="3">
                            <Label>زیر شاخه دارد؟</Label>
                        </Col>
                        <Col md="9">
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios1" onChange={changeChildToTrue}/>
                                <Label className="form-check-label" check htmlFor="inline-radio1">بله</Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios1" onChange={changeChildToFalse}/>
                                <Label className="form-check-label" check htmlFor="inline-radio2">خیر</Label>
                            </FormGroup>
                        </Col>
                    </FormGroup>
                    <FormGroup row className={classes.childTheAdCategory}>
                        <Col md="3">
                            <Label>زیر شاخه دسته بندی دیگری است؟</Label>
                        </Col>
                        <Col md="9">
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="bool-parent1" name="inline-radios2" onChange={changeBoolParentToTrue}/>
                                <Label className="form-check-label" check htmlFor="inline-radio1">بله</Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Input className="form-check-input" type="radio" id="bool-parent2" name="inline-radios2" onChange={changeBoolParentToFalse}/>
                                <Label className="form-check-label" check htmlFor="inline-radio2">خیر</Label>
                            </FormGroup>
                        </Col>
                    </FormGroup>
                    <Row>
                        {
                            boolParent?
                            <Col xs="12" style={{marginTop:30}}>
                                <FormGroup>
                                    <Label htmlFor="grouping">انتخاب دسته بندی</Label>
                                    <Input type="select" name="grouping" id="grouping" bsSize="lg" value={selectParent} onChange={changeSelectParent}>
                                        {
                                            parent.map((p, i)=>{
                                                return(
                                                    <option key={i} value={p._id}>{`${p.name_fa} / ${p.name_en}`}</option>
                                                )
                                            })
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            :null
                        }
                        <Col xs="12">
                            <FormGroup style={{marginTop:30}}>
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
                                <Label htmlFor="name">نام آیکون</Label>
                                <Input 
                                    type="text" 
                                    id="icon_name"  
                                    value={iconName} 
                                    onChange={changeIconName} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">نوع آیکون</Label>
                                <Input 
                                    type="text" 
                                    id="icon_type"  
                                    value={iconType} 
                                    onChange={changeIconType} 
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
export default AddAdCategory;

