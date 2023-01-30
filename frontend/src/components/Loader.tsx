import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner className="justify-content-center" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default Loader;

//Commentaires
//What is Bootstrap spinner?
//Bootstrap “spinners” can be used to show the loading state in your projects. 
//They're built only with HTML and CSS, meaning you don't need any JavaScript to create them. 
//You will, however, need some custom JavaScript to toggle their visibility.