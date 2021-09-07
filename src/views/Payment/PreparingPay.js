import React, { useContext, useState, useEffect } from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
} from 'reactstrap';
import PayItem from './PayItem';
import axios from 'axios';
import classes from './payment.module.css';
import {AuthContext} from '../../context/Auth/AuthContext';
const PreparingPay = (props)=>{
    const [page, setPage] = useState(1);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true)
    const [numPage, setNumPage] = useState(1)
    const {dispatch} = useContext(AuthContext);
    const [groupPage, setGroupPage] = useState(0)
    

    useEffect(()=>{
        dispatch({type:'check', payload:props})
        numberOfPeymentPage()
        let pg = page;
        getAllPayments(pg)
    },[])
    const numberOfPeymentPage = ()=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query numberOfPeymentPage($limit : Int!, $level : Int!, $preparing : Boolean) {
                        numberOfPeymentPage(limit : $limit, level : $level, preparing : $preparing){
                            status,
                            message
                        }
                    }
                `,
                variables:{
                    "limit" : 10,
                    "level" : parseInt(level),
                    "preparing" : true
                }
            }
        }).then((response)=>{
            const data = response.data.data.numberOfPeymentPage;
            if(data){
                setNumPage(data.status)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
    const renderPageItem = (index)=>{
        let pg = (index + 1) + (groupPage * 10)
        return(
            numPage >= pg?
            <PaginationItem active={page == pg?true:false} onClick={()=>changePage(pg)}>
                <PaginationLink tag="button">
                {pg}
                </PaginationLink>
            </PaginationItem>
            :null
        )
    }
    const changePage = (pg)=>{
        setPage(pg)
        setLoading(true)
        setDataSource([])
        getAllPayments(pg)
    }
    const previousPage = ()=>{
        if(page > 1){
            const pg = page - 1;
            setPage(pg)
            setLoading(true)
            setDataSource([])
            getAllPayments(pg)
        }
        if(groupPage > 0 && page == ((groupPage * 10) + 1)){
            setGroupPage(groupPage - 1)
        }
    }
    const nextPage = ()=>{
        if(page < numPage){
            const pg = page + 1;
            setPage(pg)
            setLoading(true)
            setDataSource([])
            getAllPayments(pg)
        }
        if(page == ((groupPage + 1) * 10) && numPage > page){
            setGroupPage(groupPage + 1)
        }
    }
    let item = []
    for (let index = 0; index < 10; index++) {
        item.push(
            renderPageItem(index)
        )
    }
    const getAllPayments = (pg)=>{
        const level = localStorage.getItem('level')
        axios({
            url : '/',
            method : 'post',
            data : {
                query : `
                    query getAllPayment($page : Int, $limit : Int, $level : Int!, $preparing : Boolean) {
                        getAllPayment(page : $page, limit : $limit, level : $level, preparing : $preparing){
                            _id,
                            job_user{_id, name, last_name, business_title, phone, landline_phone, province{name_fa}, city{name_fa}, area{name_fa}, address, job{image, name_fa}, floor_sub{name_fa}, qr},
                            payment,
                            resnumber,
                            price,
                            card_order{card_type{name_fa, price, design_cost, shipping_cost}, card_number},
                            postal_address{city, postal_address, plaque, unit, postal_code, my_own_receiver, recipiert_name, recipiert_phone},
                            description{description, phone, img_path1, img_path2, img_path3},
                            marketer_discount,
                            order_status{name_fa, step},
                            generate_code
                        }
                    }
                `,
                variables:{
                    "page" : pg,
                    "limit" : 10,
                    "level" : parseInt(level),
                    "preparing" : true
                }
            }
        }).then((response)=>{
            const error = response.data.errors
            const data = response.data.data.getAllPayment;
            if(data){
                setDataSource(data)
                setLoading(false)
            } else if(error) {
                const {message} = response.data.errors[0]
                alert(message)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    return(
        loading?
        <div className={classes.loadingGetItem}>
            <Spinner/>
        </div>:
            <div className="animated fadeIn" >
            {
                numPage > 1?
                <Pagination>
                    <PaginationItem onClick={previousPage}>
                        <PaginationLink previous tag="button" />
                    </PaginationItem>
                    {item}
                    <PaginationItem onClick={nextPage}>
                        <PaginationLink next tag="button" />
                    </PaginationItem>
                </Pagination>
                :null
            }
            {
                dataSource.map((p, i)=> {
                    return (
                        <PayItem
                            key={i}
                            item={p}
                        />
                    )
                })
            }
            {
                numPage > 1?
                <Pagination>
                    <PaginationItem onClick={previousPage}>
                        <PaginationLink previous tag="button" />
                    </PaginationItem>
                    {item}
                    <PaginationItem onClick={nextPage}>
                        <PaginationLink next tag="button" />
                    </PaginationItem>
                </Pagination>
                :null
            }
            
        </div>
    )
}
export default PreparingPay;