import React from "react";
import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";

const useStyles = createUseStyles({
	container: {
		width: "300px",
		height: "100px",
		padding: "20px",

		position: "absolute",
		top: "50%",
		left: "50%",

		margin: "-70px 0 0 -170px",
	},
	div: {
		display: "inline-block",
		position: "relative",
		width: "80px",
		height: "80px",
		"& div": {
			display: "inline-block",
			position: "absolute",
			left: "8px",
			width: "16px",
			background: ({ color }) => color,
			animation: "$lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite",
		},
		"& div:nth-child(1)": {
			left: "8px",
			animationDelay: "-0.24s",
		},
		"& div:nth-child(2)": {
			left: "32px",
			animationDelay: "-0.12s",
		},
		"& div:nth-child(3)": {
			left: "56px",
			animationDelay: "0",
		},
	},
	"@keyframes lds-facebook": {
		"0%": {
			top: "8px",
			height: "64px",
		},
		"50%": {
			top: "24px",
			height: "32px",
		},
		"100%": {
			top: "24px",
			height: "32px",
		},
	}, 
});

const Loading2 = ({ color = "#ed1d25", middle = false }) => {
	const classes = useStyles({color});
	return (
		<div className={middle ? classes.container : ""}>
			<div className={classes.div}>
				<div></div>
				<div/>
				<div/>
			</div>
		</div>
	);
};

Loading2.propTypes = {
	color: PropTypes.string,
	middle: PropTypes.bool,
};

export default Loading2;
