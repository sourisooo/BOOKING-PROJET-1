import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import User, { IUserRequest } from "../models/User";
import generateToken from "../utils/generateToken";

// @Desc Register user
// @Route /api/users/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  const user = new User({
    name,
    email,
    password,
    avatar
  });

  await user.save();

  res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
  });
});


// @Desc Login user
// @Route /api/users/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email })

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if(await user.comparePassword(password)) {

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });

  } else {
    res.status(401);
    throw new Error("Email or password incorrect");
  }

})

// @Desc Update profile
// @Route /api/users/update
// @Method PUT
export const updateProfile = asyncHandler(async (req: IUserRequest, res: Response) => {

  let user = await User.findById(req.user.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { name, email, avatar } = req.body;

  user = await User.findByIdAndUpdate(req.user.id, {
    name, email, avatar
  }, { new: true }).select("-password");

  res.status(201).json({
    id: user?._id,
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
    isAdmin: user?.isAdmin,
    token: generateToken(user?._id)
  });

})

// @Desc Update password
// @Route /api/users/update/password
// @Method PUT
export const updatePassword = asyncHandler(async(req: IUserRequest, res: Response) => {

  let user = await User.findById(req.user.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const { oldPassword, newPassword } = req.body;

  if((await user.comparePassword(oldPassword))) {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    user = await User.findByIdAndUpdate(req.user.id, {
      password: hash
    }, { new: true });

    res.status(201).json({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      isAdmin: user?.isAdmin,
      token: generateToken(user?._id)
    });

  } else {
    res.status(401);
    throw new Error("Old password incorrect");
  }

})

// @Desc Get all users 
// @Route /api/users
// @Method GET
export const getAll = asyncHandler(async (req: Request, res: Response) => {

  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const count = await User.countDocuments();
  const users = await User.find({}).select("-password").limit(pageSize).skip(pageSize * (page - 1));
  res.status(201).json({  
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count
  });

})

// @Desc Get single user by ID
// @Route /api/users/:id
// @Method GET
export const getSingleUser = asyncHandler(async (req: Request, res: Response) => {

  const user = await User.findById(req.params.id).select("-password");

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  res.status(201).json(user);

})

// @Desc Update user by ID
// @Route /api/users/:id
// @Method PUT
export const updateUser = asyncHandler(async (req: Request, res: Response) => {

  let user = await User.findById(req.params.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");

  res.status(201).json(user);

})

// @Desc Delete user by ID
// @Route /api/users/:id
// @Method DELETE
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {

  let user = await User.findById(req.params.id);

  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({});

})

//Commentaires
//La feuille de code gère toutes les requetes réaliséees au serveur sur l'adresse /api/users et portant sur
//l'array d'objet user. asyncHandler permet de gèrer les erreurs avec express. 
//La constante register stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Le paramètre body de l'objet requete est spécifiée. Un nouvel objet User est crée dans l'array de type Mongoose en tenant
//compte des valeurs des paramètres de la requete. Une réponse est envoyé au client en envoyant la valeur de différentes variables précitées.
//La constante login stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Le paramètre body de l'objet requete est spécifiée. Une recherche est réalisé dans l'array user de type moongoose puis
//divers méthodes sont utilisées depuis la bibliothèque bcrypt pour comparer et valider l'authentification. Une fois l'authentification validée,
//une réponse est envoyée au client en envoyant différents paramètres/variables au format JSON.
////La constante updateprofil stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Une recherche es faite sur l'objet user, le body de la requete est spécifiée. Une nouvelle recherche est réalisée sur le user puis
//une modification des variables est opéré sur l'objet trouvé par la recherche en tenant compte des paramètres de la requete.
//Puis une réponse est envoyée au client en envoyant les paramètres précités.
//Meme chose concernant updatePassword, la différence par rapport à updateprofil tient au fait que les paramètres de body de la requete différe et
//de l'appel de la bibliothèque bcrypt pour crypter le nouveau password.
//La constante getAll stocke le resultat d'une fonction asychrone. Cete fonction asyncrhone prend en entrée deux objets requetes
//et réponse. Une recherche est faite sur l'array d'objet user puis une mise en page est réalisée sur cette recherche pour sortir
//les objets par 4. Une réponse au client est envoyée en envoyant les différents paramètres précitées en format JSON.
//Meme chose pour getSingleUser par rapport à getall étantp précisé que la variable "password" est ajouté ou retiré du résultat de la recherche.
//Meme chose pour updateUser par rapport à getall, différence résidant dans l'usage de la méthode implémentée mongoose findByIdAndUpdate pour 
//modifier certains paramètres de l'objet trouvé par la recherche.
//Meme chose pour deleteUser par rapport à getall, différence résidant dans l'usage de la méthode implémentée mongoose findByIdAndDelete et d'une
//réponse envoyée au client en envoyant un objet vide{}.
