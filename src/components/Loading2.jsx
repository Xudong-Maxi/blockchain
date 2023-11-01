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
		"& :after": {
			content: " ",
			display: "block",
			borderRadius: "50%",
			width: "0",
			height: "0",
			margin: "8px",
			boxSizing: "border-box",
			border: "32px solid #fff",
			borderColor: "#fff transparent #fff transparent",
			animation: "lds-hourglass 1.2s infinite",
		},
	},
	"@keyframes lds-hourglass": {
		"0%": {
			transform: "rotate(0)",
			animationTimingFunction: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
		},
		"50%": {
			transform: "rotate(900deg)",
			animationTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
		},
		"100%": {
			transform: "rotate(1800deg)",
		},
	}, 
});

const Loading2 = ({ color = "#ed1d25", middle = false }) => {
	const classes = useStyles({color});
	return (
		<div className={middle ? classes.container : ""}>
			<div className={classes.div}>
			</div>
		</div>
	);
};

Loading2.propTypes = {
	color: PropTypes.string,
	middle: PropTypes.bool,
};

export default Loading2;
