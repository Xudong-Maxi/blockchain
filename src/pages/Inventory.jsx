import './login/login.css';
import '../global.css';
import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";

import Button from "../components/Button";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import Title from "../components/Title";


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
	buttonSwitch: {
		background: "transparent",
		marginBottom: "20px",
		border: "2px solid #3ba9ec",
		color: "#000",
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
		  background: "#3ba9ec",
		  color: "#000",
		},
	  },
});


const FetchDataforId = async (ids) =>{
    let imageUrls = [];
    for (const id of ids) {
        try {
        const response = await fetch(`https://api.pokemontcg.io/v1/cards/${id}`)
        const todo = await response.json()
        imageUrls.push([todo.card.imageUrlHiRes,id])
		// console.log(imageUrls)
        }
        catch (error){
            console.error("Error fetching data for ID:", id, error);
        }
    }

    return imageUrls;
}


const Inventory = (props) => {
	const { pathname } = useLocation();
	const classes = useStyles({ color:"#bf8a1a" });
	// const idlist = ['swsh35-25', 'dp1-7', 'ex16-30','det1-4'];
	const [idlist, setIdlist] = useState([]);
	const contract = props.contract;
	const address = props.address;

	const getIdList = async () => {
		try {
		  const userdata = await contract.methods.getUserData(address).call();
		//   console.log(`idlist : ${userdata[0]}`)
		  return userdata[0];
		} catch (error) {
		  console.error("Error fetching data:", error);
		  return [];
		}
	  };

	useEffect(() => {
		const fetchData = async () => {
		  const ids = await getIdList();
		  setIdlist(ids);
		};
	
		fetchData();
	}, [contract]);

	const [image, setImage] = useState([]);

	useEffect(()=>{
		FetchDataforId(idlist).then(imageUrls => {
			// console.log(`here is data: ${imageUrls}`)
			setImage(imageUrls)
		})
	}, [idlist]);
	
	if(Object.keys(idlist).length !== 0){
		if (!image.length) return <Loading middle />;
	}

	const images = image.map(([imageUrl, id]) => ({ imageUrl, id }));

	return (
		<Fragment>
			<Title
				title={`${address}`}
				text="This is your inventory..."
				color={"#F2D94E"}
			>
			</Title>

            <Link to={`/blockchain/Home/Selling`}>
				<button className={classes.buttonSwitch}>
						Cards that are selling
				</button>
			</Link>
			
			<ul className={classes.ul}>
				{images.map(({ imageUrl, id }) => (
					<li key={id} className={classes.li}>
						<div className={classes.cardHover}>
							<Link to={`${pathname}/${id}`} key={id}>
								<Img
									src={imageUrl}
									loader={<Skeleton />}
									alt={id}
									className={classes.img}
								/>
							</Link>
						</div>
						<div className={classes.popupHover}>
							<PopupSell
								contract={contract}
								address={address}
								id={id}
							/>
						</div>
					</li>

				))}
			</ul>
		</Fragment>
	);



};

export default Inventory;
