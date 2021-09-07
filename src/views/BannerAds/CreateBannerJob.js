import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import classes from './banner.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
import JCalendar from 'reactjs-persian-calendar';
import JobUserItem from './JobUserItem';
  
const CreateBannerJob = (props)=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);
    const [province, setProvince] = useState([])
    const [provinceSelect, setProvinceSelect] = useState('')
    const [city, setCity] = useState([])
    const [citySelected, setCitySelected] = useState('')
    const [area, setArea] = useState([])
    const [areaSelected, setAreaSelected] = useState('')
    const [areaBool, setAreaBool] = useState(false)
    const [modal, setModal] = useState(false)
    /////////////////////////////////////////////////
    const [province2, setProvince2] = useState([])
    const [provinceSelect2, setProvinceSelect2] = useState('')
    const [city2, setCity2] = useState([])
    const [citySelected2, setCitySelected2] = useState('')
    const [area2, setArea2] = useState([])
    const [areaSelected2, setAreaSelected2] = useState('')
    const [areaBool2, setAreaBool2] = useState(false)
    /////////////////////////////////////////////////
    const [calenderBool, setCalenderBool] = useState(false)
    const [history, setHistory] = useState(null)
    const [jobUserData, setJobUserData] = useState([])
    const [jobUser, setJobUser] = useState(null)
    const [jobUserTitle, setJobUserTitle] = useState(null)
    const [page, setPage] = useState(1)
    const [jobs, setJobs] = useState([])
    const [jobSelect, setJobSelect] = useState('')


    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllProvince()
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
    const changeJobSelect = (text)=>{
        setJobSelect(text.target.value)
        setJobUser(null)
        setJobUserTitle(null)
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
                const _id = data[0]._id
                setProvince(data)
                await setProvinceSelect(data[0]._id)
                getAllCity(_id)
            }
        }).catch((error)=>{
            console.log(error)
        })
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
                            name_en,
                            child,
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "province" : _id,
                    "child" : false,
                }
            }
        }).then(async(response)=>{
            const data = response.data.data.getAllCityInDashboard;
            if(data){
                setCity(data)
                await setCitySelected(data[0]._id)
                if(data[0].child == true){
                    const _id = data[0]._id
                    setAreaBool(true)
                    getAllAreaInCity(_id)
                }
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const getAllAreaInCity = (_id)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllAreaInDashboard($level : Int!, $city : ID!) {
                        getAllAreaInDashboard(level : $level, city : $city){
                            _id,
                            name_fa,
                            name_en
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "city" : _id,
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllAreaInDashboard;
            if(data){
                setArea(data)
                setAreaSelected(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeProviceSelect = (text)=>{
        let _id = text.target.value;
        setProvinceSelect(text.target.value)
        getAllCity(_id)
        setCity([])
        setCitySelected('')
        setAreaBool(false)
        setAreaSelected('')
        setArea([])
    }
    const changeCitySelected = (text)=>{
        const _id = text.target.value;
        setCitySelected(text.target.value)
        const item = city.find(i => i._id === _id)
        if(item.child == true){
            let _id = text.target.value;
            getAllAreaInCity(_id)
            setAreaBool(true)
        } else {
            setAreaBool(false)
            setAreaSelected('')
            setArea([])
        }
    }
    const changeAreaSelected = (text)=>{
        setAreaSelected(text.target.value)
    }
    /////////////////////////////////////////////////////////////////
    const getAllProvince2 = ()=>{
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
                const _id = data[0]._id
                setProvince2(data)
                await setProvinceSelect2(data[0]._id)
                getAllCity2(_id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const getAllCity2 = (_id)=>{
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
                            child,
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "province" : _id,
                    "child" : false,
                }
            }
        }).then(async(response)=>{
            const data = response.data.data.getAllCityInDashboard;
            if(data){
                setCity2(data)
                await setCitySelected2(data[0]._id)
                if(data[0].child == true){
                    const _id = data[0]._id
                    setAreaBool2(true)
                    getAllAreaInCity2(_id)
                } else {
                    const city = data[0]._id;
                    const area = null;
                    getAllJobUserInDashboard({city, area})
                }
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const getAllAreaInCity2 = (_id)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllAreaInDashboard($level : Int!, $city : ID!) {
                        getAllAreaInDashboard(level : $level, city : $city){
                            _id,
                            name_fa,
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "city" : _id,
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllAreaInDashboard;
            if(data){
                setArea2(data)
                setAreaSelected2(data[0]._id)
                const city = null;
                const area = data[0]._id;
                getAllJobUserInDashboard({city, area})
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeProviceSelect2 = (text)=>{
        let _id = text.target.value;
        setProvinceSelect2(text.target.value)
        getAllCity2(_id)
        setCity2([])
        setCitySelected2('')
        setAreaBool2(false)
        setAreaSelected2('')
        setArea2([])
    }
    const changeCitySelected2 = (text)=>{
        const _id = text.target.value;
        setCitySelected2(text.target.value)
        const item = city2.find(i => i._id === _id)
        if(item.child == true){
            let _id = text.target.value;
            getAllAreaInCity2(_id)
            setAreaBool2(true)
        } else {
            setAreaBool2(false)
            setAreaSelected2('')
            setArea2([])
            const city = _id;
            const area = null;
            getAllJobUserInDashboard({city, area})
        }
    }
    const changeAreaSelected2 = (text)=>{
        setAreaSelected2(text.target.value)
        const city = null;
        const area = text.target.value;
        getAllJobUserInDashboard({city, area})
    }
    const getAllJobUserInDashboard = ({city, area})=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllJobUserInDashboard($page : Int!, $city : ID, $area : ID, $job : ID, $level : Int!) {
                        getAllJobUserInDashboard(page : $page, city : $city, area : $area, job : $job, level : $level){
                            _id,
                            name,
                            last_name,
                            business_title,
                            avatar_image,
                            background_image,
                            number_rating,
                            average_rating
                        }
                    }
                `,
                variables:{
                    "page" : page,
                    "city" : city,
                    "area" : area,
                    "job" : jobSelect,
                    "level" : parseInt(level),
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllJobUserInDashboard;
            if(data){
                setJobUserData(data)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const cancelCloseModal = ()=>{
        setModal(false)
        setJobUser(null)
        setJobUserTitle(null)
    }
    const okCloseModal = ()=>{
        setModal(false)
    }
    const selectBusiness = ()=>{
        getAllProvince2()
        setModal(true)
    }
    const openCalender = ()=>{
        setCalenderBool(true)
    }
    const changeHistory = (x)=>{
        setHistory(x)
        setCalenderBool(false)
    }
    const selectionCategory = ()=>{
        if(citySelected.trim() === '' || jobSelect.trim() === '' || jobUser === null || history === null){
            setError(true)
            setErrorText('همه موارد خواسته شده را پر کنید')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation createBannerJobfromAdmin($job_user : ID!, $job : ID!, $city : ID!, $area : ID, $history : String!, $level : Int!) {
                        createBannerJobfromAdmin(job_user : $job_user, job : $job, city : $city, area : $area, history : $history, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "job_user" : jobUser,
                    "job" : jobSelect,
                    "city" : citySelected,
                    "area" : areaSelected === ''?null:areaSelected,
                    "history" : history,
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
                    alert('بنر جدید با موفقیت ایجاد شد')
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
                    <h6>ایجاد بنر مشاغل</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.content}>
                    <Row>
                        <Col>
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
                        <Col xs="12" xs="12" style={{marginTop:30}}>
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
                        <Col xs="12" xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="grouping">انتخاب شهر</Label>
                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={citySelected} onChange={changeCitySelected}>
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
                        {
                            areaBool?
                            <Col xs="12" xs="12" style={{marginTop:30}}>
                                <FormGroup>
                                    <Label htmlFor="grouping">انتخاب محله</Label>
                                    <Input type="select" name="grouping" id="grouping" bsSize="lg" value={areaSelected} onChange={changeAreaSelected}>
                                        {
                                            area.map((p, i)=>{
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
                            <div className={classes.row_view} style={{marginTop:40}}>
                                <Button className={classes.btn} onClick={openCalender}>
                                    <h5 style={{color:'#fff'}}>تاریخ نمایش بنر</h5>
                                </Button>
                                {
                                    history !== null?
                                    <h5 style={{margin:10}}>{history}</h5>
                                    :null
                                }
                            </div>
                        </Col>
                        {
                            calenderBool?
                            <JCalendar 
                                locale={'fa'} 
                                color={'#129651'}
                                size={40}
                                onClick={(x)=>changeHistory(x)}
                                itemRender={(key, item, children) => children}
                            />
                            :null
                        }
                        <Col xs="12">
                            <div className={classes.row_view} style={{marginTop:40}}>
                                <Button className={classes.btn} onClick={selectBusiness}>
                                    <h5 style={{color:'#fff'}}>انتخاب کسب و کار</h5>
                                </Button>
                                {
                                    jobUserTitle !== null?
                                    <h5 style={{margin:10}}>{jobUserTitle}</h5>
                                    :null
                                }
                            </div>
                        </Col>
                        <Modal isOpen={modal}
                            className={'modal-success modal-lg'}>
                            <ModalHeader >
                                    <Col xs="12" xs="12">
                                        <FormGroup>
                                            <Input type="select" name="grouping" id="grouping" bsSize="lg" value={provinceSelect2} onChange={changeProviceSelect2}>
                                                {
                                                    province2.map((p, i)=>{
                                                        return(
                                                            <option key={i} value={p._id}>{p.name_fa}</option>
                                                        )
                                                    })
                                                }
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12" xs="12">
                                        <FormGroup>
                                            <Input type="select" name="grouping" id="grouping" bsSize="lg" value={citySelected2} onChange={changeCitySelected2}>
                                                {
                                                    city2.map((p, i)=>{
                                                        return(
                                                            <option key={i} value={p._id}>{p.name_fa}</option>
                                                        )
                                                    })
                                                }
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    {
                                        areaBool2?
                                        <Col xs="12" xs="12">
                                            <FormGroup>
                                                <Input type="select" name="grouping" id="grouping" bsSize="lg" value={areaSelected2} onChange={changeAreaSelected2}>
                                                    {
                                                        area2.map((p, i)=>{
                                                            return(
                                                                <option key={i} value={p._id}>{p.name_fa}</option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        :null
                                    }
                            </ModalHeader>
                            <ModalBody>
                                {
                                    jobUserData.map((p, i)=>{
                                        const select = p._id == jobUser?true:false;
                                        const selectionTrue = ()=>{
                                            setJobUser(p._id)
                                            setJobUserTitle(p.business_title)
                                        }
                                        const selectionFalse = ()=>{
                                            setJobUser(null)
                                            setJobUserTitle(null)
                                        }
                                        return(
                                            <JobUserItem
                                                key={i}
                                                item={p}
                                                select={select}
                                                selectionTrue={selectionTrue}
                                                selectionFalse={selectionFalse}
                                            />
                                        )
                                    })
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" style={{marginInline:10}} onClick={cancelCloseModal}>لغو</Button>
                                <Button color="success" onClick={okCloseModal}>تایید</Button>
                            </ModalFooter>
                        </Modal>
                        
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
                            <h5 style={{color:'#fff'}}>ایجاد بنر</h5>
                        }
                    </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default CreateBannerJob;