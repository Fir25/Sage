import React from 'react'
import './App.css';

import Sidebar from './components/Sidebar'
import logoutfunction from './components/authentification/logoutfunction';

import { useDispatch} from 'react-redux'
import { addUSER } from './store/userinfos/userinfos';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
function Display() {
  const dispatch = useDispatch();
  const userinfo =useSelector(state => state.userinfo);
useEffect(()=>{
  
  const url=process.env.React_App_URL;
  const token=localStorage.getItem('access_token')
  fetch(url+'token/verify/', {
    method: 'post',
    headers: {
      'Content-Type':'application/json',
      accept:'application/json'
    
    },body: JSON.stringify({
      "token": token
  })
    
  }).then((response) => {
    if(response.status==500) {logoutfunction(response)}
    else{
      if(response.ok){
      response.json().then((json) => {
if (Object.keys(userinfo).length == 0){
        dispatch(addUSER(json))
}
      });
      }
    }
  }).catch((err)=>{
   
    if(err.status==500) {logoutfunction(err)}
  })
})
  return (
    <div className="App">
    {console.log('tttt',userinfo,Object.keys(userinfo).length )}
        <Sidebar />
     
    </div>
  )
}

export default Display