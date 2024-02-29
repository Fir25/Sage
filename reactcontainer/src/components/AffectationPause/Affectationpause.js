
import React from 'react';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard';
import useFetch from "../useFetch";
import { useMemo } from "react";
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from "axios"
import { useEffect } from 'react';

import { MultiSelect } from '../MultiSelect';
function AffectationPause() {
  const url = process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null
  const [alertvalid, setAlert] = useState(false)
  const userinfo = useSelector(state => state.userinfo);
  const test = userinfo[0]

  if (Object.keys(userinfo).length != 0) {
    var iduserinfo = test['id']
    var iddd = test['iddep'].join(",")
  
  

    var admin = test['admin']
    var DRH = test['DRH']
  }
  const [selectedd, setSelectedd] = useState([]);

  const handleChange = (selected, allchecked) => {
    let results = allchecked.map(({ value }) => value);

    setU(results)
  }
  const [uu, setU] = useState([])
  const [uss, setuss] = useState([])
  var iddep = iddd == "" ? undefined : iddd

  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  const { data: data, isloading: zzsx, error: esse } = useFetch(url + "Getarbobyids/?id=" + iddep)
  const { data: dataadmin, isloading: aae, error: fv } = useFetch(url + "arbo/")
  const [treeData, setTreeData] = React.useState([]);
  const[loginemploye,setloginemploye]=useState(false)
  
  useEffect(() => {
    if (iddep != undefined) {

      setTreeData(data)//si utilisateur connecté est un chef alors il faut afficher ses départements


    } else if (admin == true || DRH == true) {

      setTreeData(dataadmin)//si utilisateur connecté est un admin alors il faut afficher tous les départements

    } else {
      setloginemploye(true)
      setTreeData([])
    }


  }, [treeData, data, dataadmin])
  const dropdown = useMemo(() => {
    return (

      <DropdownTreeSelect
        data={treeData}
        onChange={(selected, allchecked) => { handleChange(selected, allchecked) }}
        texts={{ placeholder: "Département" }}
        className="mdl-demo"
      />
    )
  }, [treeData]);
  //const { data: pointeuses, isloading, error } = useFetch(url+"pointeuse/")
  const { data: pauses, isloading: zz, error: ee } = useFetch(url + "pause/")





  const [date_pointage, setDate] = useState('');



  const users = []
  const ac = []
  useEffect(() => {
    ac.push(activite.map(x => x.value))


    fetch(url + "userofdepartements/?id=" + uu + "&idactivite=" + ac,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }
      }).then((result) => {
        result.json().then((resp) => {

          resp.map(x => users.push({ "label": x.label, "value": x.value }))
          setuss(resp)
        }).catch((e) => {

          /**   if ( e.response.status=== 401) {
                 logoutfunction(e.response.status)
               } */
        })

      })

  }, [activite, uu])

  const em = []
  var [employes, setEmployes] = useState([])
  function handleChangeemploye(e) {
    setSelectedd(e)

    em.push(e.map(x => x.value))

    setEmployes(em[0])

  }
