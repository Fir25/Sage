import React from 'react';

import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';


import ScrollContainer from 'react-indiana-drag-scroll'

import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjouterTeletravail from './AjouterTeletravail';
import { useSelector } from 'react-redux';
function CrudTeletravail() {
   
 
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   
    

    
  }
  const { data: motifs = [] } = useFetch(url+"motif/")
  const [motif_abs, setType] = useState('');


  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmployes] = useState(iduserinfo);
  const [personneinterimaire,setPersonneinterimaire]=useState('')
  const[joursouvres,setJoursOuvres]=useState('')
  const[datetimereprise,setDateTimeReprise]=useState('')

  const [heure_debut, setHeureDebut] = useState('');
  const [heure_fin, setHeurefin] = useState('');
 
    const { data: teletravails = [], isloading, error } = useFetch(url+"TeletravailListbyId/?id="+iduserinfo)
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
      const [teletravailIddelete, setteletravailIddelete] = useState(null)
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
    
      const [commentaire, setCommentaire] = useState('');

      const [datedebut,setDateDebut]=useState('')
      const[datefin,setdatefin]=useState('')
      
      const employe=iduserinfo

      const [teletravailId, setTeletravailId] = useState(null)
      function SelectTeletravail(id) {
        fetch(url+"UpdateDeleteTeletravail/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
    
            setCommentaire(resp.commentaire);
            setTeletravailId(resp.id)
            setDateDebut(resp.datedebut)
            setdatefin(resp.datefin)
            setadress(resp.adresse)
            setContact(resp.contact)

    setEmployes(resp.employes)
    setDateTimeReprise(resp.datetimereprise)
    setPersonneinterimaire(resp.personneinterimaire)
    setHeureDebut(resp.heure_debut)
    setHeurefin(resp.heure_fin)
    setType(resp.motif_abs)
          })
        }).catch((err)=>{
       
        })
    
    
    
    
    
      }
      const DeleteTeletravail = (teletravailId) => {
        fetch(url+'UpdateDeleteTeletravail/' + teletravailId, {
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
         
        })
    
    
      }
    
      const Updateteletravail = () => {
    
        let teletravailList = { motif_abs, datedebut, datefin, contact, adresse, employes,datetimereprise,personneinterimaire,commentaire,heure_debut,heure_fin}
    
    
        fetch(url+'UpdateDeleteTeletravail/' + teletravailId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(teletravailList)
        }).then(() => {
    
    
    
        }
    
        ).catch((err)=>{
          
        })
      }
    return(
  
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
  {/**        <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Demande téletravail</h3>
      </div> */}
      <div className="card-header border-0">
         
<AjouterTeletravail/>


      </div>
      <div className="table-responsive">
      <ScrollContainer className="scroll-container">
        <table className="table table-bordered display">
          <thead className="thead-light">
            <tr>
            <th scope="col" style={{width:"5%"}}>Matricule</th>
            <th scope="col" style={{width:"10%"}}>Nom et prénom</th>
            <th style={{width:"10%"}} scope="col">début</th>
      <th style={{width:"10%"}} scope="col">fin</th>
              <th scope="col">commentaire</th>
 
   
      <th style={{width:"10%"}} scope="col">Contact</th>
      <th style={{width:"10%"}} scope="col">Adresse</th>
      
    
     
     
              <th scope="col" style={{width:"10%"}}>Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {teletravails.map(teletravail =>
                    <tr key={teletravail.id}>
                             <td >{teletravail.matricule}</td>
                         <td >{teletravail.employee +"  "+teletravail.last_name}</td>
                         <td >{teletravail.datedebut}</td>
                         <td >{teletravail.datefin}</td>
                      <td >{teletravail.commentaire}</td>
                      
           <td>{teletravail.contact}</td>
           
           <td>{teletravail.adresse}</td>
         
       
        
       
    
                      <td>
                        <div className="row">

                          <div className="col-md-6">

                            <a onClick={() => SelectTeletravail(teletravail.id)} data-toggle="modal" data-target="#modalteletravail" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setteletravailIddelete(teletravail.id); }}  ><DeleteIcon className={classes.icon} /></a>


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
  {"supprimer un teletravail"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer un teletravail ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteTeletravail(teletravailIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>

             
         
          </tbody>
        </table>
        </ScrollContainer>
      </div>
  
    </div> 
    <div className="container">





    <div className="modal fade" id="modalteletravail"  role="dialog" aria-labelledby="modalteletravail" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Le Teletravail</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



            <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">


                                    <input className="form-control" placeholder="Contact" value={contact} name="contact" onChange={(e) => setContact(e.target.value)} type="text" />

                                  </div>

                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">

                                    <input className="form-control" placeholder="Adresse" value={adresse} name="adresse" onChange={(e) => setadress(e.target.value)} type="text" />

                                  </div>


                                </div>
                                
                      



                                </div>
                               
                               
                            
                                
                                
                                <div className='row'>
                                  <div className='col-md-6'>
                                    <div className="form-group">


                                      <input className="form-control" placeholder=""  value={datedebut} name="date_debut" onChange={(e) => setDateDebut(e.target.value)} type="date" />

                                    </div>

                                  </div>
                                  <div className='col-md-6'>
                                    <div className="form-group">


                                      <input className="form-control" placeholder="" value={datefin} min={datedebut}   name="date_fin" onChange={(e) => setdatefin(e.target.value)} type="date" />

                                    </div>

                                  </div>
                            
                              
                                </div>
                      
                <div className='row'>
      
                <div className='col-md-4'>
                                    <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Motif"
                                      value={motif_abs}
                                      onChange={(e) => { setType(e.target.value) }}
                                      helperText="Svp sélectionner une motif"
                                      margin='normal'
                                      fullWidth
                                    >
                                      {motifs.filter(x=>x.motifteletravail==true).map((option) => (
                                        <MenuItem key={option.id} value={option.id} onClick={()=>setJoursOuvres(option.nombrejours_ouvres)}>
                                   
                                          {option.motif}
                                       
                                        </MenuItem>
                                      ))}

                                    </TextField>




                                  </div>
                       
                </div>
                       
                      
                                <div className='row'>
                                <div className="col-md">
                                <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
</div>
                                </div>

                           {/**} */} 


                       {/**     {checked ?  <div className='row'>
                              <div className='col-md-6'>
                                <div className="form-group">


                                  <input className="form-control" placeholder="" value={heure_debut} name="heure_debut" onChange={(e) => setHeureDebut(e.target.value)} type="time" />

                                </div>

                              </div>
                              <div className='col-md-6'>
                                <div className="form-group">


                                  <input className="form-control" placeholder="" value={heure_fin} name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

                                </div>

                              </div>
                            </div> : ""} */}


<br/>

                            <div className="form-group"><button className="btn btn-primary" type="submit" onClick={Updateteletravail} >Valider</button></div>

                          {/**  <FormControlLabel control={<Checkbox onChange={handleChange}
                            />} label="demender une autorisation" />
 */}
            </form>


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
export default CrudTeletravail;


