import React, { useState } from 'react'
import useFetch from '../useFetch';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';

import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard'
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
function Ajouterdemanderh() {
  
  const url=process.env.React_App_URL;
  
  const { data: motifs = [] } = useFetch(url+"motif/")
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    
  }
 
  const [employes, setEmployes] = useState(iduserinfo);
  const [heure_debut, setHeureDebut] = useState('');
  const [heure_fin, setHeurefin] = useState('');
  const validation = 0
  const [date_autorisation, setDateAutorisation] = useState(null)
  const validationrh = 0
  const validationrh2=0
  const [motif_abs, setType] = useState('');
 
  const [commentaire, setCommentaire] = useState('')
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
const[alerterror,setAlertError]=useState(false)
const[alertpersonne,setAlertPersonne]=useState(false)
const[alertheures,setAlertHeures]=useState(false)
  const today = new Date()
  const[disabl,setDisable]=useState(false)
  const[alertautorisation,setAlertautorisation]=useState(false)
  const handlesubmit = (e) => {
    e.preventDefault()
    const differenceTime = heure_fin - heure_debut
    const t = format(new Date('2018-02-14T02:00:00.000'), 'HH:mm')

    const minutes = ((new Date('2018-02-14T' + heure_fin + ':00.000').getHours() - new Date('2018-02-14T' + heure_debut + ':00.000').getHours()) * 60) + (new Date('2018-02-14T' + heure_fin + ':00.000').getMinutes() - new Date('2018-02-14T' + heure_debut + ':00.000').getMinutes())

    setAlertPersonne(false)
    setAlertautorisation(false)
    setAlertHeures(false)
   

   



      const conge = { employes, validation,   commentaire,validationrh,validationrh2 , motif_abs }
      setDisable(true)
      fetch(url+"demendeconges/" + iduserinfo + "/" + "demanderh/"+"0/0/0/0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify(conge)
        })
        .then((response) => {

          if (!response.ok ) throw new Error(response.status);
          else if(response.status==202){
            setAlertautorisation(true)
            setDisable(false)
          }
          else {
            setDisable(false)
            Mouchard("-", "encours", employes, iduserinfo, "Demande  d'une autorisation en " + date_autorisation + "de " + heure_debut + "au " + heure_fin)

            window.location.reload(false);
         
          }
    
        }).catch((e) => {
      /**    if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
        
          setDisable(false)
          setAlertError(true)
      
        })

  }

  return (
    <div className='row' >

      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterautor">
        Demande RH
      </button>


      <div className="modal fade" id="ajouterautor" role="dialog" aria-labelledby="ajouterautor" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Demande RH</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">



              <form>


              <div className="row">
             
                         
                         <div className='col-md-12'>
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
                               {motifs.filter(x=> x.motifdemanderh == true).map((option) => (
                                 <MenuItem key={option.id} value={option.id}>
                            
                                   {option.motif}
                                
                                 </MenuItem>
                               ))}

                             </TextField>




                           </div>
                   
                </div>


                  <div className='row'>




                    
                  
                  </div>


                


              
                  <div className='row'>
                    <div className="col-md">
                      <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
                    </div>
                  </div>

                  <br />
                  <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} disabled={disabl? true:false}>Valider</button></div>
             
                
                  {alerterror &&
                                      <Alert variant="filled" severity="error">
                                Erreur!
                                    </Alert> }
                                 
                                  
                                    
                </form>


            </div>

            <div className="modal-footer">



            </div>

          </div>
        </div>
      </div>
    </div>



  )
}
export default Ajouterdemanderh;