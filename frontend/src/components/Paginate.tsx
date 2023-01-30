import React from 'react';

type PaginateParams = {
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    totalPosts: number,
    postPerPage: number
}

const Paginate: React.FC<PaginateParams> = ({ currentPage, setCurrentPage, totalPosts, postPerPage }) => {
	const totalPages = Math.ceil(totalPosts / postPerPage);

	let pages = [];

	for (let p = 1; p <= totalPages; p++) {
		pages.push(p);
	}

	return (
		<ul className="pagination">
			<li className={`page-item ${currentPage === 1 && `disabled`}`}>
				<button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
					&laquo;
				</button>
			</li>
			{pages.map((page) => (
				<li
					key={page}
					className={`page-item ${page === currentPage && `active`}`}
					onClick={() => setCurrentPage(page)}
				>
					<button className="page-link">{page}</button>
				</li>
			))}
			<li className={`page-item ${currentPage === totalPages && `disabled`}`}>
				<button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
					&raquo;
				</button>
			</li>
		</ul>
	);
};

export default Paginate;

//Commentaires
//La feuille de code spécifie un nouveau type de donnée, puis une fonction est crée en prenant pour entrée
//un objet de type PaginateParams, type nouvellement crée. Un array est crée pour stocker une page pour un élément
//de l'array. Par ailleurs, une variable de type react dispatch nommé setCurrentPage est utilisé prenant pour argument une action prenant lui meme
//un argument de type number.
//La fonction Paginate retourne un template HTML reprenant les variables précédemment citées.
//Cette page HTML représente la navigation entre plusieurs pages sur le résultat de la recherche sur la page home.