import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from 'reactstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';
import {AuthContext} from '../../../context/Auth/AuthContext';

const validateSchema = yup.object().shape({
  user_name : yup.string().trim().min(5,'نام کاربری صحیح نیست').max(40,'نام کاربری وارد شده بیش از اندازه طولانی است').required(),
  password : yup.string().trim().min(8,'رمز عبور شما حداقل دارای 8 کاراکتر میباشد').required()
})

const Login = (props) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifed, setIsverifed] = useState(false);
  const {dispatch} = useContext(AuthContext);
  const verifyCallback = (response)=>{
    if(response){
      setIsverifed(true)
    }
  }
  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>

                <Formik
                  initialValues={{ user_name: '', password: '' }}
                  validationSchema={validateSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    if(!isVerifed){
                      setMessage('لطفا من ربات نیستم را تیک بزنید');
                      return false;
                    }
                    setMessage('')
                    setLoading(true)
                    axios({
                      url:'/',
                      method:'post',
                      data: {
                        query : `
                        query {
                          loginBaaboyAdmin(
                            user_name : "${values.user_name}",
                            password : "${values.password}"
                          ) {
                            _id,
                            token,
                            status,
                            message
                          }
                        }
                        `
                      }
                    }).then((response)=>{
                      setLoading(false)
                      if(response.data.errors){
                        const {message} = response.data.errors[0].data[0]
                        setMessage(message)
                        setSubmitting(false)
                        resetForm()
                      } else {
                        const {token} = response.data.data.loginBaaboyAdmin;
                        const level = response.data.data.loginBaaboyAdmin._id;
                        dispatch({type:'login',payload:token, payload2:level})
                        setSubmitting(false)
                        setMessage('');
                        props.history.replace('/dashboard');
                      }
                    }).catch((error)=>{
                      console.log(error)
                    })
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div style={{margin:'15px', color:'red'}}>{message}</div>
                      <h4 className="text-muted">ورود به حساب کابری</h4>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="user_name"
                          placeholder="نام کاربری"
                          autoComplete="username"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.user_name}
                        />
                      </InputGroup>
                      <div style={{margin:'15px', color:'red'}}>{errors.user_name && touched.user_name && errors.user_name}</div>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input 
                          type="password"
                          name="password"
                          placeholder="رمز عبور" 
                          utoComplete="current-password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                      </InputGroup>
                      <div style={{margin:'15px', color:'red'}}>{errors.password && touched.password && errors.password}</div>
                      <InputGroup className="mb-4">
                        <Recaptcha
                          sitekey="6Ld1740bAAAAAANkqJ6vRmVuQerPD-mYn362oUGW"
                          render="explicit"
                          verifyCallback={verifyCallback}
                          type={'image'}
                          size={'compact'}
                          hl="fa"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="mt-3" type="submit" disabled={isSubmitting}>
                            {
                              loading ? <Spinner size="sm" /> : "ورود"
                            }
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  )}
                </Formik>
                </CardBody>
              </Card>
              <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CardBody className="text-center">
                  <div>
                    <h1>Baaboy</h1>
                    <h4>پنل مدیریت شبکه</h4>
                    <Link to="/register">
                      <Button color="primary" className="mt-3" active tabIndex={-1}>درخواست دسترسی</Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
