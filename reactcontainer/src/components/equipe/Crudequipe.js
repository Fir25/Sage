import useFetch from '../useFetch';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { MultiSelect } from '../MultiSelect';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DropdownTreeSelect from 'react-dropdown-tree-select'
import Ajouterequipe from './AjouterEquipe';
import $ from "jquery";
import React, { useState , useEffect , useRef, useMemo  } from 'react';
import frdatatable from '../../frdatatable.json'
function Crudequipe() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
    const { data: sites = [], isloading, error } = useFetch(url+"equipe/")
    const [empequipe,setequipe]=useState([])
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const { data: users  = [] } = useFetch(url+"userselect/")
    const getemp = async (id) => {
      try {
        const response = await axios.get(url + 'equipeselect/' + id , {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
          },
        });
      
        setequipe(response.data);
     
      } catch (error) {
        /*
        if (error.response.status === 401) {
          logoutFunction(error.response.status);
        }
        */
      }
    }
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var sitesedit=test['Sitesedit']
     var sitesdelete=test['Sitesdelete']
    
    }
    const useStyle = makeStyles({
        icon: {
          marginRight: 10,
          marginLeft: 10,
          color: '#5ac2df'

        },
        dialog: {
    
          boxShadow: 'none',
        }
      });
      const [open, setOpen] = useState(false);
      const [contratIddelete, setcontratIddelete] = useState('')
      const[id,SetId]=useState('')
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
   
      const [uss,setuss]=useState([])
      const usersdep=[]
      const[nomsite,setNomSite]=useState('')
      const[uu,setU]=useState([])

      function SelectContrat(id) {
        fetch(url+"updateequipe/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
       
            setNomSite(resp.nomsite);
            SetId(resp.id)
    
          })
        }).catch((err)=>{
        /**  if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'updateequipe/' + contratId, {
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
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const nomequipe = { nomequipe: nomsite };
      
        try {
          await fetch(url + 'updateequipe/' + id, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify(nomequipe),
          });
      
          const response = await axios.post('/api/setequipe/', {
            userIds: empequipe.map(user => user.value),
            equipeId: id,
          }, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: token,
            },
          });
      
          if (response.status === 200) {
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
      
          console.log(response.data.message); // Display success message
        } catch (error) {
          setSuccessAlert(false);
          setErrorAlert(true);
          setTimeout(() => {
            setErrorAlert(false);
          }, 3000);
          console.error(error);
        }
      }
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
   useEffect(() => {


    fetch(url+"depuser/?id=" + uu , {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
     
/** if ( result.status===401) {
        logoutfunction(result.status)
      } */
      result.json().then((resp) => {
    
      resp.map(x=>usersdep.push({"label":x.label,"value":x.value}))
      setuss(resp)
      })
    
    })        .catch(err => {
     /** if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
     
    })

  }, [uu])

   const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
   const [treeData, setTreeData] = useState([]);
  useEffect(()=>{

   
    setTreeData(dataadmin)
   

  
  
  },[dataadmin])

  
  
  
  
  
  
  
  
  
  
  
  
  
   const handleChange = (selected, allchecked) =>{
    let results = allchecked.map(({value})=>value);
  
    setU(results)
  }
  
  
  
  
   const dropdown = useMemo(()=>{
    return(
  
          <DropdownTreeSelect
                data={treeData}
                onChange={(selected, allchecked) =>{handleChange(selected, allchecked)}}
                texts={{ placeholder: "Département" }}
                className="mdl-demo" 
            />
     )}, [treeData]);
    return(
  
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
{/**          <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Sites </h3>
      </div> */}
      <div className="card-header border-0">
        { sitesedit == true && 
 <Ajouterequipe/>
        }
          
      </div>
      {sites.length==0?""  :
      <div className="table-responsive">
   
             <table className="table table-bordered display" id="sitetable">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Nom d'equipe</th>
        
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {sites.map(s =>
                    <tr key={s.id}>
                      <td >{s.nomequipe}</td>
                  
                      <td>
                <div className="row">

                          {sitesedit == true &&<div className="col-md-6">

                            <a onClick={() =>{SelectContrat(s.id) ;getemp(s.id) ; setNomSite(s.nomequipe) ; SetId(s.id)}} data-toggle="modal" data-target="#modalsite" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>}
                        { sitesdelete == true && <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setcontratIddelete(s.id); }}  ><DeleteIcon className={classes.icon} /></a>


                          </div>}
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
  {"supprimer un contrat"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer cette equipe  ?
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
        </div>
        }
   
   
      <div className="container">




<div className="modal fade" id="modalsite" role="dialog" aria-labelledby="modalsite" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier l'equipe</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">

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

            <div className='col-md-3' style={{marginTop : 20 , marginBottom : 20 }}>

<label>Departement</label>
{dropdown}


</div>
                  <div className="form-group">
                    

                      <input className="form-control" placeholder="Nom d'equipe" value={nomsite} name="nom site" onChange={(e) => setNomSite(e.target.value)} type="text" />
                      <label style={{ textAlign: 'center', marginBottom: '10px' }}>membres</label>
  <div>
    <MultiSelect options={uss} value={empequipe} onChange={setequipe} />
  </div>
               
              </div>
  

              <div className="form-group"><button className="btn btn-primary" onClick={handleSubmit}>Valider</button>
</div>    </form>


      </div>

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
export default Crudequipe;