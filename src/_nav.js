export default {
  items: [
    {
      name: 'داشبورد',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'کاربران',
      url: '/user',
      icon: 'icon-people',
      children: [
        {
          name: 'تعداد کاربران',
          url: '/user/users_number',
          icon: 'icon-puzzle',
        },
        {
          name: 'کاربران آنلاین',
          url: '/user/users_online',
          icon: 'icon-puzzle',
        },
        {
          name: 'لیست کاربران',
          url: '/user/users_list',
          icon: 'icon-puzzle',
        },
        {
          name: 'کاربران گزارش شده',
          url: '/user/users_report',
          icon: 'icon-puzzle',
        },
      ]
    },
    {
      name : 'سفارشات کارت ویزیت',
      url : '/payment',
      icon : 'icon-credit-card',
      children: [
        {
          name: 'همه سفارشات',
          url: '/payment/allPayment',
          icon: 'icon-puzzle',
        },
        {
          name: 'سفارشات موفق',
          url: '/payment/successPayment',
          icon: 'icon-puzzle',
        },
        {
          name: 'سفارشات ناموفق',
          url: '/payment/unsuccessfulPayment',
          icon: 'icon-puzzle',
        },
        {
          name: 'در حال آماده سازی',
          url: '/payment/preparingPay',
          icon: 'icon-puzzle',
        },
        {
          name: 'ارسال شده',
          url: '/payment/sentPay',
          icon: 'icon-puzzle',
        },
        {
          name: 'تحویل داده شده',
          url: '/payment/deliveredPay',
          icon: 'icon-puzzle',
        },
      ]
    },
    {
      name : 'افزودن دسته بندی',
      url : '/category',
      icon : 'icon-list',
      children: [
        {
          name: 'گروه بندی مشاغل',
          url: '/category/addGroupingJob',
          icon: 'icon-puzzle',
        },
        {
          name: 'مشاغل',
          url: '/category/addNewJob',
          icon: 'icon-puzzle',
        },
        {
          name: 'زیر دسته مشاغل',
          url: '/category/addSubCategoryJob',
          icon: 'icon-puzzle',
        },
        {
          name: 'استان',
          url: '/category/addProvince',
          icon: 'icon-puzzle',
        },
        {
          name: 'شهر',
          url: '/category/addCity',
          icon: 'icon-puzzle',
        },
        {
          name: 'محله',
          url: '/category/addArea',
          icon: 'icon-puzzle',
        },
        {
          name: 'سرویس آنلاین',
          url: '/category/addNewOnlineService',
          icon: 'icon-puzzle',
        },
        {
          name: 'سرویس مشاغل',
          url: '/category/addJobService',
          icon: 'icon-puzzle',
        },
        {
          name: 'نوع کارت ویزیت',
          url: '/category/addCardType',
          icon: 'icon-puzzle',
        },
        {
          name: 'دسته بندی آگهی',
          url: '/category/addAdCategory',
          icon: 'icon-puzzle',
        },
        {
          name: 'وضعیت سفارش',
          url: '/category/addCardOrderStatus',
          icon: 'icon-puzzle',
        },
        {
          name: 'اطلاعات نرم افزار',
          url: '/category/appInfo',
          icon: 'icon-puzzle',
        },
        {
          name: 'قوانین و مقررات',
          url: '/category/addPrivacyPolicy',
          icon: 'icon-puzzle',
        },
      ]
    },
    {
      name: 'تبلیغات بنری',
      url: '/banner',
      icon: 'icon-badge',
      children: [
        {
          name: 'قیمت بنر اصلی',
          url: '/banner/priceBannerHome',
          icon: 'icon-puzzle',
        },
        {
          name: 'قیمت بنر مشاغل',
          url: '/banner/priceBannerJob',
          icon: 'icon-puzzle',
        },
        {
          name: 'ایجاد بنر اصلی',
          url: '/banner/createBannerHome',
          icon: 'icon-puzzle',
        },
        {
          name: 'ایجاد بنر مشاغل',
          url: '/banner/createBannerJob',
          icon: 'icon-puzzle',
        }
      ],
    },
    
    {
      divider: true,
    },
  ],
};
/*
{
      title: true,
      name: 'Theme',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Colors',
      url: '/theme/colors',
      icon: 'icon-drop',
    },
    {
      name: 'Typography',
      url: '/theme/typography',
      icon: 'icon-pencil',
    },
    {
      title: true,
      name: 'Components',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Base',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle',
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle',
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle',
        },
        {
          name: 'Dropdowns',
          url: '/base/dropdowns',
          icon: 'icon-puzzle',
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle',
        },
        {
          name: 'Jumbotrons',
          url: '/base/jumbotrons',
          icon: 'icon-puzzle',
        },
        {
          name: 'List groups',
          url: '/base/list-groups',
          icon: 'icon-puzzle',
        },
        {
          name: 'Navs',
          url: '/base/navs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Paginations',
          url: '/base/paginations',
          icon: 'icon-puzzle',
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle',
        },
        {
          name: 'Progress Bar',
          url: '/base/progress-bar',
          icon: 'icon-puzzle',
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tabs',
          url: '/base/tabs',
          icon: 'icon-puzzle',
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle',
        },
      ],
    },
    {
      name: 'Buttons',
      url: '/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Buttons',
          url: '/buttons/buttons',
          icon: 'icon-cursor',
        },
        {
          name: 'Button dropdowns',
          url: '/buttons/button-dropdowns',
          icon: 'icon-cursor',
        },
        {
          name: 'Button groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor',
        },
        {
          name: 'Brand Buttons',
          url: '/buttons/brand-buttons',
          icon: 'icon-cursor',
        },
      ],
    },
    {
      name: 'Charts',
      url: '/charts',
      icon: 'icon-pie-chart',
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'CoreUI Icons',
          url: '/icons/coreui-icons',
          icon: 'icon-star',
          badge: {
            variant: 'info',
            text: 'NEW',
          },
        },
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star',
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7',
          },
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'icon-bell',
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'icon-bell',
        },
        {
          name: 'Modals',
          url: '/notifications/modals',
          icon: 'icon-bell',
        },
      ],
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
*/