const [alerterror,setAlertError]=useState(false)
  const handlesubmit = (etat, idpause) => {
    setAlert(false)

    const pointage = { employes, etat, idpause }
if (employes.length==0){
  setAlertError(true)
  alert("Il faut sélectionnez au moins un employé! ")
}else{
  fetch(url + "createpointage/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(pointage)
  })
  .then((response) => {


  })
  .then(() => {
    setAlert(true)
    
    Mouchard("en cours", "ajouté", employes, iduserinfo, "Ajouter un pointage: " + date_pointage)
    
   
  
  }).catch((e) => {


    /**   if ( e.response.status=== 401) {
           logoutfunction(e.response.status)
       } */
   
  })
}


  }

  return (
    <div>

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
        Affectation pause
        </button>


        <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Pointage</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">



                <div>



                  



             
{loginemploye==true?
"":<>                 
 <div className="row pt-3">
<div className='col-md-6'>

  <label>Statut </label>
  <MultiSelect options={activities} value={activite} onChange={setActivite} />



</div>
<div className='col-md-6'>

  <label>Département</label>
  {dropdown}



</div>












</div>
<div className='row'>
<div className='col-md-6'>
  <label>Employés</label>
  <MultiSelect options={uss} value={selectedd} onChange={handleChangeemploye} />
</div>
</div></>

}


                 
<div className='row pt-3'> 

{pauses.filter(x=>x.planifie==false ).map(p =>
                                       <div className='col-md-3'>
                                        <button type="button" className="btn-sm btn-warning btn-block" onClick={() => handlesubmit(0, p.id)}  >
                                          {p.nom}<br />{p.dpause}-{p.fpause}

                                        </button>


                                      </div>
                                    )}
{/**
                      <div className='col-md-3'>
                              <button type="button" className="btn-sm btn-info btn-block" data-toggle="modal" data-target="#pointagedebutpause">
                                Début pause
                              </button>

                              <div className="modal fade" id="pointagedebutpause" role="dialog" aria-labelledby="#pointagedebutpause" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5 className="modal-title" id="exampleModalLabel">Pauses</h5>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                    {pauses.filter(x=>x.planifie==false && x.pausedejeuner==false).map(p =>
                                        <>
                                          <button type="button" className="btn btn-warning" onClick={() => handlesubmit(0, p.id)} data-dismiss="modal">
                                            {p.nom} <br />{p.dpause}-{p.fpause}

                                          </button>


                                        </>
                                      )}

                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div> 
                            
<div className='col-md-3'>
                            <button type="button" className="btn-sm btn-info btn-block" data-toggle="modal" data-target="#pointagefinpause">
                              Fin  pause
                            </button>
                            <div className="modal fade" id="pointagefinpause" role="dialog" aria-labelledby="#pointagefinpause" aria-hidden="true">
                              <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Pauses</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                  {pauses.filter(x=>x.planifie==false && x.pausedejeuner==false).map(p =>
                                      <>
                                        <button type="button" className="btn btn-warning" onClick={() => handlesubmit(1, p.id)} data-dismiss="modal">
                                          {p.nom}<br />{p.dpause}-{p.fpause}

                                        </button>


                                      </>
                                    )}

                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                   
                            <div className='col-md-3'>


                         
<button type="button" className="btn-sm btn-info btn-block"  data-toggle="modal" data-target="#dejj">
 Début pause déjeuner
</button>

<div className="modal fade" id="dejj" role="dialog" aria-labelledby="#dejj" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="exampleModalLabel">Pauses</h5>
      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body">
      {pauses.filter(x=>x.pausedejeuner==true).map(p =>
        <>
          <button type="button" className="btn btn-warning" onClick={() => handlesubmit(0, p.id)} data-dismiss="modal">
            {p.nom}<br />{p.dpause}-{p.fpause}

          </button>


        </>
      )}

    </div>

  </div>
</div>
</div>
</div>
        
                          <div className='col-md-3'>
                    
                    <button type="button" className="btn-sm btn-info btn-block"  data-toggle="modal" data-target="#dejj">
                    Fin    pause déjeuner
                    </button>
           
             <div className="modal fade" id="dejj" role="dialog" aria-labelledby="#dejj" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Pauses</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {pauses.filter(x=>x.pausedejeuner==true).map(p =>
                            <>
                              <button type="button" className="btn btn-warning" onClick={() => handlesubmit(1, p.id)} data-dismiss="modal">
                                {p.nom}<br />{p.dpause}-{p.fpause}
 
                              </button>
 
 
                            </>
                          )}
 
                        </div>
 
                      </div>
                    </div>
                  </div>
                 </div>      */}
  
      
                          </div>
                    
                     
       




                          



            
<div className='row pt-2'>
<div className='col-md-6'>
{alertvalid && <Alert variant="filled" severity="success">Votre pointage est bien enregistré</Alert>}
</div>
</div>

                </div>


              </div>

              <div className="modal-footer">



              </div>

            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
export default AffectationPause;
