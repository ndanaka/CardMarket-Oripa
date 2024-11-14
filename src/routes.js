import Index from "./views/Index.js";
import MitLiscence from "./views/auth/MitLiscence.js";
import Terms from "./views/auth/Terms.js";
import Category from "./views/admin/Category.js";
import Prize from "./views/admin/Prize.js";
import PrizeVideo from "./views/admin/PrizeVideo.js";
import Statistics from "./views/admin/Statistics.js";
import User from "./views/admin/User.js";
import Gacha from "./views/admin/Gacha.js";
import Point from "./views/admin/Point.js";
import GachaEdit from "./views/admin/GachaEdit.js";
import UseTerms from "./views/admin/UseTerms.js";
import Administrators from "./views/admin/Administrators.js";
import UserDetail from "./views/admin/UserDetail.js";
import Delivering from "./views/admin/Delivering.js";
import AdminLogin from "./views/auth/AdminLogin.js";
import Login from "./views/auth/Login.js";
import Register from "./views/auth/Register.js";
import Profile from "./views/user/Profile.js";
import PurchasePoint from "./views/user/PurchasePoint.js";
import PointLog from "./views/user/PointLog.js";
import AcquisitionHistory from "./views/user/AcquisitionHistory.js";
import GachaDetail from "./views/user/GachaDetail.js";
import Blog from "./views/user/Blog.js";
import BlogDetail from "./views/user/BlogDetail.js";
import ChangeShippingAddress from "./views/user/ChangeShippingAddress.js";
import AddShippingAddress from "./views/user/AddShippingAddress.js";
import Rank from "./views/admin/Rank.js";
import Theme from "./views/admin/Theme.js";
import Carousel from "./views/admin/Carousel.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/user",
  },
  {
    path: "/blog",
    name: "Blog",
    icon: "ni ni-tv-2 text-primary",
    component: <Blog />,
    layout: "/user",
  },
  {
    path: "/blogDetail",
    name: "Blog Detail",
    icon: "ni ni-tv-2 text-primary",
    component: <BlogDetail />,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/user",
  },
  {
    path: "/purchasePoint",
    name: "Purchase Point",
    icon: "ni ni-single-02 text-yellow",
    component: <PurchasePoint />,
    layout: "/user",
  },
  {
    path: "/changeShippingAddress",
    name: "user shiping",
    icon: "fa fa-users",
    component: <ChangeShippingAddress />,
    layout: "/user",
  },
  {
    path: "/addShippingAddress",
    name: "user shiping",
    icon: "fa fa-users",
    component: <AddShippingAddress />,
    layout: "/user",
  },
  {
    path: "/pointsHistory",
    name: "Point History",
    icon: "ni ni-single-02 text-yellow",
    component: <PointLog />,
    layout: "/user",
  },
  {
    path: "/acquisitionHistory",
    name: "Acquisition History",
    icon: "ni ni-single-02 text-yellow",
    component: <AcquisitionHistory />,
    layout: "/user",
  },
  {
    path: "/gachaDetail",
    name: "My Card",
    icon: "ni ni-single-02 text-yellow",
    component: <GachaDetail />,
    layout: "/user",
  },
  {
    path: "/terms",
    name: "terms",
    icon: "ni ni-circle-08 text-pink",
    component: <Terms />,
    layout: "/user",
  },
  {
    path: "/index",
    name: "statistics",
    icon: "fa fa-bar-chart",
    component: <Statistics />,
    layout: "/admin",
  },
  {
    path: "/admin",
    name: "admin",
    icon: "fa-solid fa-user-secret",
    component: <Administrators />,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "users",
    icon: "fa fa-users",
    component: <User />,
    layout: "/admin",
  },
  {
    path: "/userDetail",
    name: "user detail",
    icon: "fa fa-users",
    component: <UserDetail />,
    layout: "/admin/sub",
  },
  {
    path: "/carousel",
    name: "carousel",
    icon: "fa fa-file-image",
    component: <Carousel />,
    layout: "/admin",
  },
  {
    path: "/rank",
    name: "rank",
    icon: "fa fa-trophy",
    component: <Rank />,
    layout: "/admin",
  },
  {
    path: "/point",
    name: "point",
    icon: "fa-brands fa-product-hunt",
    component: <Point />,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "category",
    icon: "fa-solid fa-list",
    component: <Category />,
    layout: "/admin",
  },
  {
    path: "/prize",
    name: "prize",
    icon: "fa fa-gift",
    component: <Prize />,
    layout: "/admin",
  },
  {
    path: "/prizeVideo",
    name: "prizeVideo",
    icon: "fa fa-film",
    component: <PrizeVideo />,
    layout: "/admin",
  },
  {
    path: "/gacha",
    name: "gacha",
    icon: "fa-brands fa-dropbox",
    component: <Gacha />,
    layout: "/admin",
  },
  {
    path: "/gachaEdit",
    name: "gacha",
    icon: "fa fa-modx",
    component: <GachaEdit />,
    layout: "/admin/sub",
  },
  {
    path: "/delivering",
    name: "Delivering",
    icon: "fa fa-truck",
    component: <Delivering />,
    layout: "/admin",
  },
  {
    path: "/useterm",
    name: "userterms",
    icon: "fa-brands fa-readme",
    component: <UseTerms />,
    layout: "/admin",
  },
  {
    path: "/theme",
    name: "theme",
    icon: "fa fa-cogs",
    component: <Theme />,
    layout: "/admin",
  },
  {
    path: "/admin-amlkh741hgw45q88jajg223qw-login",
    name: "Admin Login",
    icon: "ni ni-key-25 text-info",
    component: <AdminLogin />,
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/lisence",
    name: "lisence",
    icon: "ni ni-circle-08 text-pink",
    component: <MitLiscence />,
    layout: "/auth",
  },
];
export default routes;
