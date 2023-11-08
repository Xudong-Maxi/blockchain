import './login/login.css';
import '../global.css';
import React, { Fragment } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";

import Button from "../components/Button";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import Title from "../components/Title";

import useCards from "../hooks/useCards";

//import PopupSell from "../components/popup/PopupSell"
import PopupSell from "../components/PopupSell"

const useStyles = createUseStyles({  // define style of list (display cards)
	ul: {
		display: "flex",
		alignItems: "center",
		flexFlow: "row wrap",
		justifyContent: "center",
		listStyleType: "none",
		maxWidth: "1400px",
		padding: 0,
		margin: "0 auto",
		"@media (max-width: 767px)": {
			"& a": {
				width: "50%",
			},
		},
	},
	li: {
		margin: "0.25rem",
		padding: "0.5rem",
		// transition: "0.2s all",
		// "&:hover": {
		// 	transform: "scale(1.1)",
		// 	cursor: "pointer",
		// },
	},
	cardHover:{
		transition: "0.2s all",
		"&:hover": {
			transform: "scale(1.1)",
			cursor: "pointer",
		},
	},
	popupHover:{
		transition: "0.2s all",
		"&:hover": {
			transform: "scale(1.2)",
			cursor: "pointer",
		},
	},
	img: {
		width: "230px",
		"@media (max-width: 767px)": {
			width: "100%",
		},
	},
	button: {
		background: "transparent",
		border: ({ color }) => `2px solid ${color}`,
		color: ({ color }) => color,
		cursor: "pointer",
		fontWeight: "bold",
		width: "50%",
		padding: "8px 16px",
		position: "relative",
		textAlign: "center",
		textDecoration: "none",
		"@media (max-width: 767px)": {
		  width: "90%",
		},
		"&:hover": {
		  background: ({ color }) => color,
		  color: "#000",
		},
	  },
});

const Inventory = (props) => {
	//const { type } = useParams();
	const { pathname } = useLocation();
	const classes = useStyles({ color:"#bf8a1a" });
	const type = props.type;
	const {
		title: { bg, img },
		cards,
		isFinal,
		nextPage,
		moreLoading,
	} = useCards(type);

	// const inputVal = document.getElementById('inputVal').value;
	// console.log(inputVal);
	
	/*const {
    title: { bg, img },
    cards,
    isFinal,
    nextPage,
    moreLoading,
  } = CARDS;*/
	if (!img) return <Navigate to="/blockchain" />;
	if (!cards.length) return <Loading color={bg} middle />;

	return (
		<Fragment>
			<Title
				title={`${type} Inventory`}
				text="Inventory..."
				color={bg}
			>
				<Icon bg={bg} size="medium" name={type} img={img} />
			</Title>

            <Link to={`/blockchain/Home/Selling`} key={type}>
				<button className={classes.button}>
						Cards that are selling
				</button>
			</Link>
			
			<ul className={classes.ul}>
				{cards.map(({ id, name, imageUrl }) => (
					<li key={name} className={classes.li}>
						<div className={classes.cardHover}>
							<Link to={`${pathname}/${id}`} key={id}>
								<Img
									src={imageUrl}
									loader={<Skeleton />}
									alt={name}
									className={classes.img}
								/>
							</Link>
						</div>
						<div className={classes.popupHover}>
							<PopupSell/>
						</div>
					</li>

				))}
			</ul>

			{moreLoading && <Loading color={bg} />}
			{!moreLoading && !isFinal && (
				<Button color={bg} handleEvent={nextPage} text="Load more cards..." />
			)}
		</Fragment>
	);
};

export default Inventory;
