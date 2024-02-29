import useFetch from '../useFetch';
import React, { useState , useEffect , useMemo } from 'react';
import AjouterDepartement from './AjouterDepartement';
import { MultiSelect } from '../MultiSelect';
import Select  from "react-select";
import { makeStyles } from '@mui/styles';
import frdatatable from '../../frdatatable.json'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import Alert from '@mui/material/Alert';

import { useSelector } from 'react-redux';
import axios from 'axios';
function CrudDepartement() {
  const [options,setoptions]=useState([])
  const [optionmanager1,set1]=useState([])
  const [optionmanager2,set2]=useState([])
  const [optionmanager3,set3]=useState([])
  const [optionmanager4,set4]=useState([])
  const [motifmulti,setmulti]=useState([])
  const [motifmultiedit,setmultiedit]=useState([])

  const [idworkflow, setidwork] =  useState(null)
  const [selectedmotif, setselectmotif] =  useState(null)
  const [done, setdone] =  useState(false)

  const [error, seterror] =  useState(false)
  const [mmd, setMmd] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [workflows , setworkflows]=useState([])
  const [nomwork, setnomwork] = useState('')
  const [val1, setval1] = useState(null)
  const [val2, setval2] =  useState(null)
  const [val3, setval3] =  useState(null)
  const [val4, setval4] =  useState(null)
  const [val11, setval11] = useState(null)
  const [val21, setval21] =  useState(null)
  const [val31, setval31] =  useState(null)
  const [val41, setval41] =  useState(null)
  const [motif_abs, setType] = useState('');
  const [motifoption , setmotif ]=useState([])
  const arr=[]
  const [managers , setManagers ]=useState([])
  const [departementId, setDepartementId] = useState(null)
  const [parent, setparentid] =useState(null)
  const [parentname , setparentname] =useState(null)
  const [chef, setChef] = useState('')
  const [rh, setRH] = useState('')
  const [rh2, setRH2] = useState('')
const[wfm,setWFM]=useState('')
const handleChange1 = (selected) => {
  setmotif(selected);};
const handleChangemotif = (selectedOption) => {
  setType(selectedOption.value);
};
const submitManagers = (e) => {
  e.preventDefault();
  const requestBody = [];
  options.forEach((option) => {
    const requestData = {
      label: option.label,
      value: option.value,
      departement_id: departementId,
    };
    requestBody.push(requestData);
  });
  fetch(url + "managerscreate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(requestBody),
  })
  .then((response) => {
    if (response.ok) {
      setSuccessAlert(true);
      setErrorAlert(false);
      setTimeout(() => {
        setSuccessAlert(false);
      }, 3000); 
    } else {
      setSuccessAlert(false);
      setErrorAlert(true);
      setTimeout(() => {
        setErrorAlert(false);
      }, 3000); 
    }
  })
  .catch((e) => {
    setSuccessAlert(false);
    setErrorAlert(true);
    setTimeout(() => {
      setErrorAlert(false);
    }, 3000); 
  });
};
function getManagers(id){
axios.get(url+"managersbyid/" + id, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    
    },
  }).then( res =>{
   setoptions(res.data) 
  }
    
  ).catch( err =>{
   /* if ( err.response.status=== 401) {
    logoutfunction(err.response.status)
    }*/
  })
}
const updateWorkflow = async () => {
  const moff = [...motifmultiedit, selectedmotif];
  moff.push({value : idworkflow , label : ""})
  let successfulOperations = 0;
  let failedOperations = 0;
  for (const conge_type of moff) {

  const requestBody = {
    //workflow_name: "nomwork",
    //conge_type: conge_type["value"],
    valideur_1: optionmanager1.map(option => option.value),
    valideur_2: optionmanager2.map(option => option.value),
    valideur_3: optionmanager3.map(option => option.value),
    valideur_4: optionmanager4.map(option => option.value),
  };
try {
    const response = await axios.put(url + 'managers/' + conge_type["value"] + '/', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    console.log(response.data); 
    successfulOperations++;
  } catch (error) {
    console.error(error);
    failedOperations++;
  }

}
if (successfulOperations != 0 ) {
  setdone(true)

 
  setTimeout(() => {
    setdone(false);
  }, 2000); 
}else{
  seterror(true)
  setTimeout(() => {
    seterror(false);
  }, 2000); 
}
};
const getvalidateurs = async (id) => {
  try {
    const response = await axios.get(url + 'managers/' + id + '/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    });
    const data = response.data;
    const managers1 = data.filter((manager) => manager.field === 'valideur_1');
    const managers2 = data.filter((manager) => manager.field === 'valideur_2');
    const managers3 = data.filter((manager) => manager.field === 'valideur_3');
    const managers4 = data.filter((manager) => manager.field === 'valideur_4');
    set1(managers1);
    set2(managers2);
    set3(managers3);
    set4(managers4);
  } catch (error) {
    /*
    if (error.response.status === 401) {
      logoutFunction(error.response.status);
    }
    */
  }
}
const UpdateDepartement = () => {
  let departementList = { nom ,parent}
  fetch(url+'arbo/' + departementId, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization:token
      },
      body: JSON.stringify(departementList)
  }).then((response) => {

console.log(departementList , departementId)
  }

  ).catch((e) => {
console.log(e)
  })
}
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
  async function SelectDepartement(id) {
    try {
      fetch(url+"departementbyid/" + id, {method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }}).then((result) => {
          result.json().then((resp) => {
     
              setNom(resp.name);
              setparentid(resp.parent_id)
              setparentname(resp.parent)
        
          })
      }).catch((e) => {

      })

      const [ managersData, workflowsData ] = await Promise.all([
      
        fetch(url + "managersbyid/" + id , {
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
      setManagers(managersData);
      console.log( managers)
      setworkflows(workflowsData);
     
    } catch (error) {
      console.error(error);
      // Handle error or display error message
    }
  }
  useEffect(() => {
    const newMmd = workflows.map((s) => ({
      
      "label": s.workflow_nom , 
      "value": s.workflow_id,
    }));
    setMmd(newMmd)
    console.log(newMmd)
    console.log(motifs)
  }, [workflows]);
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const useStyles = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'
    },
    dialog: {
      boxShadow: 'none',
    }
  });
  
  const classes = useStyles();
  const { data: users  = [] } = useFetch(url+"userselect/")
  const { data: departements  = [] } = useFetch(url+"departments/")
  const { data: motifs = [] } = useFetch(url+"motifselect/")

  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){  
    var view_departements_edit=test['view_departements_edit']
    var view_departements_del=test['view_departements_del'] 
  }
  const [open, setOpen] = useState(false);
  const [opendep, setOpendep] = useState(false);

  const [depdel, setcontdel] = useState('')

  const [contratIddelete, setcontratIddelete] = useState('')
  const [openmodal, setOpenmodal] = useState(true);
  const [nom, setNom] = useState('');
  const[id,SetId]=useState('')
  const handleClickOpendep = () => {
    setOpendep(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClosemodal = () => {
    setOpenmodal(false);
  };
  const handleClosedep = () => {
    setOpendep(false);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const Deletedep = (contratId) => {
    fetch(url+'updatedeletesite/' + contratId, {
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
  const DeleteContrat = (contratId) => {
    fetch(url+'managers/' + contratId + "/", {
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
  const Createworkflow = async () => {
    let x = 0 ;
    for( let  i=0 ; i<motifmulti.length ; i++){ 
    const requestBody = {
      nom: nomwork +'_'+motifmulti[i]["label"],
      type_conge: motifmulti[i]["value"],
      valideur_1: optionmanager1.map(option => option.value),
      valideur_2: optionmanager2.map(option => option.value),
      valideur_3: optionmanager3.map(option => option.value),
      valideur_4: optionmanager4.map(option => option.value),
      departement: departementId,
    };
  
    try {
      const response = await axios.post(url + 'workflowconge/create/', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      console.log(response.data); // Success message from Django
      x++
      // setSuccessAlert(true);
      // setErrorAlert(false);
      // setTimeout(() => {
      //   setSuccessAlert(false);
      // }, 3000);
    } catch (error) {
      console.error(error);
  
      // setSuccessAlert(false);
      // setErrorAlert(true);
      // setTimeout(() => {
      //   setErrorAlert(false);
      // }, 3000);
    }
  if(x==motifmulti.length){
    window.location.reload(false);
  }
  }

  };
  
  // let selectedOptionm = null;
  // for (let i = 0; i < motifs.length; i++) {
  //   if (motifs[i].value == motif_abs) {
  //     selectedOptionm = motifs[i];
  //     break;
  //   }
  // }
  

$(document).ready(function () {
$('#sitetable').DataTable({
language:frdatatable,
"dom": 'Blfrtip',
buttons: [
  {extend:'excel',
className:'btn btn-buttondatatable'},
{extend:'copy',
className:'btn btn-buttondatatable'},
{extend:'pdf',
orientation: 'landscape',
pageSize: 'LEGAL',
className:'btn btn-buttondatatable'},
{extend:'csv',
className:'btn btn-buttondatatable'},
{extend:'print',
className:'btn btn-buttondatatable'},      


 
]
,"bDestroy": true
} )})
  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
    <div className="card shadow">
 {/**   <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Départements </h3>
      </div> */}
<div className="card-header border-0">
  
  {view_departements_edit==true &&
            <AjouterDepartement />}
       
       {departements && departements.length > 0 &&
      <div className="table-responsive">
   
             <table className="table table-bordered display" id="sitetable">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">departement</th>
              <th scope="col">parent </th>
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>

            {departements.map(s =>
                    <tr key={s.id}>
                      <td >{s.name}</td>
                      <td >{s.parent}</td>
                      <td>
                <div className="row">

                          {view_departements_edit == true && <div className="col-md-6">
                          <a onClick={() => { SelectDepartement(s.id) ;setDepartementId(s.id) ; getManagers(s.id) }}  ><EditIcon className={classes.icon} data-toggle="modal" data-target={'#editdepartement'}  /></a>
                         
                          </div>}
                        { view_departements_del == true && <div className="col-md-6">
                            <a onClick={() => { handleClickOpendep(); setcontdel(s.id); }}  ><DeleteIcon className={classes.icon} /></a>


                          </div>}
                        </div>
                      </td> 
                    </tr>
                  )}
  <Dialog

BackdropProps={{ invisible: true }}
className={classes.dialog}
open={opendep}
onClose={handleClosedep}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"supprimer un contrat"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer un departement ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClosedep}>non</Button>
  <Button onClick={() => { Deletedep(depdel) }}>
    oui
  </Button>
</DialogActions>
</Dialog> 

          </tbody>
        </table>
        </div>
        } 
             <div className="modal fade" id="editdepartement" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" tabIndex="-1" data-backdrop="static" data-keyboard="false">
  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier Département</h5>
        <button type="button" className="close" onClick={handleClosemodal} data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body" style={{ width: "700px" }}>
      {successAlert && (
              <div className="alert alert-success" role="alert">
               La liste a été modifiée avec succès !
              </div>
            )}
            {errorAlert && (
              <div className="alert alert-danger" role="alert">
                une erreur s'est produite  !
              </div>
            )}
        <form>
          <div className="form-group">
            <div className="input-group input-group-merge input-group-alternative">
              <input className="form-control" placeholder="" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />
            </div>
          </div>
           <div className="row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <label style={{ textAlign: 'center', marginBottom: '10px' }}>Managers</label>
  <div>
    <MultiSelect options={users} value={options} onChange={setoptions} />
  </div>
  <label style={{ textAlign: 'center', marginTop: '10px' }}>Parent</label>
  <div style={{display: "flex" ,
  justifyContent: "center",
  width: "50%" ,
  alignItems: "center" }}>
    <Autocomplete
      options={departements}
      getOptionLabel={(option) => option.name || ""}
      renderInput={(params) => (
        <TextField {...params} label={parentname}  fullWidth   variant="outlined" />                                                              
      )}
      onChange={(event, value) => { if (value && value.id) { setparentid(value.id) ; setparentname(value.parent) } }}
    />
  </div>
</div>
          <div className="form-group" style={{ margin: "10px" }}>
  <button className="btn btn-primary" onClick={(e)=>{UpdateDepartement() ; submitManagers(e)}}>Valider</button>
</div>
</form>
<table className="table responsive" style={{ position: "relative" }}>
  <thead className="thead-light">
    <tr>
      <th scope="col">workflow</th>
      <th scope="col">motif</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  {workflows.length > 0 ? workflows.map((s) => (
  <tr key={s.id}>
    <td>{s.workflow_nom}</td>
    <td>{s.motif}</td>
    <td>
      <div className="row">
        <div className="col-md-6">
          <a onClick={() => {Selectworkflow(s.workflow_id); getvalidateurs(s.workflow_id); setnomwork(s.workflow_nom); setidwork(s.workflow_id); setselectmotif(s.motif_id) }} data-toggle="modal" data-target="#modalsite">
            <EditIcon className={classes.icon} />
          </a>
        </div>
        <div className="col-md-6">
          <a onClick={() => { handleClickOpen(); setcontratIddelete(s.workflow_id); }}>
            <DeleteIcon className={classes.icon} />
          </a>
        </div>
      </div>
    </td>
  </tr>
)) : (
  <tr>
    <td colSpan="3">No workflow to show !</td>
  </tr>
)}
  </tbody>
</table>

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

<div style={{ margin: "10px" }}>
  <button className="btn btn-primary" data-toggle="modal" data-target="#modalcreate">Nouveau Workflow</button>
</div>
</div>
</div>
</div>
</div>
                                   {/* fin modal create  */}
<div className="modal fade" id="modalcreate" role="dialog" aria-labelledby="modalcreate" aria-hidden="true" tabIndex="-1" data-backdrop="static" data-keyboard="false">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Créer un workflow</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <form>
          <div className="form-group">
            <input className="form-control" placeholder="Nom de workflow" value={nomwork} name="nom worklow" onChange={(e) => setnomwork(e.target.value)} type="text" />
          </div>
   

          <div className="form-group">
        <label htmlFor="motif_abs">Motif</label>
        {motifs.length > 0 ? (<MultiSelect
           id="motif_abs"
           options={   motifs.filter(motif =>
            !workflows.some(workflow => workflow.motif_id === motif.value)
          )}
      
           value={motifmulti}
           onChange={setmulti}
           />) : (
        <p> liste des motifs est vide !</p>
      )  }
     

    </div>

  
          <div className='form-group'>
            <label>Manager 1</label>
            <MultiSelect options={users} value={optionmanager1} onChange={set1} />

          </div>
          <div className='form-group'>
            <label>Manager 2</label>
            <MultiSelect options={users} value={optionmanager2} onChange={set2} />

          </div>
          <div className='form-group'>
            <label>Manager 3</label>
            <MultiSelect options={users} value={optionmanager3} onChange={set3} />

          </div>
          <div className='form-group'>
            <label>Manager 4</label>
            <MultiSelect options={users} value={optionmanager4} onChange={set4} />

          </div>
          <div className="form-group" style={{ margin: "10px" }}>
                <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); Createworkflow(); }}>Valider</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div className="modal fade" id="modalsite" role="dialog" aria-labelledby="modalsite" aria-hidden="true" tabIndex="-1" data-backdrop="static" data-keyboard="false">
  <div className="modal-dialog modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier le workflow : {nomwork == null ? " " : nomwork } </h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <form>
          {/* <div className="form-group">
            <input
              className="form-control"
              placeholder="Nom de site"
              value={nomwork}
              name="nom site"
              onChange={(e) => setnomwork(e.target.value)}
              type="text"
            />
          </div> */}
          <div className="form-group">
          <label> Reproduire la modification  : </label>
          {mmd.length > 0 ? (<MultiSelect
           id="motif_abs"
           options={mmd.filter((workflow)=>workflow.value !== idworkflow)}
           value={motifmultiedit}
           onChange={setmultiedit}
           />) : (
        <p> liste des motifs est vide !</p>
      )  }
   

          </div>
          {motifmultiedit.length >0 ?
          <Alert severity="warning">Attention, vous allez reproduire cette modification pour tous les workflows sélectionnés</Alert> : " "}
          <div className='form-group'>
            <label>Manager 1</label>
            <MultiSelect options={users} value={optionmanager1} onChange={set1} />

          </div>
          <div className='form-group'>
            <label>Manager 2</label>
            <MultiSelect options={users} value={optionmanager2} onChange={set2} />

          </div>
          <div className='form-group'>
            <label>Manager 3</label>
            <MultiSelect options={users} value={optionmanager3} onChange={set3} />

          </div>
          <div className='form-group'>
            <label>Manager 4</label>
            <MultiSelect options={users} value={optionmanager4} onChange={set4} />

          </div>
                <div className="form-group">
                <button className="btn btn-primary"  onClick={(e) => {
    e.preventDefault(); // Prevent the default behavior (page reload)
    updateWorkflow();
   
  }}>Modifier</button>
  { done && <div style ={{marginTop : 10}}className="alert alert-success" role="alert">
               La liste a été modifiée avec succès !
              </div>}
             { error && <div className="alert alert-danger" role="alert">
                une erreur s'est produite  !
              </div>}
                </div>
                </form>
                </div>
                </div>
                
                  </div>
                </div>
           </div></div> </div></div></div></div>)
     }
export default CrudDepartement;