import React, { useState } from 'react';
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import { MultiSelect } from '../MultiSelect';

function AjouterPointage() {
  const url = process.env.React_App_URL;
  const [options, setoptions] = useState([]);
  const { data: motifs = [] } = useFetch(url + "motif/");
  const { data: users = [] } = useFetch(url + "userselect/");
  const { data: pointeuses = [] } = useFetch(url + "pointeuse/");
const [pointeuse, setPointeuse] = useState('');

  const userinfo = useSelector(state => state.userinfo);
  const iduserinfo = userinfo.length > 0 ? userinfo[0].id : null;

  const [heure_debut, setHeureDebut] = useState('');
  const [date_autorisation, setDateAutorisation] = useState('');
  const [motif_abs, setType] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [disabl, setDisable] = useState(false);
  const [alerterror, setAlertError] = useState(false);
  const [alertautorisation, setAlertautorisation] = useState(false);

  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null;
  const today = new Date();

  const handlesubmit = (e) => {
    e.preventDefault();

    setDisable(true);
    setAlertError(false);
    setAlertautorisation(false);

    if (!date_autorisation || !heure_debut || options.length === 0) {
      setAlertError(true); 
      setDisable(false);
      return;
    }

    const date_pointage = new Date(`${date_autorisation}T${heure_debut}:00`);
    if (isNaN(date_pointage)) {
      setAlertError(true);
      setDisable(false);
      return;
    }

    for (let i = 0; i < options.length; i++) {
  const pointage = {
    employes: options.map(opt => opt.value),  // 👈 envoyer UN ID
    date_pointage: `${date_autorisation} ${heure_debut}:00`,
    heure_pointage: heure_debut,
    motif: motif_abs,
    commentaire: commentaire,
    pointeuse:pointeuse


  };
  console.log("CORPS envoyé à l'API :", JSON.stringify(pointage));
  fetch(url + "createpointage/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(pointage)
  })
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(() => {
    if (i === options.length - 1) window.location.reload(false);
  })
  .catch(() => {
    setDisable(false);
    setAlertError(true);
  });
  };
  }
  return (
    
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterautor">
    Demande Pointage
  </button>



      <div className="modal fade" id="ajouterautor" role="dialog" aria-labelledby="ajouterautor" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Demander un pointage</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handlesubmit}>
                <div className="row">
                  <div className='col-md-12'>
                    <TextField
                      select
                      label="Motif"
                      value={motif_abs}
                      name="motif_abs"
                      onChange={(e) => setType(e.target.value)}
                      helperText="Choisir type d'absence"
                      margin='normal'
                      fullWidth
                    >
                      {motifs.filter(x => x.motifpointage).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.motif}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>

                  <div className='col-md-12' style={{ marginBottom: 20 }}>
                    <label style={{ textAlign: 'center', marginBottom: '10px' }}>Utilisateurs</label>
                    <MultiSelect options={users} value={options} onChange={setoptions} />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-12'>
                    <div className="form-group">
                      <label>Date de pointage</label>
                      <input
                        className="form-control"
                        type="date"
                        value={date_autorisation}
                        onChange={(e) => setDateAutorisation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='col-md-12'>
                    <div className="form-group">
                      <label>Heure de pointage</label>
                      <input
                        className="form-control"
                        type="time"
                        value={heure_debut}
                        onChange={(e) => setHeureDebut(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className="col-md">
                    <textarea
                      placeholder='Commentaire'
                      className="form-control"
                      value={commentaire}
                      onChange={(e) => setCommentaire(e.target.value)}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className='col-md-12'>
                <TextField
                    select
                    label="Pointeuse"
                    value={pointeuse}
                    onChange={(e) => setPointeuse(e.target.value)}
                    helperText="Choisir une pointeuse"
                    margin='normal'
                    fullWidth
                >
                    {pointeuses.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.nom_pointeuse}
                    </MenuItem>
                    ))}
                </TextField>
                </div>


                <br />
                <div className="form-group">
                  <button className="btn btn-primary" type="sub mit" disabled={disabl}>Valider</button>
                </div>

                {alerterror && (
                  <Alert variant="filled" severity="error">
                    Erreur de soumission !
                  </Alert>
                )}

                {alertautorisation && (
                  <Alert variant="filled" severity="warning">
                    L'autorisation est en cours de traitement !
                  </Alert>
                )}
              </form>
            </div>
 
            <div className="modal-footer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AjouterPointage;
