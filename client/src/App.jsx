import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Workouts from './pages/Workouts'
import Profile from './pages/Profile'
import History from './pages/History'
import Calories from './pages/Calories'
import PrivateRoute from './components/PrivateRoute'


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route element={<PrivateRoute />} >
            <Route path='/workouts' element={<Workouts />} />
            <Route path='/history' element={<History />} />
            <Route path='/diet' element={<Calories />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  )
}
