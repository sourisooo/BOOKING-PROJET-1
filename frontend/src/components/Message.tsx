import React from "react";
import { Alert } from "react-bootstrap";

interface IProps {
  variant: string,
  children: any
};

const Message: React.FC<IProps> = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: "info"
}

export default Message;

//Commentaires
//La fonction prend pour entrée un string et un objet non défini et retourne un string
//contenant le string et l'objet.