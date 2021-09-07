import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
import { AppSwitch } from '@coreui/react';
  
const AddSubCategoryJob = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [jobs, setJobs] = useState([])
    const [jobSelect, setJobSelect] = useState('')
    const [parent, setParent] = useState(null)
    const [child, setChild] = useState(false)
    const [boolParent, setBoolParent] = useState(false)
    const [parentDataSource, setParentDataSource] = useState([])
    const {dispatch} = useContext(AuthContext);

    const changeJobSelect = (text)=>{
        setJobSelect(text.target.value)
        setBoolParent(false)
        setChild(false)
        setParent(null)
    }

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllJob()
    }, [])

    const getAllJob = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllJobInDashboard($level : Int!, $child : Boolean) {
                        getAllJobInDashboard(level : $level, child : $child){
                            _id,
                            name_fa,
                            name_en
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "child" : true
                }
            }
        }).then((response)=>{
            console.log(response)
            const data = response.data.data.getAllJobInDashboard;
            if(data){
                setJobs(data)
                setJobSelect(data[0]._id)
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
        if(nameFa.trim() === '' || nameEn.trim() === '' || jobSelect === ''){
            setError(true)
            setErrorText('پر کردن همه ی موارد خواسته شده برای فرم الزامی میباشد.')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation addSubCategoryJob($name_fa : String!, $name_en : String!, $job : ID!, $parent : ID, $child : Boolean! $level : Int!) {
                        addSubCategoryJob(name_fa : $name_fa, name_en : $name_en, job : $job, parent : $parent, child : $child, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "name_fa" : nameFa,
                    "name_en" : nameEn,
                    "job" : jobSelect,
                    "parent" : parent,
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
                    alert('زیر دسته با موفقیت ثبت شد')
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }
    const changeBoolParent = ()=>{
        if(boolParent){
            setBoolParent(false)
            setParent(null)
        } else if(jobSelect !== '') {
            setBoolParent(true)
            const level = localStorage.getItem('level')
            axios({
                url : '/',
                method : 'post',
                data : {
                    query : `
                        query getAllSubCategoryCanSetParent($job : ID!, $level : Int!) {
                            getAllSubCategoryCanSetParent(job : $ job, level : $level){
                                _id,
                                name_fa,
                                name_en,
                                child
                            }
                        }
                    `,
                    variables:{
                        "job" : jobSelect,
                        "level" : parseInt(level),
                    }
                }
            }).then((response)=>{
                const data = response.data.data.getAllSubCategoryCanSetParent;
                if(data){
                    setParentDataSource(data)
                    if(data.length > 0) {
                        setParent(data[0]._id)
                    }
                }
            }).catch((error)=>{
                console.log(error)
            })
        } else {
            alert('باید ابتدا شغل مربوطه انتخاب شود.')
        }
    }
    const changeChild = ()=>{
        setChild(!child)
    }
    const changeParent = (text)=>{
        setParent(text.target.value)
    }
    return(
        <div className="animated fadeIn">
            <Card>
                <CardHeader>
                    <h6>افزودن زیر دسته جدید برای مشاغل</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewSubJob}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب شغل</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={jobSelect} onChange={changeJobSelect}>
                                    {
                                        jobs.map((p, i)=>{
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
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">دارای زیر دسته میباشد؟</Label>
                                <AppSwitch className={'float-right mb-0'} label onChange={changeChild} checked={child} color={'success'} defaultChecked={child} size={'lg'}/>
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">انتخاب والد؟</Label>
                                <AppSwitch className={'float-right mb-0'} label onChange={changeBoolParent} checked={boolParent} color={'success'} defaultChecked={boolParent} size={'lg'}/>
                            </FormGroup>
                        </Col>
                        {
                            boolParent?
                            <Col xs="12">
                                <FormGroup>
                                    <Input type="select" name="grouping" id="grouping" bsSize="lg" value={parent} onChange={changeParent}>
                                        {
                                            parentDataSource.map((p, i)=>{
                                                return(
                                                    <option key={i} value={p._id}>{`${p.name_fa} / ${p.name_en}`}</option>
                                                )
                                            })
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            :
                            null
                        }
                        
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
export default AddSubCategoryJob;