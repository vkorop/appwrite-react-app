import { Route, Routes } from 'react-router-dom';
import './globals.css';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { Home } from './_root/pages';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toast } from './components/ui/toast';
import Explore from './_root/pages/Explore';
import AllUsers from './_root/pages/AllUsers';
import Saved from './_root/pages/Saved';
import CreatePost from './_root/pages/CreatePost';
import UpdatePost from './_root/pages/UpdatePost';
import PostDetails from './_root/pages/PostDetails';

function App() {
  return (
    <main className='flex h-screen flex-col md:flex-row'>
        <Routes>
            {/* public routes */}
            <Route element={<AuthLayout/>}>
                <Route path='/sign-in' element={<SigninForm/>} />
                <Route path='/sign-up' element={<SignupForm/>} />
            </Route>

            {/* private routes */}
            <Route element={<RootLayout/>}>
                <Route index element={<Home/>} />
                <Route path='/explore' element={<Explore/>} />
                <Route path='/all-users' element={<AllUsers/>} />
                <Route path='/saved' element={<Saved/>} />
                <Route path='/create-post' element={<CreatePost/>} />
                <Route path='/edit-post/:id' element={<UpdatePost/>} />
                <Route path='/post/:id' element={<PostDetails/>} />
            </Route>
        </Routes>

        <Toast/>
    </main>
  )
}

export default App;
