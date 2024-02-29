
import React, { useState } from 'react';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
function AjouterjourFerié() {
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

    const url=process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      
      var absenceedit = test['absenceedit']
      var absencedelete = test['absencedelete']
    }
    const [nom, setNom] = useState('');
    const [etat_jour, setetatJour] = useState('');
    const [date, setDate] = useState('');
    const [datefin, setDateFin] = useState('');
const[alert,setAlert]=useState(false)
    const handlesubmit = (e) => {
        e.preventDefault()
setAlert(false)
        const JourFerie = { nom, etat_jour, date, datefin }

        fetch(url+"JourFerie/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" ,
                     Authorization: token,
                },
                body: JSON.stringify(JourFerie)
            }).then((response) =>{
                if(!response.ok) throw new Error(response.status);
                else window.location.reload(false)
        
            }).catch((e) => {
             /**   if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
                  setAlert(true)
          
            })
    }

    return (
        <div>

            <div className="row">

              {  absenceedit && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterjourferié">
                    Ajouter Un Jour Ferié
                </button>}


                <div className="modal fade" id="ajouterjourferié" role="dialog" aria-labelledby="ajouterjourferié" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Une Jour Ferié</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                             
                                <form>

                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">


                                                <input className="form-control" placeholder="nom jour Ferié" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />

                                            </div>

                                        </div>
                                        <div className='col-md-6'>
                                        <div className="form-group">


<input className="form-control" placeholder="Type de  jour Ferié" value={etat_jour} name="nom"  onChange={(e) => { setetatJour(e.target.value) }} type="text" />

</div>
                                        </div>
                                    </div>




                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                            <label for="datedebut">Date début</label>
                                                <input className="form-control" id="datedebut" value={date} onChange={(e) => setDate(e.target.value)}  placeholder="date" type="date"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-group">
                                            <label for="datefin">Date fin</label>

                                                <input id="datefin" className="form-control" placeholder="nombre de jours feriés" value={datefin} name="datefin" onChange={(e) => setDateFin(e.target.value)} type="date" min={date} />

                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="form-group">
                                        <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
                                        </div>
                                        <div  >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>
                                </form>

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
export default AjouterjourFerié;