import React, { useState } from 'react';

function Ajouterequipe() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null;
  const url = process.env.React_App_URL;
  const [nomequipe, setNomequipe] = useState(''); // Updated state variable name

  const handleSubmit = (e) => {
    e.preventDefault();
    const equipeData = {
      nomequipe: nomequipe,
    };

    fetch(url + 'equipe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(equipeData),
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        // Handle error
      });
  };

  return (
    <div>
      <div className="row">
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
          Ajouter Equipe
        </button>
        <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter une equipe
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Nom d'equipe"
                      value={nomequipe}
                      name="nom"
                      onChange={(e) => setNomequipe(e.target.value)} // Updated state setter function
                      type="text"
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                      Valider
                    </button>
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

export default Ajouterequipe;