import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { IRoom } from '../interfaces/IRoom';
import Rating from './Rating';

type IRoomCard = Pick<IRoom, '_id' | 'images' | 'name' | 'pricePerNight' | 'ratings'>;

const RoomCard: React.FC<IRoomCard> = (props: IRoomCard) => {

  const { _id, images, name, pricePerNight, ratings } = props;

  return (
    <Card className="card-room">
        <Card.Img variant="top" src={images[0].image} />
        <Card.Body>
            <Link to={`/room/${_id}`}>
              <Card.Title as="h4">{name}</Card.Title>
            </Link>
            <Card.Text as="h5" className="mt-2 mb-2" >${pricePerNight} / Per Night</Card.Text>
            <Rating reviews={ratings} />
            <LinkContainer to={`/room/${_id}`}>
              <Button className="w-100" variant="primary">View Details</Button>
            </LinkContainer>
        </Card.Body>
    </Card>
  );
};

export default RoomCard;

//Commentaires
//Un nouveau type de donnée IRoom est spécifié à partir du type IRoomCard. La fonction RoomCard prend pour entrée
//un objet de type IRoomCard, le destructure pour accéder et utiliser ses propriétés et variables.
//La fonction retourne un template HTML utilisant les variables et objets précédemment cités, représentant
//une chambre et plusieurs de ses charactéristiques.
//