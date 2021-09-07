import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddJobService = (props)=>{
    const [loading, setLoading] = useState(false);
    const [descriptionFa, setDescriptionFa] = useState('')
    const [descriptionEn, setDescriptionEn] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);
    const [service, setService] = useState([])
    const [serviceSelect, setServiceSelect] = useState('')
    const [jobs, setJobs] = useState([])
    const [jobSelect, setJobSelect] = useState('')

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllService()
        getAllJob()
    }, [])
    const getAllService = (_id)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllServiceInDashboard($level : Int!) {
                        getAllServiceInDashboard(level : $level){
                            _id,
                            name_fa,
                            name_en
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllServiceInDashboard;
            if(data){
                setService(data)
                setServiceSelect(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
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
                    "child" : false
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
    const changeServiceSelect = (text)=>{
        setServiceSelect(text.target.value)
    }
    const changeJobSelect = (text)=>{
        setJobSelect(text.target.value)
    }
    const changeDescriptionFa = (text)=>{
        setDescriptionFa(text.target.value)
        setError(false)
        setErrorText('')
    }
    const changeDescriptionEn = (text)=>{
        setDescriptionEn(text.target.value)
        setError(false)
        setErrorText('')
    }

    const selectionCategory = ()=>{
        if(descriptionFa.trim() === '' || descriptionEn.trim() === ''){
            setError(true)
            setErrorText('وارد کردن نام فارسی و انگلیسی الزامی میباشد')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation addJobService($service : ID!, $job : ID!, $description_fa : String!, $description_en : String!, $level : Int!) {
                        addJobService(service : $service, job : $job, description_fa : $description_fa, description_en : $description_en, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "service" : serviceSelect,
                    "job" : jobSelect,
                    "description_fa" : descriptionFa,
                    "description_en" : descriptionEn,
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
                    setDescriptionFa('')
                    setDescriptionEn('')
                    alert('سرویس مشاغل با موفقیت ایجاد شد')
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
                    <h6>افزودن سرویس مشاغل</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewCity}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب نوع سرویس</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={serviceSelect} onChange={changeServiceSelect}>
                                    {
                                        service.map((p, i)=>{
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
                                <Label htmlFor="name">توضیحات فارسی</Label>
                                <Input 
                                    type="textarea"
                                    rows="3"
                                    id="descriptionFa" 
                                    value={descriptionFa} 
                                    onChange={changeDescriptionFa} 
                                    required 
                                />
                            </FormGroup>
                        </Col>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">توضیحات انگلیسی</Label>
                                <Input 
                                    type="textarea"
                                    rows="3"
                                    id="descriptionEn"  
                                    value={descriptionEn} 
                                    onChange={changeDescriptionEn} 
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
export default AddJobService;