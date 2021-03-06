import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup, Modal, ListGroup, ListGroupItem, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import classes from './banner.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const PriceBannerJob = (props)=>{
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const {dispatch} = useContext(AuthContext);
    const [province, setProvince] = useState([])
    const [provinceSelect, setProvinceSelect] = useState('')
    const [city, setCity] = useState([])
    const [cityModal, setCityModal] = useState(false)
    const [citySelected, setCitySelected] = useState([])
    const [area, setArea] = useState([])
    const [areaModal, setAreaModal] = useState(false)
    const [areaSelected, setAreaSelected] = useState([])
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
    }
    const pushToCitySlelect = ({_id, child})=>{
        if(child == true){
            setCitySelected([])
            getAllAreaInCity(_id)
        } else {
            if(citySelected.find(i=>i ===_id)){
                const index = citySelected.findIndex(i=>i === _id)
                citySelected.splice(index, 1)
                setCitySelected([...citySelected])
            } else {
                citySelected.push(_id)
                setCitySelected([...citySelected])
            }
        }
    }
    const pushToAreaSlelect = (_id)=>{
        if(areaSelected.find(i=>i ===_id)){
            const index = areaSelected.findIndex(i=>i === _id)
            areaSelected.splice(index, 1)
            setAreaSelected([...areaSelected])
        } else {
            areaSelected.push(_id)
            setAreaSelected([...areaSelected])
        }
    }
    const getAllAreaInCity = (_id)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllAreaInDashboard($level : Int!, $city : ID!, $job : ID) {
                        getAllAreaInDashboard(level : $level, city : $city, job : $job){
                            _id,
                            name_fa,
                            price_banner_job{price}
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "city" : _id,
                    "job" : jobSelect
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllAreaInDashboard;
            if(data){
                setArea(data)
                setCityModal(false)
                setAreaModal(true)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changeProviceSelect = (text)=>{
        setProvinceSelect(text.target.value)
        setCity([])
        setCitySelected([])
    }
    const cancelCloseCityModal = ()=>{
        setCityModal(false)
        setCitySelected([])
        setAreaSelected([])
    }
    const okCloseCityModal = ()=>{
        setCityModal(false)
        setAreaSelected([])
    }
    const cancelCloseAreaModal = ()=>{
        setAreaModal(false)
        setAreaSelected([])
    }
    const okCloseAreaModal = ()=>{
        setAreaModal(false)
        setCitySelected([])
    }
    const selectCityItem = ()=>{
        getAllCity()
        setCityModal(true)
    }
    const getAllCity = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllCityInDashboard($level : Int!, $province : ID!, $child : Boolean, $job : ID) {
                        getAllCityInDashboard(level : $level, province : $province, child : $child, job : $job){
                            _id,
                            name_fa,
                            child,
                            price_banner_job{price}
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "province" : provinceSelect,
                    "child" : false,
                    "job" : jobSelect,
                }
            }
        }).then((response)=>{
            const data = response.data.data.getAllCityInDashboard;
            if(data){
                setCity(data)
            }
        }).catch((error)=>{
            console.log(error)
        })
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
                setProvince(data)
                await setProvinceSelect(data[0]._id)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const changePrice = (text)=>{
        setPrice(text.target.value)
        setError(false)
        setErrorText('')
    }

    const selectionCategory = ()=>{
        if(price.trim() === ''){
            setError(true)
            setErrorText('???????? ???? ???????? ????????')
        } else  if(citySelected.length == 0 && areaSelected.length == 0){
            setError(true)
            setErrorText('?????? ???? ???? ?????????? ???????? ?????? ?????? ???? ???????? ?????????? ???????? ???????????? ????????')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation createPriceBannerJob($price : Int!, $job : ID!, $city : [ID], $area : [ID], $level : Int!) {
                        createPriceBannerJob(price : $price, job : $job, city : $city, area : $area, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "price" : parseInt(price),
                    "job" : jobSelect,
                    "city" : citySelected.length == 0?null:citySelected,
                    "area" : areaSelected.length == 0?null:areaSelected,
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
                    setCitySelected([])
                    setAreaSelected([])
                    alert('???????? ???????? ???? ???????????? ?????????? ????')
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
                    <h6>?????????? ???????? ?????? ?????????? ???? ?????? ?????? ??????????</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.content}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="grouping">???????????? ??????</Label>
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
                                <Label htmlFor="grouping">???????????? ??????????</Label>
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
                        <Col xs="12">
                            <Button className={classes.addBtn} onClick={selectCityItem}>
                                <h5 style={{color:'#fff'}}>???????????? ?????? ???? ????????</h5>
                            </Button>
                        </Col>
                        <Modal isOpen={cityModal}
                            className={'modal-success '}>
                        <ModalHeader>???????????? ??????</ModalHeader>
                        <ModalBody>
                        <ListGroup id="list-tab" role="tablist">
                            {
                                city.map((p, i)=>{
                                    let _id = p._id
                                    let child = p.child
                                    return(
                                        <ListGroupItem key={i} style={{height:50}} action active={citySelected.find(i=>i==p._id)?true:false} onClick={()=>pushToCitySlelect({_id, child})}>
                                            <Row style={{flexDirection:'row', justifyContent:'space-between', height:50}}>
                                                <h5>{p.name_fa}</h5>
                                                {
                                                    p.child?
                                                    <i className="icon-arrow-left icons font-2xl d-block"></i>
                                                    :
                                                    p.price_banner_job !== null?
                                                    <p>{`${p.price_banner_job.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ??????????`}</p>
                                                    :
                                                    <i className="icon-plus icons font-2xl d-block"></i>
                                                }
                                            </Row>
                                        </ListGroupItem>
                                    )
                                })
                            }
                        </ListGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" style={{marginInline:10}} onClick={cancelCloseCityModal}>??????</Button>
                            <Button color="success" onClick={okCloseCityModal}>??????????</Button>
                        </ModalFooter>
                        </Modal>
                        <Modal isOpen={areaModal}
                            className={'modal-success '}>
                        <ModalHeader>???????????? ????????</ModalHeader>
                        <ModalBody>
                        <ListGroup id="list-tab" role="tablist">
                            {
                                area.map((p, i)=>{
                                    let _id = p._id
                                    return(
                                        <ListGroupItem key={i} style={{height:50}} action active={areaSelected.find(i=>i==p._id)?true:false} onClick={()=>pushToAreaSlelect(_id)}>
                                            <Row style={{flexDirection:'row', justifyContent:'space-between', height:50}}>
                                                <h5>{p.name_fa}</h5>
                                                {
                                                    p.price_banner_job !== null?
                                                    <p>{`${p.price_banner_job.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} ??????????`}</p>
                                                    :
                                                    <i className="icon-plus icons font-2xl d-block"></i>
                                                }
                                            </Row>
                                        </ListGroupItem>
                                    )
                                })
                            }
                        </ListGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" style={{marginInline:10}} onClick={cancelCloseAreaModal}>??????</Button>
                            <Button color="success" onClick={okCloseAreaModal}>??????????</Button>
                        </ModalFooter>
                        </Modal>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">????????</Label>
                                <Input 
                                    type="number" 
                                    id="name_fa" 
                                    value={price} 
                                    onChange={changePrice} 
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
                            <h5 style={{color:'#fff'}}>????????????</h5>
                        }
                    </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default PriceBannerJob;