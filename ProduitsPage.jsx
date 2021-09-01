import React, { useEffect, useState } from "react";
import * as ProduitsAPI from "../services/ProduitsAPI";

const ProduitsPage = () => {

  const [Produits, setProduits] = useState([]);
  const [search, setSearch] = useState("");
  const [modalTitle ,setModalTitle] = useState("");
  const [idProduit ,setIdProduit] = useState("");
  const [Libelle, setLibelle] = React.useState('');
  const [Description, setDescription] = React.useState('');
  const [PU, setPU] = React.useState('');
  const [QteStock, setQteStock] = React.useState('');
  const [DatePeremption, setDatePeremption] = React.useState('');

  const onChangeLibelle = (e) => {
      setLibelle(e.target.value);
  }
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  }
  const onChangePU = (e) => {
    setPU(e.target.value);
  }
  const onChangeQteStock = (e) => {
    setQteStock(e.target.value);
  }
  const onChangeDatePeremption = (e) => {
    setDatePeremption(e.target.value);
  }

  const fetchProduits = async () => {
    try {
      const data = await ProduitsAPI.findAll();
      setProduits(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);
  
  const handleDelete = async (ProduitID) => {
    if(window.confirm('Etes vous sure?')){
      const originalProduits = [...Produits];
      setProduits(Produits.filter((e) => e.idProduit !== ProduitID));
      try {
        const response= await ProduitsAPI.deleteProduit(ProduitID);
        fetchProduits();
        alert(response) 
      } catch (error) {
        setProduits(originalProduits);
      }
      }
  };

  const handleSeach = ({currentTarget}) => {
    setSearch(currentTarget.value);
  };
  
  const originalProduits = Produits.filter(
    (e) =>
    e.Libelle.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
    e.DatePeremption.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );
  
  const  addClick = () => {
      setModalTitle("Ajouter Produit");  
      setIdProduit(""); 
      setLibelle("");
      setDescription("");
      setPU("");
      setQteStock("")
      setDatePeremption("")
        //  $('#myModal').modal('show')
  }
  
  const editClick = (emp) =>{
    setModalTitle("Modifier Produit");
    setIdProduit(emp.idProduit); 
    setLibelle(emp.Libelle);
    setDescription(emp.Description);
    setPU(emp.PU);
    setQteStock(emp.QteStock)
    setDatePeremption(emp.DatePeremption)
  }
  
  const createClick =async () => {
   // e.preventDefault();
    const newProduit = {
      Libelle,
      PU,
      Description,
      QteStock,
      DatePeremption
    }
    try {
      const response=  await ProduitsAPI.addProduit(newProduit);
         fetchProduits();
         alert(response) 
    
      } catch (error) {
        console.log(error);
      }
  }
  
  const updateClick = async ()=>{
    const EditProduit = {
      idProduit,
      Libelle,
      PU,
      Description,
      QteStock,
      DatePeremption
    }
    try {
    const response=  await ProduitsAPI.updateProduit(idProduit,EditProduit);
    fetchProduits();
     alert(response) 
   } catch (error) {
     console.log(error);
   }
  }

  return (
    <>
      <div className="container mt-5 mb-5 d-flex justify-content"></div>
      <div className="card px-1 py-4">
        <div className="card-body">
          <h1>liste des produits</h1>
          <button type="button"
                  className="btn btn-primary m-2 float-end"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => addClick()}>
              Ajouter Produit
          </button>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="recherche"
              onChange={handleSeach}
              value={search}
            />
          </div>
          <table className="table hover">
            <thead>
              <tr>
                <th>Id</th>
                <th>Libellé</th>
                <th>Description</th>
                <th>Prix unitaire</th>
                <th>Quantité en Stock </th>
                <th className="text-center">Date de péremption</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {originalProduits.map((Produit) => (
                <tr key={Produit.ProduitID}>
                  <td>{Produit.ProduitID}</td>
                  <td>
                      {Produit.Libelle}
                  </td>
                  <td>
                      {Produit.Description}
                  </td>
                  <td> {Produit.PU}</td>              
                  <td>{Produit.QteStock}</td>              
                  <td className="text-center">
                    {Produit.DatePeremption.toLocaleString()} 
                  </td>
                  <td>
                    <button onClick={() => editClick(Produit)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    color="warning" className="btn btn-primary ">Modifier</button>
                    /
                    <button
                      onClick={() => handleDelete(Produit.ProduitID)}
                      className="btn btn-sm btn-danger"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal fade" id="exampleModal"    aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">{modalTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
              ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label for="exampleFormControlInput1">Libelle</label>
                    <input type="text" className="form-control"
                    value={Libelle} onChange={onChangeLibelle}/>
                  </div> <br />
                  <div className="form-group">
                    <label for="exampleFormControlInput1">Description</label>
                    <input type="text" className="form-control"
                    value={Description} onChange={onChangeDescription}/>
                  </div> <br />
                  <div className="form-group">
                    <label for="exampleFormControlInput1">Prix unitaire</label>
                    <input type="number" className="form-control"
                    value={PU} onChange={onChangePU}/>
                  </div> <br />
                  <div className="form-group">
                    <label for="exampleFormControlInput1">Quantité en stock</label>
                    <input type="number" className="form-control"
                    value={QteStock} onChange={onChangeQteStock}/>
                  </div> <br />
                  <div className="form-group">
                    <label for="exampleFormControlInput1">Date de péremption</label>
                    <input type="date" className="form-control"
                    value={DatePeremption} onChange={onChangeDatePeremption}/>
                  </div>
                </form>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"   data-bs-dismiss="modal" aria-label="Close">Fermer</button>
                {idProduit=== undefined?
                <button type="button"
                className="btn btn-success"
                onClick={() => createClick()}
                >Créer</button>
                :
                <button type="button"
                className="btn btn-primary float-start"
                onClick={() => updateClick()}
                >Ajouter</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProduitsPage;
