import React from 'react';
import   { useState , useEffect} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@mui/styles';
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from "react-select";
import { MultiSelect } from '../MultiSelect';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function ModifierChild(id ){
    const url=process.env.React_App_URL;
    const {id:idn}=id;
    const [idd, SetId] = useState(null);
   
    const [selectedd, setSelectedd] = useState([]);

    const [nom, setNom] = useState('');
    const [open, setOpen] = useState(false);
    const [openmodal, setOpenmodal] = useState(true);
    const [contratIddelete, setcontratIddelete] = useState('')
    const [fetchDataFlag, setFetchDataFlag] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };
    const handleClosemodal = () => {
      setOpenmodal(false);
    };
    const handleOpenmodal = () => {
     
      SelectDepartement(idn)
    };
    const handleEditClick = () => {
      handleOpenmodal();
    };
    //  -------------------------------------------------------
  
  
  
    


    const handleClickOpen = () => {
      setOpen(true);
    };

    
    function Selectworkflow(id) {
        fetch(url+"workflow/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
       
            setnomwork(resp.nom);
            SetId(resp.id)
            setType(resp.type_conge)
            setval1(resp.valideur_1)
            setval2(resp.valideur_2)
            setval3(resp.valideur_3)
            setval4(resp.valideur_4)
            setval11(resp.valideur_11)
            setval21(resp.valideur_21)
            setval31(resp.valideur_31)
            setval41(resp.valideur_41)
    
          })
        }).catch((err)=>{
        /**  if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'workflow/' + contratId, {
          method: 'DELETE',
          headers: {
    
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }).then(() => {
          setOpen(false);
          window.location.reload(false);
        }
        ).catch((err)=>{
         /** if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })

      }
      const UpdateUser = () => {

        let site = { nom : nomwork , departement : departementId , type_conge : motif_abs, valideur_1 : val1 , valideur_2 : val2 , valideur_3 :val3 , valideur_4 :val4}

        fetch(url+'workflow/' + idd, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(site)
        }).then(() => {   
                }  
        ).catch((err)=>{
      /**    if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
      }
      const CreateUser = () => {

        let site = { nom : nomwork , departement : departementId , type_conge : motif_abs, valideur_1 : val1 , valideur_2 : val2 , valideur_3 :val3 , valideur_4 :val4}
    
    
        fetch(url+'workflow/' , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(site)
        }).then(() => {
     
         
                }  
        ).catch((err)=>{
      /**    if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
      }
    const [workflows , setworkflows]=useState([])
    const [nomwork, setnomwork] = useState('')
    const [typecongework, settypecongework] = useState('')
    const [val1, setval1] = useState(null)
    const [val2, setval2] =  useState(null)
    const [val3, setval3] =  useState(null)
    const [val4, setval4] =  useState(null)
    const [val11, setval11] = useState(null)
    const [val21, setval21] =  useState(null)
    const [val31, setval31] =  useState(null)
    const [val41, setval41] =  useState(null)
    const { data: motifs = [] } = useFetch(url+"motif/")
    const [motif_abs, setType] = useState('');
    const arr=[]
    const[users,setUsers]=useState([])
    const [managers , setManagers ]=useState([])
    const [departementId, setDepartementId] = useState(null)
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
    const [rh2, setRH2] = useState('')
 const[nomchef,setNomchef]=useState('')
 const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
 const[prenomchef,setPrenomchef]=useState('')
 const[prenomrh,setPrenomRh]=useState('')
 const[nomrh,setnomRh]=useState('')
 const[rh2nom,setRH2Nom]=useState('')
 const[rh2prenom,setRH2Prenom]=useState('')
 const[wfm,setWFM]=useState('')
 const[nomwfm,setNomwfm]=useState('')
 const[prenomwfm,setpernomwfm]=useState('')
 async function SelectDepartement(id) {
  try {
    const [userData, managersData, workflowsData ] = await Promise.all([
      fetch(url + "user/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error("Could not fetch the data for user resource");
        }
        return response.json();
      }),
      fetch(url + "managersbyid/" + id + "/1", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error("Could not fetch the data for managers resource");
        }
        return response.json();
      }),
      fetch(url + "selectworkdep/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error("Could not fetch the data for workflows resource");
        }
        return response.json();
      }),
     
    ]);

    setUsers(userData);
    setManagers(managersData);
    console.log( managers)
    setworkflows(workflowsData);
   
  } catch (error) {
    console.error(error);
    // Handle error or display error message
  }
}
      const [selectedUsers, setSelectedUsers] = useState([]);
      const [selectedManagers, setSelectedManagers] = useState([]);

      const { data: usersss, isLoading: isUsersLoading } = useFetch(url + "user/");
      const [defaultSelectedUsers, setDefaultSelectedUsers] = useState([]);
      const isDefaultSelectedUsersLoading = false; // Set the initial loading state as needed
      
     
      
      const handleUserSelection = (selectedOptions) => {
        setSelectedUsers(selectedOptions ? selectedOptions.map((option) => option.value) : []);
      };
      
      const handleManagerSelection = (selectedOptions) => {
        setSelectedManagers(selectedOptions);
      };
   
      const handleValidate = async () => {
        try {
          await fetch("https://example.com/api/selected-users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedUsers),
          });
          console.log("Selected users updated successfully");
        } catch (error) {
          console.error("Error updating selected users:", error);
        }
      };
    const UpdateDepartement = () => {

        let departementList = { nom,chef,rh ,rh2,wfm}


        fetch(url+'arbo/' + departementId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization:token
            },
            body: JSON.stringify(departementList)
        }).then((response) => {
      

        }

        ).catch((e) => {
/**
            if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })


    }
     const useStyle = makeStyles({
        icon: {
            marginRight: 10,
            marginLeft: 10,
            color: '#5ac2df'
,
        },
        dialog: {

            boxShadow: 'none',
        }
    });
    const classes = useStyle()
return(
    <div>
   <a onClick={()=>handleEditClick} data-toggle="modal" data-target={`#e${idn}`} ><EditIcon
    className={classes.icon}
/></a>
  
            <div className="modal fade" id={`e${idn}`} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" tabindex="-1" data-backdrop="static" data-keyboard="false">
                 <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modifier Département</h5>
                            <button type="button" className="close"  onClick={handleClosemodal} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" style={{ width : "700px" }}>
                        <form>

<div className="form-group"  >
    <div className="input-group input-group-merge input-group-alternative">

        <input className="form-control" placeholder="" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />
    </div>
</div>
<div className="row" >



<div className="col-md-3">
  <div>
    <h2>wfms</h2>
    <Select
      options={users.map((user) => ({
        value: user.id,
        label: `${user.user_name} ${user.last_name}`,
      }))}
      isMulti
      value={selectedUsers}
      onChange={handleUserSelection}
    />
    <p>liste:</p>
    {users.map((option) => (
      <h3 key={option.id}>{option.nom}</h3>
    ))}
    <button onClick={handleValidate}>confirmer</button>
  </div>
</div>
<div className="col-md-3">


    <label >Business Manager</label>
              <MultiSelect options={defaultSelectedUsers} value={selectedd} onChange={setSelectedd} />   


</div>
<div>
  <h2>Managersssss</h2>
  <ul>
    {managers.map((option) => (
      <li key={option.id}>{option.nom}</li>
    ))}
  </ul>
</div>
<div>
  <h2>USERS</h2>
  <ul>
  {users.map((user) => ({
        value: user.id,
        label: `${user.user_name} ${user.last_name}`,
      }))}
  </ul>
</div>
<div className="col-md-3">
  <div>
    <h2>wfms</h2>
    <Select
  options={managers.map((manager) => ({
    value: manager.id,
    label: `${manager.nom} ${manager.prenom}`,
  }))}
  isMulti
  value={selectedManagers}
  onChange={handleManagerSelection}
/>
    <p>liste:</p>
    {managers.map((option) => (
      <h3 key={option.id}>{option.nom}</h3>
    ))}
     
    <button onClick={handleValidate}>confirmer</button>
  </div>
</div>

<div className="col-md-3">
<label >WFM</label>
<Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={nomwfm+"  "+prenomwfm} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setWFM(value.id)}}}

/> 
</div>
</div>

<div className="form-group"  style={{margin:"10px"}} ><button className="btn btn-primary" onClick={UpdateDepartement}>Valider</button></div>    </form>
                        <table className="table responsive"  style={{position:"relative"}}>
          <thead className="thead-light">
            <tr>
              
              <th scope="col">workflow</th>
              <th scope="col">motif</th>
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {workflows.map(s =>
                    <tr key={s.id}>
                      <td >{s.nom}</td>
                      <td >{s.nommotif}</td>
                    
                  
                      <td>
                <div className="row">

                          <div className="col-md-6">

                            <a onClick={() =>Selectworkflow(s.id)} data-toggle="modal" data-target="#modalsite"  ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setcontratIddelete(s.id); }}  ><DeleteIcon className={classes.icon} /></a>


                          </div>
                        </div>
                      </td> 
                    </tr>
                  )}
  <Dialog

BackdropProps={{ invisible: true }}
className={classes.dialog}
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"supprimer un workflow"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer un workflow ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteContrat(contratIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog> 

             
         
          </tbody>
        </table>
        <div style={{margin :"10px"}}>
        <button className="btn btn-primary"  data-toggle="modal" data-target="#modalcreate" >Nouveau Workflow</button>
        </div>






        <div className="modal fade" id="modalsite" role="dialog" aria-labelledby="modalsite" aria-hidden="true" tabindex="-1" data-backdrop="static" data-keyboard="false" >
  <div className="modal-dialog modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier le workflow</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">


   
            <form>


                  <div className="form-group">
                    

                      <input className="form-control" placeholder="Nom de site" value={nomwork} name="nom site" onChange={(e) => setnomwork(e.target.value)} type="text" />
                  
               
              </div>
              <div className="form-group">
                    
              <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Motif"
                                      value={motif_abs}
                                      name="motif_abs"
                                      onChange={(e) => { setType(e.target.value) }}
                                      helperText="Choisir type d'absence"
                                      margin='normal'
                                      fullWidth
                                    >
                                      {motifs.map((option) => (
                                        <MenuItem key={option.id} value={option.id} >
                                   
                                          {option.motif}
                                       
                                        </MenuItem>
                                      ))}

                                    </TextField>
                
             
            </div>
            
              <div className='form-group'>
                                     
             
                                     <label >Manager 1</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val11} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval1(value.id)}}}


/> 
                            </div> 
                             <div className='form-group'>
                                     
             
                                     <label >Manager 2</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val21} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval2(value.id)}}}


/> 
                               
                           
                      

                              

                             </div> 
            <div className='form-group'>
                                     
             
                                     <label >Manager 3</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val31} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval3(value.id)}}}


/> 

                             </div> 
                             <div className='form-group'>
                                     
             
                                     <label >Manager 4</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val41} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval4(value.id)}}}


/> 
                             </div> 
              <div className="form-group"><button className="btn btn-primary" onClick={UpdateUser}>modifer</button></div>    </form>


      </div>

    </div>
  </div>
</div>

<div className="modal fade" id="modalcreate" role="dialog" aria-labelledby="modalcreate" aria-hidden="true" tabindex="-1" data-backdrop="static" data-keyboard="false">
  <div className="modal-dialog modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">creer un  workflow</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
  
            <form>
                  <div className="form-group">
                      <input className="form-control" placeholder="Nom de site" value={nomwork} name="nom site" onChange={(e) => setnomwork(e.target.value)} type="text" />
                  
               
              </div>
              <div className="form-group">
                    
              <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Motif"
                                      value={motif_abs}
                                      name="motif_abs"
                                      onChange={(e) => { setType(e.target.value) }}
                                      helperText="Choisir type d'absence"
                                      margin='normal'
                                      fullWidth
                                    >
                                      {motifs.map((option) => (
                                        <MenuItem key={option.id} value={option.id} >
                                   
                                          {option.motif}
                                       
                                        </MenuItem>
                                      ))}

                                    </TextField>
                
             
            </div>
            
              <div className='form-group'>
                                     
             
                                     <label >Manager 1</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val11} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval1(value.id)}}}


/> 

                             </div> 
                             <div className='form-group'>
                                     
             
                                     <label >Manager 2</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val21} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval2(value.id)}}}


/> 

                             </div> 
            <div className='form-group'>
                                     
             
                                     <label >Manager 3</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val31} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval3(value.id)}}}


/> 
                               
                             </div> 
                             <div className='form-group'>
                                     
             
                                     <label >Manager 4</label>
                        <Autocomplete

options={users}
getOptionLabel={(option) => option.user_name +"  "+ option.last_name || ""}

renderInput={(params) => (
<TextField {...params} label={val41} variant="outlined"  />
)}
onChange={(event, value) =>{if (value && value.id){setval4(value.id)}}}


/> 
                          </div> 

              <div className="form-group"  style={{margin:"10px"}} ><button className="btn btn-primary" onClick={CreateUser}>Valider</button></div>    </form>
     </div>

    </div>
  </div>
</div>
                        </div>
                   </div>
                </div>
            </div>
 </div>

)
}
export default ModifierChild;