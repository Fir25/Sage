import useFetch from '../useFetch';

import React from 'react';



import Tree from './Tree'

import { useSelector } from 'react-redux';

function Organigramme() {
  const url=process.env.React_App_URL;
  const { data: departements } = useFetch(url+"arbo/")
 
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
 
  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
    <div className="card shadow">
 
<div className="card-header border-0">

       
         
            <Tree data={departements} />  
           </div></div> </div></div></div></div>)
     }
export default Organigramme;