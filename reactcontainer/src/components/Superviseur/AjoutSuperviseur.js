import React, { useState } from 'react';
import logoutfunction from '../authentification/logoutfunction';
import useFetch from '../useFetch'; // Hook personnalisé pour récupérer les données
import { MultiSelect } from '../MultiSelect';

function AjoutSuperviseur() {
  // Récupération du token pour l’authentification
  const token = localStorage.getItem('access_token')
    ? 'Bearer ' + localStorage.getItem('access_token')
    : null;

  // L'URL de votre API (assurez-vous qu'elle est bien configurée)

  // Récupération des utilisateurs pour les options du select
  const url=process.env.React_App_URL;
  const { data: users = [], isloading: loadingLigne, error: errorLigne } = useFetch(url + "userselect");
  // Stocke les superviseurs sélectionnés
  const [selectedSuperviseurs, setSelectedSuperviseurs] = useState([]);

  // Fonction pour soumettre les données
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedSuperviseurs.length === 0) {
      alert("Veuillez sélectionner au moins un superviseur.");
      return;
    }

    // Préparer les données à envoyer : on envoie l'ID et le label
    const superviseurData = {
      superviseurs: selectedSuperviseurs.map(value => ({ superviseurname: value.value }))
    }

    fetch(url + "listsuperviseure/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(superviseurData)  // ✅ Maintenant avec le bon champ
    })
      .then(response => {
        if (!response.ok) throw new Error('Erreur lors de l’envoi');
        return response.json();
      })
      .then(() => {
        alert("Superviseurs ajoutés avec succès !");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Erreur :", err);
        if (err.response && err.response.status === 401) {
          logoutfunction(err.response.status);
        }
      });
  };

  return (
    <div>
      <div className="row">
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterSuperviseur">
          Ajouter Superviseur
        </button>

        {/* Modal d'ajout de superviseur */}
        <div className="modal fade" id="ajouterSuperviseur" role="dialog" aria-labelledby="ajouterSuperviseur" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un Superviseur</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label style={{ textAlign: 'center', marginBottom: '10px' }}>Sélectionner un superviseur</label>
                    <div className='col-md-9'>
        <MultiSelect 
            options={users} 
            value={selectedSuperviseurs} 
            onChange={  setSelectedSuperviseurs} 
        />   
    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary" type="submit">Valider</button>
                  </div>
                </form>
              </div>

              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AjoutSuperviseur;
