import React from "react";
import { createUseStyles } from "react-jss";
import { Img } from "react-image";
import { useParams, Navigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import CardDescription from "../components/CardDescription";
import CardAttacks from "../components/CardAttacks";
import CardBoxIcon from "../components/CardBoxIcon";
import Loading from "../components/Loading";
import Icon from "../components/Icon";
import Title from "../components/Title";

import useCard from "../hooks/useCard";

import SellersList from "../components/SellersList";

const useStyles = createUseStyles({
	container: {
		maxWidth: "900px",
		margin: "0 auto",
		padding: "10px",
	},
	row: {
		display: "flex",
		flexFlow: "row wrap",
		alignItems: "strech",
		justifyContent: "center",
		alignContent: "center",
		"@media (max-width: 767px)": {
			flexFlow: "column wrap",
		},
	},
	left: {
		padding: "1rem",
		flex: "1 0 0",
		"& img": {
			maxWidth: "400px",
			width: "100%",
		},
	},
	right: {
		flex: "2 0 0",
		textAlign: "left",
	},
});

const Card = (props) => {
	const contract = props.contract;
	const address = props.address;
	const { id } = useParams();
	const classes = useStyles();
	//const { card } = CARD;
	const { card } = useCard(id);
	if (!card) return <Loading middle />;
	if (card === "Error") {
		alert("card not found!"); 
		return <Navigate to="/blockchain" />;
	}

	const {
		svgImage,
		title,
		subtitle,
		image,
		types,
		ability,
		attacks,
		rules,
		miscellaneous,
	} = card;

	return (
		<div className={classes.container}>
			<Title title={title} subtitle={subtitle}>
				<Icon size="medium" name={svgImage} img={svgImage} />
				{types.map(({ index, name, text, img, bg, size }) => (
					<Icon
						key={index}
						name={name}
						text={text}
						img={img}
						bg={bg}
						size={size}
					/>
				))}
			</Title>
			<div className={classes.row}>
				<div className={classes.left}>
					<Img src={image} loader={<Skeleton />} alt={image} />
				</div>
				<div className={classes.right}>
					{ability && <CardDescription data={ability} />}
					{rules && <CardDescription data={rules} />}
					{attacks && <CardAttacks data={attacks} />}

					<CardBoxIcon data={miscellaneous} />
				</div>
			</div>
			<SellersList
				contract = {contract}
				address = {address}
				id = {id}
			/>
		</div>
		
	);
};

export default Card;
