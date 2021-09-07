import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Users_Number  = React.lazy(() => import('./views/User/Users_Number'));
const Users_Online = React.lazy(() => import('./views/User/Users_Online'));
const Users_List = React.lazy(() => import('./views/User/Users_List'));
const Users_Report = React.lazy(() => import('./views/User/Users_Report'));
//////////////////////////////////////////////////////////////////////////////////
const AllPayments = React.lazy(() => import('./views/Payment/AllPayments'));
const SuccessPayment = React.lazy(() => import('./views/Payment/SuccessPayment'));
const UnsuccessfulPayment = React.lazy(() => import('./views/Payment/UnsuccessfulPayment'));
const PreparingPay = React.lazy(() => import('./views/Payment/PreparingPay'));
const SentPay = React.lazy(() => import('./views/Payment/SentPay'));
const DeliveredPay = React.lazy(() => import('./views/Payment/DeliveredPay'));
const AddGroupingJob = React.lazy(() => import('./views/Category/AddGroupingJob'));
const AddNewJob = React.lazy(() => import('./views/Category/AddNewJob'));
const AddSubCategoryJob = React.lazy(() => import('./views/Category/AddSubCategoryJob'));
const AddProvince = React.lazy(() => import('./views/Category/AddProvince'));
const AddCity = React.lazy(() => import('./views/Category/AddCity'));
const AddArea = React.lazy(() => import('./views/Category/AddArea'));
const AddNewOnlineService = React.lazy(() => import('./views/Category/AddNewOnlineService'));
const AddJobService = React.lazy(() => import('./views/Category/AddJobService'));
const AddCardType = React.lazy(() => import('./views/Category/AddCardType'));
const AddAdCategory = React.lazy(() => import('./views/Category/AddAdCategory'));
const AddCardOrderStatus = React.lazy(() => import('./views/Category/AddCardOrderStatus'));
const AppInfo = React.lazy(() => import('./views/Category/AppInfo'));
const AddPrivacyPolicy = React.lazy(() => import('./views/Category/AddPrivacyPolicy'));
const PriceBannerHome = React.lazy(() => import('./views/BannerAds/PriceBannerHome'));
const PriceBannerJob = React.lazy(() => import('./views/BannerAds/PriceBannerJob'));
const CreateBannerHome = React.lazy(() => import('./views/BannerAds/CreateBannerHome'));
const CreateBannerJob = React.lazy(() => import('./views/BannerAds/CreateBannerJob'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'صفحه اصلی' },
  { path: '/dashboard', name: 'داشبورد', component: Dashboard },
  { path: '/payment/allPayment', name: 'سفارشات کارت ویزیت', component: AllPayments },
  { path: '/payment/successPayment', name: 'سفارشات موفق', component: SuccessPayment },
  { path: '/payment/unsuccessfulPayment', name: 'سفارشات ناموفق', component: UnsuccessfulPayment },
  { path: '/payment/preparingPay', name: 'در حال آماده سازی', component: PreparingPay },
  { path: '/payment/sentPay', name: 'ارسال شده', component: SentPay },
  { path: '/payment/deliveredPay', name: 'تحویل داده شده', component: DeliveredPay },
  { path: '/category/addGroupingJob', name: 'افزودن گروه بندی مشاغل', component: AddGroupingJob },
  { path: '/category/addNewJob', name: 'افزودن شغل جدید', component: AddNewJob },
  { path: '/category/addSubCategoryJob', name: 'افزودن زیر دسته جدید برای مشاغل', component: AddSubCategoryJob },
  { path: '/category/addProvince', name: 'افزودن استان', component: AddProvince },
  { path: '/category/addCity', name: 'افزودن شهر', component: AddCity },
  { path: '/category/addArea', name: 'افزودن محله', component: AddArea },
  { path: '/category/addNewOnlineService', name: 'ایجاد سرویس آنلاین جدید', component: AddNewOnlineService },
  { path: '/category/addJobService', name: 'ایجاد سرویس جدید برای مشاغل', component: AddJobService },
  { path: '/category/addCardType', name: 'افزودن کارت ویزیت جدید', component: AddCardType },
  { path: '/category/addAdCategory', name: 'افزودن دسته بندی آگهی', component: AddAdCategory },
  { path: '/category/addCardOrderStatus', name: 'افزودن وضعیت سفارش', component: AddCardOrderStatus },
  { path: '/category/appInfo', name: 'اطلاعات نرم افزار', component: AppInfo },
  { path: '/category/addPrivacyPolicy', name: 'قوانین و مقررات', component: AddPrivacyPolicy },
  { path: '/banner/priceBannerHome', name: 'قیمت بنر اصلی', component: PriceBannerHome },
  { path: '/banner/priceBannerJob', name: 'قیمت بنر مشاغل', component: PriceBannerJob },
  { path: '/banner/createBannerHome', name: 'ایجاد بنر اصلی', component: CreateBannerHome },
  { path: '/banner/createBannerJob', name: 'ایجاد بنر مشاغل', component: CreateBannerJob },
  { path: '/user/users_number', name: 'تعداد کاربران', component: Users_Number },
  { path: '/user/users_online', name: 'کاربران آنلاین', component: Users_Online },
  { path: '/user/users_list', name: 'لیست کاربران', component: Users_List },
  { path: '/user/users_report', name: 'کاربران گزارش شده', component: Users_Report },
];

export default routes;
