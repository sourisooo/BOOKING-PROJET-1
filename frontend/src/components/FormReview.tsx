import React, { useState } from 'react';
import { Form, FormGroup, Button, FloatingLabel } from 'react-bootstrap'
import { createRoomReview } from '../redux/actions/RoomActions';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Message from './Message';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { IRoom } from '../interfaces/IRoom';

type TFormReview = {
    idRoom: IRoom['_id']
}

const FormReview: React.FC<TFormReview> = ({ idRoom }) => {

    const { loggedIn } = useAuthStatus();

    const dispatch = useDispatch();
    const [comment, setComment] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);

    const handleReview = (e: React.FormEvent) => {
        e.preventDefault();

        if(comment !== "") {
            dispatch(createRoomReview(idRoom, { rating, comment }));
            setComment("");
            setRating(0);
        }

    }


  return (
      <>
        {loggedIn ? (
            <Form onSubmit={handleReview}>
                <FormGroup className="field-rating">
                    {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                        <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "bi bi-star-fill" : "bi bi-star"}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                        >
                        </button>
                        );
                    })}
                </FormGroup>
                <FormGroup className="mt-3 mb-3">
                    <FloatingLabel controlId="floatingTextarea2" label="Comments">
                        <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ height: '100px' }}
                        />
                    </FloatingLabel>
                </FormGroup>
                <FormGroup>
                    <Button type="submit">
                        Add Review
                    </Button>
                </FormGroup>
            </Form>
        ) : (
            <Message variant="info">
                <Link to="/login">Sign in</Link> to write a review
            </Message>
        )}
    </>
  );
};

export default FormReview;

//Commentaires
//La FormReview prend pour entr??e un type d'objet IRoom['_id'], invoque la fonction useAuthStatus
//pour acc??der ?? la variable loggedIn. Puis, trois variables sont cr??es en utilisant la fonctionnalit??
//useState de react. La fonction handleReview prend pour entr??e FormEvent(masque de saisie, A form event 
//in JavaScript gets triggered when a user loses focus, or in a sense, the user wants to make modifications to the form control value)
//La fonction handlereview utilise le reducer createRoomReview en prenant comme param??tre l'objet pass?? dans la
//premi??re fonction et deux variables useState.
//La fonction FormReview retourne une template HTML en utilisant les variables/param??tres/objets et fonctions pr??cit??es.
//La soumission du formulaire va executer la fonction handlereview et envoyer la requete POST aupr??s du serveur.
//L'interaction avec les boutons type="button" et le formgroupe va modifier la valeur des variables utilisant UseState ??
//travers la m??thode SET.