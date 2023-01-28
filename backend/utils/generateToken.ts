import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string);
    return token;
}

export default generateToken;

//Commentaires
//La fonction sign de jwt permet de créer une nouvelle autorisation, puis cette valeur est insérée dans la variable token
//et  retourner cette variable par la fonction generateToken.
