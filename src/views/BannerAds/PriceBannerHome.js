import React, {useState, useEffect, useContext} from 'react';
import { Button, Card, CardBody, CardHeader, Input, Col, Spinner, Label, Row, FormGroup, Modal, ListGroup, ListGroupItem, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import classes from './banner.module.css';
import axios from 'axios';
import {AuthContext} from '../../context/Auth/AuthContext';
  
const PriceBannerHome = (props)=>{
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

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        getAllProvince()
    }, [])
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
                    query getAllAreaInDashboard($level : Int!, $city : ID!) {
                        getAllAreaInDashboard(level : $level, city : $city){
                            _id,
                            name_fa,
                            price_banner_home{price}
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "city" : _id
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
        let _id = text.target.value;
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
                    query getAllCityInDashboard($level : Int!, $province : ID!, $child : Boolean) {
                        getAllCityInDashboard(level : $level, province : $province, child : $child){
                            _id,
                            name_fa,
                            child,
                            price_banner_home{price}
                        }
                    }
                `,
                variables:{
                    "level" : parseInt(level),
                    "province" : provinceSelect,
                    "child" : false
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
                let _id = data[0]._id;
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
            setErrorText('قیمت را وارد کنید')
        } else  if(citySelected.length == 0 && areaSelected.length == 0){
            setError(true)
            setErrorText('شهر ها یا محلات مورد نظر خود را برای ایجاد قیمت انتخاب کنید')
        } else if(loading === false){
            const level = localStorage.getItem('level')
            setLoading(true)
            setError(false)
            setErrorText('')
            let data = {
                query : `
                    mutation createPriceBannerHome($price : Int!, $city : [ID], $area : [ID], $level : Int!) {
                        createPriceBannerHome(price : $price, city : $city, area : $area, level : $level){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "price" : parseInt(price),
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
                    alert('قیمت جدید با موفقیت ایجاد شد')
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
                    <h6>ایجاد قیمت بنر اصلی در شهر های مختلف</h6>
                </CardHeader>
                <CardBody>
                    <div className={classes.content}>
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
                        <Col xs="12">
                            <Button className={classes.addBtn} onClick={selectCityItem}>
                                <h5 style={{color:'#fff'}}>انتخاب شهر یا محله</h5>
                            </Button>
                        </Col>
                        <Modal isOpen={cityModal}
                            className={'modal-success '}>
                        <ModalHeader>انتخاب شهر</ModalHeader>
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
                                                    p.price_banner_home !== null?
                                                    <p>{`${p.price_banner_home.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</p>
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
                            <Button color="secondary" style={{marginInline:10}} onClick={cancelCloseCityModal}>لغو</Button>
                            <Button color="success" onClick={okCloseCityModal}>تایید</Button>
                        </ModalFooter>
                        </Modal>
                        <Modal isOpen={areaModal}
                            className={'modal-success '}>
                        <ModalHeader>انتخاب محله</ModalHeader>
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
                                                    p.price_banner_home !== null?
                                                    <p>{`${p.price_banner_home.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} تومان`}</p>
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
                            <Button color="secondary" style={{marginInline:10}} onClick={cancelCloseAreaModal}>لغو</Button>
                            <Button color="success" onClick={okCloseAreaModal}>تایید</Button>
                        </ModalFooter>
                        </Modal>
                        <Col xs="12" style={{marginTop:30}}>
                            <FormGroup>
                                <Label htmlFor="name">قیمت</Label>
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
                            <h5 style={{color:'#fff'}}>افزودن</h5>
                        }
                    </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
export default PriceBannerHome;