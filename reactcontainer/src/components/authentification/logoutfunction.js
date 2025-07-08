import axiosInstance from './axios';
import { Navigate } from 'react-router-dom';
const logoutfunction=(res)=>{
  
        localStorage.clear()
      axiosInstance.defaults.headers['Authorization'] = null;
      window.location.reload(false)
      Navigate('');
     
}


 export default logoutfunction;