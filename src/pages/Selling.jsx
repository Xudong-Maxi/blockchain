import React, { Fragment } from 'react';
import '../App.css';
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";

import Button from "../components/Button";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import Title from "../components/Title";
import ProductRow from '../components/ProductRow';

import useCards from "../hooks/useCards";

const Selling = () => {
    const { type } = useParams();
	const { pathname } = useLocation();
	console.log(type);
	const {
		title: { bg, img },
		cards,
		isFinal,
		nextPage,
		moreLoading,
	} = useCards(type);

    if (!img) return <Navigate to="/blockchain/Home" />;
	if (!cards.length) return <Loading color={bg} middle />;  // loading animation

    return (
        <Fragment>
            <Title
				title={`${type} type Pokémon`}
				text="Select your favorite Pokémon..."
				color={bg}
			>
				<Icon bg={bg} size="medium" name={type} img={img} />
			</Title>

            <div className="container">
            <header className="header">
                <h1>My Products</h1>
            </header>
            <div className="container main-content">
                {cards.map(({ id, name, imageUrl, description = 'selling', price = '$500.00' }) => (
					<Link to={`/blockchain/Home/${id}`} key={id}>
                    <ProductRow key={id} image={imageUrl} name={name} description={description} price={price} />
                    </Link>
                ))}
            </div>
            </div>

            {moreLoading && <Loading color={bg} />}
			{!moreLoading && !isFinal && (
				<Button color={bg} handleEvent={nextPage} text="Load more cards..." />
			)}
        </Fragment>
     );
}

export default Selling;