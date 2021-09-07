import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup } from 'reactstrap';
import classes from './category.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const AddNewJob = (props)=>{
    const [loading, setLoading] = useState(false);
    const [nameFa, setNameFa] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [jobGrouping, setJopGrouping] = useState([])
    const [groupSelect, setGroupSelect] = useState('')
    const [selectedImg, setSelectedImg] = useState(null)
    const [child, setChild] = useState(null)
    const {dispatch} = useContext(AuthContext);

    const changeGroupSelect = (text)=>{
        setGroupSelect(text.target.value)
    }

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllJobGrouping()
    }, [])

    const getAllJobGrouping = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllJobGroupingInDashboard($level : Int!) {
                        getAllJobGroupingInDashboard(level : $level){
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
            const data = response.data.data.getAllJobGroupingInDashboard;
            if(data){
                setJopGrouping(data)
                setGroupSelect(data[0]._id)
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
    const removeFile = ()=>{
        setSelectedImg(null)
    }

    const onFileLoad = (event)=>{
        const file = event.target.files;
        setSelectedImg({
            file : file[0],
            preview : URL.createObjectURL(file[0])
        })
    }

    const selectionCategory = ()=>{
        if(nameFa.trim() === '' || nameEn.trim() === '' || groupSelect === '' || child === null || selectedImg === null){
            setError(true)
            setErrorText('پر کردن همه ی موارد خواسته شده برای فرم الزامی میباشد.')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation addJob($name_fa : String!, $name_en : String!, $image : Upload!, $grouping_job : ID!, $child : Boolean!, $level : Int!) {
                        addJob(name_fa : $name_fa, name_en : $name_en, image : $image, grouping_job : $grouping_job, child : $child, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "name_fa" : nameFa,
                    "name_en" : nameEn,
                    "image" : null,
                    "grouping_job" : groupSelect,
                    "child" : child,
                    "level" : parseInt(level)
                }
            }
            let map = {
                0:['variables.image']
            }
            const formD = new FormData();
            formD.append('operations', JSON.stringify(data));
            formD.append('map', JSON.stringify(map));
            formD.append(0, selectedImg.file, selectedImg.file.name);
            axios({
                url:'/',
                method:'post',
                data : formD
            }).then((response)=>{
                console.log(response)
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
                    setSelectedImg(null)
                    alert('شغل جدید با موفقیت ثبت شد')
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
                    <h6>افزودن شغل جدید</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.addNewJobMedia}>
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب گروه بندی</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={groupSelect} onChange={changeGroupSelect}>
                                    {
                                        jobGrouping.map((p, i)=>{
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
                                <Label>زیر شاخه دارد؟</Label>
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
                    <div className={classes.addMediaCategory}>
                        {
                            selectedImg !== null?
                            <div className={classes.file}>
                                <span className={classes.removeIcons} onClick={removeFile}>
                                    <i className="fa fa-remove fa-1g"></i>
                                </span>
                                <img src={selectedImg.preview} alt={selectedImg.url} />
                            </div>
                            :
                            <Label htmlFor="input_file_for_job">
                                <div className={classes.fileSelection}>
                                    <h6 style={{color:'#fff', marginBlock:5, marginInline:10}}>انتخاب تصویر</h6>
                                </div>
                            </Label>
                        }
                        <Input type="file" id="input_file_for_job" name='input_file_for_job' onChange={onFileLoad}/>
                    </div>
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
export default AddNewJob;



