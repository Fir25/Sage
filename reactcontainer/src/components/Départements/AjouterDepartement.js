import React, { useState } from 'react';


import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { makeStyles } from '@mui/styles';
import Autocomplete from '@mui/material/Autocomplete';


function AjouterDepartement() {
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;
    const [nom, setNom] = useState('');
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
    const [rh2, setRH2] = useState('')
    const [wfm, setWFM] = useState('')
    const parent = "";
    const [children, setchildren] = useState([])
    const[users,setUsers]=useState([])
    function fetchUsers(){
        fetch(url+"user/", {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then(res =>{
            if (!res.ok){
                throw Error("could not fetch the data for that resource")
            }
            return res.json();
        }).then(data =>{
            
           setUsers(data)
          
        })
    }
  
    const useStyle = makeStyles({
        icon: {

            color: '#5ac2df'






,


        }
    });
    const classes = useStyle()
    const handlesubmit = (e) => {
        e.preventDefault()
        const departement = { nom, parent, children,chef,rh,rh2,wfm }

        fetch(url+"arbo/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:token
                },
                body: JSON.stringify(departement)
            }).then(() => {

                // history.push('/Utilisateurs')
                window.location.reload(false);


            }).catch((e) => {

               /** if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
            })
    }


    return (
        <div>

            <div className="row">

                <a data-toggle="modal" data-target="#ajouterdep" onClick={fetchUsers}>
                    <AddCircleIcon style={{ width: 60, height: 60 }} className={classes.icon} />
                </a>
            </div>
            <div className="row">
                <div className="container pt-4">

                    <div className="modal fade" id="ajouterdep" role="dialog" aria-labelledby="ajouterdep" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Ajouter Département</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">



                                    <form>


                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder=" " value={parent} name="nom_departement" type="hidden" />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder="Nom de département " value={nom} name="nom_departement" onChange={(e) => setNom(e.target.value)} type="text" />
                                            </div>
                                        </div>
{/**                                        <div className='form-group'>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  " +option.last_name || ""}

   renderInput={(params) => (
     <TextField {...params} label="Chef" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.id){setChef(value.id)}}} 

 /> 
                                        </div> */}
                                        <div className='form-group'>
                                      

                                            <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  "+option.last_name || ""}

   renderInput={(params) => (
     <TextField {...params} label="Team leader" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.id){setRH(value.id)}}} 

 /> 
                                        </div>
                                        <div className='form-group'>
                                      

                                      <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label="Business Manager" variant="outlined" />
)}
onChange={(event, value) =>{if (value && value.id){setRH2(value.id)}}} 

/> 
                                  </div>

                                  <div className='form-group'>
                                      

                                      <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label="Direction des opérations" variant="outlined" />
)}
onChange={(event, value) =>{if (value && value.id){setChef(value.id)}}} 

/> 
                                  </div>

                                  <div className='form-group'>
                                      

                                      <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label="WFM" variant="outlined" />
)}
onChange={(event, value) =>{if (value && value.id){setWFM(value.id)}}} 

/> 
                                  </div>

                                  
                                        

                                        <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>
                                    </form>

                                </div>
                                <div className="modal-footer">



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default AjouterDepartement;