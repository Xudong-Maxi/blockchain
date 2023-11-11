import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useLocation } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";

const useStyles = createUseStyles({
	container: {
		padding: "3rem 0",
	},
});

function Header() {
	const classes = useStyles();
	const { pathname } = useLocation();
	const [path, getPath] = useState([]);

	useEffect(() => {
		let arrPath = [ //initiate path array // breadcrumb
			{
				name: "Login",
				url: "/blockchain",
			},
			// {
			// 	name: "Types",
			// 	url: "/blockchain/Types",
			// },
		];
		const path = pathname;
		const s = path.split("/");
		let url = "/blockchain"


		for (let i = 2; i < s.length; i++) {  // iteration, append value to array
			url += `/${s[i]}`;
			arrPath.push({
				name: s[i],
				url: url, 
			});
		}

		getPath(arrPath);
	}, [pathname]);


	return (
		<div className={classes.container}>
			<Breadcrumb list={path} pathname={pathname} /> 
		</div>
	);
}

export default Header;
