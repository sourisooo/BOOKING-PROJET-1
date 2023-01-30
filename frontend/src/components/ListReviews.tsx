import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Rating from './Rating';

type TListReviews = {
    roomReviews: []
}

const ListReviews: React.FC<TListReviews> = ({ roomReviews }) => {
  return (
    <ListGroup variant="flush">
        {roomReviews?.map((r: any) =>
            <ListGroup.Item key={r._id}>
                <h4>{r.name}</h4>
                <Rating reviews={r.rating} />
                <p>
                    {r.comment}
                </p>
            </ListGroup.Item>
        )}
    </ListGroup>
  );
};

export default ListReviews;

//Commentaires
//La fonction ListReviews spécifie un type de donnée et prend pour entrée ce type de donnée
//nouvellement crée et retourne un template HTML en utilisant les paramètres et variables
//précédemment citées et de l'objet passé en entrée de fonction. Pour chaque élément de l'array
//roomReviews, les paramètre nom, rating et comment de l'objet sont affiché sur la page HTML.