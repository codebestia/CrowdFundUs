import {Route, Routes, BrowserRouter} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
const Home = lazy(()=>(import("../pages/Home")));
const Admin = lazy(()=>(import("../pages/Admin")));
const Details = lazy(()=>(import("../pages/Details")));
const NotFound = lazy(()=>(import("../pages/NotFound")));




const Router = ()=>{
    return (
            <BrowserRouter>
            <Layout>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/admin' element={<Admin />} />
                    <Route path='/:id' element={<Details />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
            </Suspense>
            </Layout>
            </BrowserRouter>
        
    )
}
export default Router;