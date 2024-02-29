import React, {  useState } from "react";
import Form from "react-validation/build/form";

import { useNavigate } from "react-router-dom";
import axiosInstance from './axios';

import { makeStyles } from '@mui/styles';

import { Alert } from "@mui/material";


export default function SignIn(){

 
  const [checkalert , setalert] = useState(false)
  
const intialFormData=Object.freeze({
  matricule:'',
  password:''
})
const [formData,updateFormData]=useState(intialFormData);
const handleChange=(e)=>{
  updateFormData({
    ...formData,
    [e.target.name]:e.target.value.trim(), 
  })
}
{/**useEffect(()=>{
  if (localStorage.getItem('access_token')!=null){
 
    navigate('/home');
  }
})

 */}
const navigate=useNavigate();
 /**var hasStorage = (function() {
	try {
		localStorage.setItem("yy", "yy");
		localStorage.removeItem("yy");
		return true;
	} catch (exception) {
		return false;
	}
}());*/


const handleSubmit = (e) => {

  e.preventDefault();
 

  axiosInstance
    .post(`token/`, {
      matricule: formData.matricule,
      password: formData.password,
    })
    .then((res) => {
    
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      axiosInstance.defaults.headers['Authorization'] =
        'JWT ' + localStorage.getItem('access_token');
      
   

    
     navigate('/home');
    
     // setAuth(res.data)
    
  
      
    }).catch((err) =>{
      setalert(true)
    });};
    const useStyle = makeStyles({
      image: {
     
       // backgroundImage:`url("./Employee-recognition.png")`
        
    
    
   
      },
    });
 
    return (
      <section  className="h-100 gradient-form" style={{backgroundColor:"#eee"}}>
   
      <div  className="container py-10 h-100">
        <div  className="row d-flex justify-content-center align-items-center h-100">
          <div  className="col-xl-5">
            {/**<div  className="col-xl-10"> */}
            <div  className="card rounded-3 text-black" style={{backgroundColor:"#4682BF"}}>
        {/**      <div  className="row g-0">
                <div  className="col-lg-6"> */}
                  <div  className="card-body p-md-5 mx-md-4" >
    
                    <div  className="text-center">
                      <img src="./activecontact.png"
                   style={{width:"185px"}}     alt="logo"/>
                {/**  <h4  className="mt-1 mb-5 pb-1 ">Veuillez vous connecter à votre compte</h4> */}
                <h4  className="mt-1 mb-5 pb-1 "></h4> 
                <h4  className="mt-1 mb-5 pb-1 ">Veuillez vous connecter à votre compte</h4>
                    </div>
                  
                    <Form>
                  
    
                      <div className="form-outline mb-4">
                        <input type="text"   name="matricule"
                  id="matricule"  className="form-control"

                       
                          placeholder="matricule"  onChange={handleChange} />

                      </div>
    
                      <div  className="form-outline mb-4">
                        <input type="password"   name="password"
                  id="password"  className="form-control" placeholder="Mot de passe"  onChange={handleChange} />
                     
                      </div>
    
                      <div  className="text-center pt-1 mb-5 pb-1">
                        <button  className="btn btn-primary btn-block fa-lg  mb-3" type="submit" onClick={handleSubmit}>Connexion</button>
                        {checkalert &&
                                      <Alert variant="filled" severity="error">
                                     vos données ne sont pas correctes ! Veuillez réessayer de nouveau 
                                    </Alert> }
                      </div>
    
                      <div  className="d-flex align-items-center justify-content-center pb-4">
             
                      </div>
    
                    </Form>
    
                
{/**                <div  className="col-lg-6 d-flex align-items-center" style={{backgroundColor:"rgb(2,0,36)",background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(90,194,223,1) 35%, rgba(0,212,255,1) 100%)"}}>
                  <div  className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4  className="mb-4">Votre solution de gestion de temps</h4>
                    <p  className="small mb-0">
                      IPS-TIME est un logiciel de pointage <div><hr/>
C’est le logiciel qui traite les données recueillies par la pointeuse, et vous permet ensuite d’y accéder et d’organiser ces données comme vous le souhaitez. Le logiciel agit comme une interface entre la pointeuse, et vous.  Sans celui-ci, difficile d’envisager comment tirer des avantages des solutions de gestion du temps mises en place.
               <hr/></div>
               Visitez notre site IP-SOFT :<br/>  <a href="http://www.ip-soft.tn/" target="_blank" style={{color:"white"}}> http://www.ip-soft.tn/</a>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
    );
  }
