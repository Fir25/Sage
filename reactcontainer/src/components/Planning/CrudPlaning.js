import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditIcon from '@mui/icons-material/Edit';
import "react-datepicker/dist/react-datepicker.css";
import useFetch from '../useFetch';
import moment from 'moment'
import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AjouterPlaningByDep from "./AjouterPlaningByDep";
import React from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from "@material-ui/core/styles";
import Mouchard from "../Mouchardd/Mouchard";
import { useSelector } from "react-redux";
function CrudPlaning1() {
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var iduserinfo=test['id']
     var view_planinng_rh=test['view_planinng_rh']
     var planningedit = test['planningedit']
     var planningdelete = test['planningdelete']
      
    }
    const UpdatePlaning = () => {

        let planingList = { title, start, end, plantravail }
        fetch(url+'planning/' + selectedEvent.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization:token
            },
            body: JSON.stringify(planingList)
        }).then(() => {
        }).catch((e) => {

/**            if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })
    }
    const[idplanactuelle,setidplanActuelle]=useState('')
    const[iduseractuelle,setIdUseractuelle]=useState('')
    const[idplanning,setidplanningg]=useState('')
    const DeleteUserbyplanning= (idplanactuelle,iduseractuelle) => {
        fetch(url+'RemoveUserbyplanning/'+iduseractuelle+"/"+idplanactuelle, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:token
            },
        }).then(() => {
            window.location.reload(false);
        }
        ).catch((e) => {

/**            if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })


    }
    const updateUserbyplanning= (e) => {

      

        e.preventDefault()
        fetch(url+'updateUserbyplanning/' + idplanning +"/"+iduseractuelle+"/"+idplanactuelle, {
            method: 'POST',
            headers: {
               
                Authorization: token,
              }
          
        }).then(() => {

            Mouchard(title,nomp,iduseractuelle,iduserinfo,"Modifier planning pour employé:"+nomuser)
window.location.reload(false)

        }).catch((e) => {

        /**    if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })
        


    }
   



    const [date1, setDate1] = useState('')
    const [date2, setDate2] = useState('')
    
    const [open, setOpen] = useState(false);
    const [planingIddelete, setPlaningIddelete] = useState(null)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //
    
const [nomuser,SetNomUser]=useState('')
    const { data: planing = [], isloa, er } = useFetch(url+"planning/");
    const [id, setIdPlanning] = useState('')
    const { data: Usersbyplaning = [], isload, ere } = useFetch(url+"GetUsersbyplanings/" + date1 +"/" + date2);
    const columns = [
        { field: 'matricule', headerName: 'Matricule', width: 130,headerClassName: 'super-app-theme--header',flex:1},
       
        { field: 'user_name', headerName: 'Nom', width: 100,headerClassName: 'super-app-theme--header' ,flex:1},
        { field: 'last_name', headerName: 'Prénom', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},
        { field: 'nomplanning', headerName: 'Nom Planning', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},
        { field: 'nomsemaine', headerName: 'Nom plan', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},
        { field: 'start', headerName: 'debut', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},

        { field: 'end', headerName: 'fin', width: 96 ,headerClassName: 'super-app-theme--header',flex:1},

        {
            field: "action1",
            headerName: "Validation",
            headerClassName: 'super-app-theme--header',
            sortable: false,
            flex:1,
             renderCell: (params) => {    
              return ( planningedit && <a onClick={() => {setidplanActuelle(params.row.idplanactuelle);setIdUseractuelle(params.row.iduseractuelle);SetNomUser(params.row.user_name+" "+params.row.last_name)}} data-toggle="modal" data-target="#modalcontrat" ><EditIcon
              className={classes.icon}
            /></a>)    
            },
        
          },
          {
            field: "action2",
            headerName: "Suppression",
            headerClassName: 'super-app-theme--header',
            sortable: false,
            flex: 1,
            renderCell: (params) => {
              return (
                planningdelete && (
                  <a onClick={() => DeleteUserbyplanning(params.row.idplanactuelle, params.row.iduseractuelle)}>
                    <DeleteIcon className={classes.icon} />
                  </a>
                )
              );
            },
          }
    ]
    const [title, setTitle] = useState('')
//quand on appuie sur un évenement (planning) de calendrier =>selectedEvent =donnée de planning sélectionné
    const handleSelectedEvent = (event) => {
        setSelectedEvent(event)
        setModalState(true) 
        setStart(event.start.toLocaleDateString().split("/").reverse().join("-"))
        setEnd(event.end.toLocaleDateString().split("/").reverse().join("-"))
        setTitle(event.title)
        setPlanTravail(event.plantravail)
        setIdPlanning(event.id)
    }
    const [selectedEvent, setSelectedEvent] = useState(undefined)

    const [modalState, setModalState] = useState(false)

    const DeletePlaning = (id) => {

        fetch(url+'planning/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization:token
            },
        }).then(() => {
            setOpen(false);
            window.location.reload(false);
        }
        ).catch((e) => {

  /**          if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })
    }
    const events = planing.map(plan =>
    ({
        start: new Date((plan.start)),
        end: new Date((plan.end)),
        title: (plan.title).toString(),
        plantravail: (plan.plantravail),
        id: (plan.id)
    })
    )
    const localizer = momentLocalizer(moment)
    const { data: plansemaine = [], isloading, error } = useFetch(url+"plansemaine/")  
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [plantravail, setPlanTravail] = useState('');
    const useStyles = makeStyles({
        root: {
            height: 240,
            flexGrow: 1,
            maxWidth: 400
        },
        icon: {
            marginRight: 10,
            marginLeft: 10,
            color: '#5ac2df'
,
            height:20,
            width:20
        },
    });
    const classes = useStyles();
    
const[nomp,setNomPlan]=useState('')
    return (
        <div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col">
                        <div className="card shadow">
                            <div className="card-header border-0">
                                <div className="row">
                                <div className="col-md-4 ">

<div className="form-group">
<label>Date début </label>

  <div className="input-group input-group-merge input-group-alternative">

    <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
  </div>
</div>
</div>
<div className="col-md-4 ">

<div className="form-group">
<label> Date fin</label>
  <div className="input-group input-group-merge input-group-alternative">

    <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" min={date1} />
  </div>
</div>
</div>
<div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => {console.log("hi") }} >Importer</a></div>
                                    {planningedit && <> <AjouterPlaningByDep />                                
                                                {selectedEvent && <div>
                                                    <div className={`modal-${modalState == true ? 'show' : 'hide'}`}>

                                                        <button className="btn btn-primary" onClick={() => { handleClickOpen(); setPlaningIddelete(selectedEvent.id); }} >Supprimer</button>
                                                        <button className="btn btn-default"  data-toggle="modal" data-target={`#p${selectedEvent.id}`} >Modifier</button>
               <div className="modal fade" id={`p${selectedEvent.id}`}  role="dialog" aria-labelledby={`p${selectedEvent.id}`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="form-group">


                                            <input className="form-control" placeholder="Nom de planning" value={title} name="nom"  type="text" onChange={(e)=>setTitle(e.target.value)}  />

                                        </div>

                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder="date de début" value={start} name="start" type="date"  onChange={(e)=>setStart(e.target.value)} />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <div className="input-group input-group-merge input-group-alternative">

                                                <input className="form-control" placeholder="date de fin" value={end} onChange={(e)=>setEnd(e.target.value)} name="end"  type="date" min={start} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-6'>
                                        <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="plan de travail"
                                            value={plantravail}
                                            onChange={(e)=>setPlanTravail(e.target.value)}
                                            helperText="Please select planning"
                                            margin='normal'
                                            fullWidth
                                        >
                                            {plansemaine.map((option) => (
                                                <MenuItem key={option.nomsemaine} value={option.id}>
                                                    {option.nomsemaine}
                                                </MenuItem>
                                            ))}

                                        </TextField>
                                    </div>
                                </div>








                                <div className="form-group"><button className="btn btn-primary" type="submit" onClick={UpdatePlaning}  >Valider</button></div>  </form> 






          </div>

        </div>
      </div>
      </div>
 
                                                    </div>  <Dialog

                                                        BackdropProps={{ invisible: true }}
                                                        className={classes.dialog}
                                                        open={open}
                                                        onClose={handleClose}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                    >
                                                        <DialogTitle id="alert-dialog-title">
                                                            {"supprimer un planing"}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <DialogContentText id="alert-dialog-description">
                                                                êtes-vous sûr de vouloir supprimer cette planing?
                                                            </DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleClose}>non</Button>
                                                            <Button onClick={() => { DeletePlaning(planingIddelete) }}>
                                                                oui
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </div>
                                                
                                            }
                                            </>
                                                }  
                                        
                            
                                </div>
                                </div>
                                </div>

                            {/* </div> <br/><Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end"
                            style={{ height: 500 }}
                            onSelectEvent={(e) => handleSelectedEvent(e)}


                        /></div>  */}
 <br/>
                       
 {view_planinng_rh==true?"":<>
{selectedEvent &&<>
    <div className="">
        <div className="row">
          <div className="col">
          <div className="card shadow">

          <div className="table-responsive">
    <div style={{ height: 400, width: '100%' }}>

<DataGrid
  rows={Usersbyplaning}
  columns={columns}
  pageSize={5}
  rowsPerPageOptions={[5]}
  getRowId={(row) =>  row.matricule+ row.idplanning}
  sx={{
    
    '& .super-app-theme--header': {
      backgroundColor: '#5ac2df'
    },
  }}

/>

</div>
      </div></div></div></div></div></>}</>}



      <div className="modal fade" id="modalcontrat"  role="dialog" aria-labelledby="modalcontrat" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier planning pour un employé</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              <div className="form-group">
              <TextField
                        id="outlined-select-currency"
                        select
                        label="Nom planning"
                        value={idplanning}
                        onChange={(e) => { setidplanningg(e.target.value) }}
                        helperText="Please select planning"
                        margin='normal'
                        fullWidth
                       
                      >
                        {planing .map((option) => (
                          <MenuItem key={option.id} value={option.id} onClick={(e)=>setNomPlan(e.target.innerText)}>
                            {option.title}
                          </MenuItem>
                        ))}

                      </TextField>
              </div>



              <div className="form-group"><button className="btn btn-primary" onClick={updateUserbyplanning}>Valider</button></div>    </form>


          </div>

        </div>
      </div>
   

</div>
                    </div>

                </div></div></div>
    )
}
export default CrudPlaning1;