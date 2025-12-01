import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import GuestLayout from './components/Admin/GuestLayout';
import ProtectedLayout from './components/Admin/ProtectedLayout';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import AllBlog from './pages/Blog/AllBlog';
import BlogCategory from './pages/Blog/BlogCategory';
import BlogDetails from './pages/Blog/BlogDetails';
import CreateBlog from './pages/Blog/CreateBlog';
import EditBlog from './pages/Blog/EditBlog';
import Calendar from './pages/Calendar';
import AllCategory from './pages/Category/AllCategory';
import CreateCategory from './pages/Category/CreateCategory';
import EditCategory from './pages/Category/EditCategory';
import Chart from './pages/Chart';
import AllCoupon from './pages/Coupon/AllCoupon';
import CreateCoupon from './pages/Coupon/CreateCoupon';
import EditCoupon from './pages/Coupon/EditCoupon';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import EditFreeShipping from './pages/FreeShipping/EditFreeShipping';
import AllGift from './pages/Gift/AllGift';
import CreateGift from './pages/Gift/CreateGift';
import AllHeroSlider from './pages/HeroSlider/AllHeroSlider';
import CreateHeroSlider from './pages/HeroSlider/CreateHeroSlider';
import EditHeroSlider from './pages/HeroSlider/EditHeroSlider';
import OrderNotification from './pages/Notification/OrderNotification';
import AllOrders from './pages/Order/AllOrders';
import OrderDetails from './pages/Order/OrderDetails';
import OrderTransaction from './pages/Order/OrderTransaction';
import AllProduct from './pages/Product/AllProduct';
import CreateProduct from './pages/Product/CreateProduct';
import EditProduct from './pages/Product/EditProduct';
import ProductDetails from './pages/Product/ProductDetails';
import Profile from './pages/Profile';
import AllRecipe from './pages/Recipe/AllRecipe';
import CreateRecipe from './pages/Recipe/CreateRecipe';
import EditRecipe from './pages/Recipe/EditRecipe';
import RecipeCategory from './pages/Recipe/RecipeCategory';
import RecipeDetails from './pages/Recipe/RecipeDetails';
import Settings from './pages/Settings';
import AllStaff from './pages/Staff/AllStaff';
import AllSubcategory from './pages/Subcategory/AllSubcategory';
import CreateSubcategory from './pages/Subcategory/CreateSubcategory';
import EditSubcategory from './pages/Subcategory/EditSubcategory';
import Tables from './pages/Tables';
import AllTestimonial from './pages/Testimonial/AllTestimonial';
import CreateTestimonial from './pages/Testimonial/CreateTestimonial';
import EditTestimonial from './pages/Testimonial/EditTestimonial';
import AllThreshold from './pages/Threshold/AllThreshold';
import CreateThreshold from './pages/Threshold/CreateThreshold';
import EditThreshold from './pages/Threshold/EditThreshold';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import HeaderSetup from './pages/WebsiteSetup/Header';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Dashboard | Shutkiz" />
                <ECommerce />
              </>
            </ProtectedLayout>
          }
        />

        {/**Category Route Start */}
        <Route
          path="/categories/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Category | Shutkiz" />
                <CreateCategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/categories/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Category | Shutkiz" />
                <AllCategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/categories/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Category | Shutkiz" />
                <EditCategory />
              </>
            </ProtectedLayout>
          }
        />

        {/**Category Route End */}

        {/**Subcategory Route Start */}
        <Route
          path="/sub-categories/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Subcategory | Shutkiz" />
                <CreateSubcategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/sub-categories/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Subcategory | Shutkiz" />
                <AllSubcategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/sub-categories/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Subcategory | Shutkiz" />
                <EditSubcategory />
              </>
            </ProtectedLayout>
          }
        />
        {/**Subcategory Route End */}

        {/**Recipe Route Start */}
        <Route
          path="/recipe/categories"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Recipe Category | Shutkiz" />
                <RecipeCategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/recipe/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Recipe | Shutkiz" />
                <CreateRecipe />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/recipe/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Recipe | Shutkiz" />
                <AllRecipe />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/recipe/details/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Recipe | Shutkiz" />
                <RecipeDetails />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/recipe/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Recipe | Shutkiz" />
                <EditRecipe />
              </>
            </ProtectedLayout>
          }
        />

        {/**Recipe Route End */}

        {/**Blog Route Start */}
        <Route
          path="/blog/categories"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Blog Category | Shutkiz" />
                <BlogCategory />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/blog/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Blog | Shutkiz" />
                <CreateBlog />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/blog/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Blog | Shutkiz" />
                <AllBlog />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/blog/details/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Blog | Shutkiz" />
                <BlogDetails />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/blog/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Blog | Shutkiz" />
                <EditBlog />
              </>
            </ProtectedLayout>
          }
        />

        {/**Blog Route End */}

        {/**Product Route Start */}

        <Route
          path="/product/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Product | Shutkiz" />
                <CreateProduct />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/product/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Product | Shutkiz" />
                <AllProduct />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/product/details/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Product | Shutkiz" />
                <ProductDetails />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/product/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Product | Shutkiz" />
                <EditProduct />
              </>
            </ProtectedLayout>
          }
        />

        {/**Product Route End */}

        {/**Coupon Route Start */}
        <Route
          path="/coupons/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Coupons | Shutkiz" />
                <CreateCoupon />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/coupons/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Coupons | Shutkiz" />
                <AllCoupon />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/coupon/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Coupons | Shutkiz" />
                <EditCoupon />
              </>
            </ProtectedLayout>
          }
        />

        {/**Coupon Route End */}

        {/**Gift Route Start */}
        <Route
          path="/thresholds/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Threshold | Shutkiz" />
                <CreateThreshold />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/thresholds/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Threshold | Shutkiz" />
                <AllThreshold />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/thresholds/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Threshold | Shutkiz" />
                <EditThreshold />
              </>
            </ProtectedLayout>
          }
        />

        {/**Gift Route End */}

        {/**Gift Route Start */}
        <Route
          path="/gifts/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Gifts | Shutkiz" />
                <CreateGift />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/gifts/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Gifts | Shutkiz" />
                <AllGift />
              </>
            </ProtectedLayout>
          }
        />

        {/**Gift Route End */}

        {/**Free Shipping Route Start */}
        <Route
          path="/free-shipping/edit"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Free Shipping | Shutkiz" />
                <EditFreeShipping />
              </>
            </ProtectedLayout>
          }
        />
        {/**Free Shipping Route End */}

        {/**Testimonial Route Start */}
        <Route
          path="/testimonials/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Testimonials | Shutkiz" />
                <CreateTestimonial />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/testimonials/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Testimonials | Shutkiz" />
                <AllTestimonial />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/testimonials/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Testimonials | Shutkiz" />
                <EditTestimonial />
              </>
            </ProtectedLayout>
          }
        />

        {/**Testimonial Route End */}

        {/**Hero Slider Route Start */}
        <Route
          path="/website-setup/home-slider/create"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Home Slider | Shutkiz" />
                <CreateHeroSlider />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/website-setup/home-slider/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Home Slider | Shutkiz" />
                <AllHeroSlider />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/website-setup/home-slider/edit/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Home Slider | Shutkiz" />
                <EditHeroSlider />
              </>
            </ProtectedLayout>
          }
        />

        {/**Hero Slider Route End */}

        {/**Header Route Start */}
        <Route
          path="/website-setup/header"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Header | Shutkiz" />
                <HeaderSetup />
              </>
            </ProtectedLayout>
          }
        />

        {/**Header Route End */}

        {/**Order Route Start */}
        <Route
          path="/orders/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Orders | Shutkiz" />
                <AllOrders />
              </>
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders/details/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Order | Shutkiz" />
                <OrderDetails />
              </>
            </ProtectedLayout>
          }
        />

        <Route
          path="/orders/transaction/:id"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Order | Shutkiz" />
                <OrderTransaction />
              </>
            </ProtectedLayout>
          }
        />

        {/**Order Route End */}

        {/**Staff Route Start */}
        <Route
          path="/staffs/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Staffs | Shutkiz" />
                <AllStaff />
              </>
            </ProtectedLayout>
          }
        />

        {/**Staff Route End */}

        {/**Staff Route Start */}
        <Route
          path="/order-notification/all"
          element={
            <ProtectedLayout>
              <>
                <PageTitle title="Order Notification | Shutkiz" />
                <OrderNotification />
              </>
            </ProtectedLayout>
          }
        />

        {/**Staff Route End */}

        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <GuestLayout>
              <>
                <PageTitle title="Shutkiz | Signin" />
                <SignIn />
              </>
            </GuestLayout>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
