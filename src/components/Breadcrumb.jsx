import React from "react";
import { Link } from "react-router-dom";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";
import Logo from "../images/METAMASK.png"
import { none } from "list";

const useStyles = createUseStyles({
	ul: {
		padding: "0.5em 1em",
		margin: "0 auto",
		marginBottom: "1em",
		backgroundColor: "#f3e8cd",
		position: "fixed",
		top: "0",
		left: "0",
		right: "0",
		zIndex: 1,
		"&:after": {
			clear: "both",
			content: "",
			display: "table",
		},
	},
	li: {
		display: "inline-block",
		margin: "0.5em 0",
		fontSize: "1rem",
		color: "#959fa5",
		"&:after": {
			display: "inline-block",
			content: "'\\00bb'",
			margin: "0 .6em",
		},
		"& > *": {
			display: "inline-block",
			color: "#2c3f4c",
			textDecoration: "none",
			"&:hover": {
				color: "red",
			},
		},
	},
	home: {
		display: "inline-block",
		margin: "0.5em 15em",
		fontSize: "1rem",
		color: "#959fa5",
		// float: "right",
		position: "absolute",
		right: "0px",
		"& > *": {
			display: "inline-block",
			color: "#2c3f4c",
			textDecoration: "none",
			"&:hover": {
				color: "red",
				textDecoration: "underline",
			},
		},
	},
	homeIcon:{
		width:"1.5em" ,
		height:"1.5em",
		marginBottom: "0",
	},
	current: {
		fontSize: "0.8rem",
		"&:after": {
			content: "''",
		},
	},
});



function Breadcrumb({ pathname, list }) {
	const classes = useStyles();	

	return (
		<div>
			<div className={classes.container}>
			<ul className={classes.ul}>
				{list.map((p) => {
					const current = pathname === p.url;
					return (
						<li
							key={p.name}
							className={`${classes.li} ${current && classes.current}`}
						>
							{current ? p.name : <Link to={p.url}>{p.name}</Link>}
						</li>
					);
				})}
				<li
					key={"Home"}
					className={`${classes.home}`}
				>
					<Link to={"/blockchain/Home"}>
						{/* <img src={Logo} alt="logo" className={classes.homeIcon}></img> */}
						<span>Home</span>
					</Link>
				</li>
			</ul>
		</div>
		</div>
	);
}

Breadcrumb.propTypes = {
	pathname: PropTypes.string.isRequired,
	list: PropTypes.arrayOf(
		PropTypes.shape({
			url: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	),
};

export default Breadcrumb;