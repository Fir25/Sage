
import React, { useState,useEffect } from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select  from "react-select";
import Autocomplete from '@mui/material/Autocomplete';


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

import { useMemo } from 'react';

import { MultiSelect } from '../MultiSelect';
import Mouchard from '../Mouchardd/Mouchard';
import { useSelector } from 'react-redux';
function AjouterPlaningByDep() {
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var iduserinfo=test['id'] 
    }
  const [uss,setuss]=useState([])
  const users=[]
  const[uu,setU]=useState([])
  const [selectedd, setSelectedd] = useState([]);
    const { data: plansemaine = [], isloading, error } = useFetch(url+"plansemaine/")
    const { data: data, isloading: zzsx, error: esse } = useFetch(url+"arbo/")
    const { data: equipe, isloading: zzsxq, error: esses } = useFetch(url+"equipeselect/")
    const [selectedequipe, setequipe] = useState('');
    const [equipename, setequipename ] = useState('');
    const [title, setNomPlanningg] = useState('');
    const [start, setStartDate] = useState('');
    const [end, setExipry] = useState('');
    const [plantravail, setPlanTravail] = useState('');
    const arr=[]
    const handleChangeequipe = (selectedOption) => {
        setequipe(selectedOption.value);
      
      };
    const handlesubmit = (e) => {
        e.preventDefault()
        arr.push(selectedd.map(x=>x.value))
       
        const planning = { title, start, end, plantravail,arborescence }
        
        fetch(url+"CreateplaningByDep/?id="+arr,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:token
                },
                body: JSON.stringify(planning)
            }).then(() => {
             
                for (const item of arr[0]) {
           
                    Mouchard('-',"planning:"+title,item,iduserinfo,"Ajouter planning:"+title)
                
                }

                
            
             window.location.reload(false);

            }).catch((e) => {

    /**            if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
            })
    }
   
    const [arborescence, setActualSelected] = React.useState([]);
  
  useEffect(()=>{
    setTreeData(data)
  })

    const [treeData, setTreeData] = React.useState([]);
  
    useEffect(() => {
 
        if(uu!=""){
 
      fetch(url+"Testuserofdepartements/?id="+ uu, {method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }}).then((result) => {
        /**if ( result.status===401) {
            logoutfunction(result.status)
          } */
     
        result.json().then((resp) => {
      
        resp.map(x=>users.push({"label":x.label,"value":x.value}))
        setuss(resp)
        })

      }).catch((e) => {

  /**      if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
        }


  
    }, [uu])
  
   
    const handleChange = (selected, allchecked) =>{
      let results = allchecked.map(({value})=>value);
   
      setU(results)
    }
    
    const handleequipechange = (idd) =>{
     
        fetch(url+"equipeselect/"+ idd, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          /**if ( result.status===401) {
              logoutfunction(result.status)
            } */
       
          result.json().then((resp) => {
        
       
          setuss(resp)
          })
  
        }).catch((e) => {
  
    /**      if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            } */
      })
        
      }
    
    
     const dropdown = useMemo(()=>{
      return(
    <div style={{paddingBottom:"70px"}}>  <DropdownTreeSelect
    data={treeData}
    onChange={(selected, allchecked) =>{handleChange(selected, allchecked)}}
    texts={{ placeholder: "Département" }}
    className="mdl-demo" 
    
/></div>
          
       )}, [treeData]);
      
    return (
        <div>
            <form >
           <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouter">
           Ajouter Par département
            </button>
                    <div className="modal fade" id="ajouter" role="dialog" aria-labelledby="ajouter" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ajouter Planning Par département</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                   
        
    
        
                                        <div className='row'>
                                            <div className='col-md-6 pt-3'>
                                                <div className="form-group">
        
        
                                                    <input className="form-control" style={{minHeight: "1.4375em" ,height:"auto"}} placeholder="Nom de planning" value={title} name="nom" onChange={(e) => setNomPlanningg(e.target.value)} type="text" />
        
                                                </div>
        
                                            </div>
                                            <div className='col-md-6'>
                                                
          
          <TextField
              id="outlined-select-currency"
              select
              label="plan semaine"
              value={plantravail}
              onChange={(e) => { setPlanTravail(e.target.value) }}
              helperText="Plan de semaine"
              margin='normal'
              fullWidth 
              size="small"
          >
              {plansemaine.map((option) => (
                  <MenuItem key={option.nomsemaine} value={option.id}>
                      {option.nomsemaine}
                  </MenuItem>
              ))}

          </TextField>
      </div>
   
 <div className='col-md-6'>
 <label htmlFor="motif_abs">equipe</label>
 <Autocomplete
      options={equipe}
      getOptionLabel={(option) => option.label || ""}
      renderInput={(params) => (
        <TextField {...params} label={equipename}  fullWidth   variant="outlined" />                                                              
      )}
      onChange={(event, value) => { if (value && value.value) { setequipe(value.value) ; setequipename(value.label) ; handleequipechange(value.value)} }}
    />
                              </div>            </div>
        
                                        <div className='row'>
                                            <div className='col-md-6'>
                                          
                                                <div className="form-group">
                                                    
        
                                                        <input className="form-control" placeholder="date de début" value={start} name="nom" onChange={(e) => setStartDate(e.target.value)} type="date" />
                                                
                                                </div>
        
                                            </div>
                                            <div className='col-md-6'>
                                                <div className="form-group">
                                                
        
                                                        <input className="form-control" placeholder="date de fin" value={end} name="nom" onChange={(e) => setExipry(e.target.value)} type="date" min={start} />
                                                  
                                                </div>
        
                                            </div>
                                       
                                        </div>
        
        
                                        <div className='row'>
        <div className='col-md-6 '>     
        {dropdown}      

            
            
            
            </div>
      <div className='col-md-6'>
      
        <MultiSelect options={ uss} value={selectedd} onChange={setSelectedd} />
       
      </div>
                </div>
        
        
     
        
                <div className='row'>
        
                                        <div className="col-md-12 text-center"><button  className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>  
        
                                </div></div>
                                <div className="modal-footer">
        
        
        
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
 
        </div>


    )
}
export default AjouterPlaningByDep;