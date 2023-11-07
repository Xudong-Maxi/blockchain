import React, { Fragment } from "react";
import { createUseStyles } from "react-jss";
import { Link, useLocation } from "react-router-dom";

import logo from "../images/logo.png";

import Icon from "../components/Icon";
import Loading2 from "../components/Loading2";
import Title from "../components/Title";

import useTypes from "../hooks/useTypes";

const useStyles = createUseStyles({
	ul: {
		display: "flex",
		alignItems: "center",
		flexFlow: "row wrap",
		justifyContent: "center",
		listStyleType: "none",
		maxWidth: "1440px",
		padding: 0,
		margin: "0 auto",
		"@media (max-width: 480px)": {
			"& > a ": {
				width: "100%",
			},
		},
	},
	li: {
		margin: "1rem",
		padding: "1rem",
		borderRadius: "20px",
	},
	img: {
		maxWidth: "320px",
	},
});

const Types = () => {
	const classes = useStyles();
	const { types } = useTypes();
	const { pathname } = useLocation();


	if (!types.length) return <Loading2 middle />;

	return (
		<Fragment>
			<Title>
				<img src={logo} alt="Logo Pokémon" className={classes.img} />
			</Title>

			<ul className={classes.ul}>
				{types.map(({ bg, img, name }) => (
					// <Link to={`${pathname}/Inventory`} key={name}>  {/* page link */}
					<Link to={`${pathname}/${name}`} key={name}>  {/* page link */}
						<li
							key={name}
							className={classes.li}
							style={{ background: "#fdf6f6" }}
						>
							<Icon
								bg={bg}
								size="big"
								name={name}
								img={img}
								key={name}
								text={name}
								skeleton
								hover
							/>
						</li>
					</Link>
				))}
			</ul>
		</Fragment>
	);
};

export default Types;
