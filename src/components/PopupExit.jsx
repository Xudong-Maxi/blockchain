import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
// import ButtonSell from "../ButtonSell"
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    container: {
      paddingTop: "15px",
      paddingBottom: "10px",
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
    modal: {  
      fontSize: "12px",
    },
    header: {
      width: "100%",
      borderBottom: "1px solid gray", 
      fontSize: "25px",  
      textAlign: "center", 
      padding: "5px",
    },
    content: {  
      width: "100%",
      padding: "10px 5px",
      textAlign:"center",
      fontSize: "1.5em",
    },
    actions: {  
      width: "100%",  
      padding: "10px 5px",  
      margin: "auto",  
      textAlign: "center",
      // float: "right",
      // margin: "2em",
    },
    confirm: {      
      fontWeight: "bold",
      width: "10%",
      padding: "8px 16px",
      position: "relative",
      textAlign: "center",
      float: "right",
      marginRight:"7em",
    },
    cancel: {      
      fontWeight: "bold",
      width: "10%",
      padding: "8px 16px",
      position: "relative",
      textAlign: "center",
      float: "left",
      marginLeft: "7em",
    },
    close: {  
      cursor: "pointer",  
      position: "absolute",  
      display: "block",  
      padding: "2px 5px",  
      lineHeight: "20px",  
      right: "-10px",  
      top: "-10px",  
      fontSize: "24px",  
      background: "#ffffff",
      borderRadius: "18px",
      border: "1px solid #cfcece",
    },
});

const PopupExit = () => {
  const classes = useStyles({ color:"#bf8a1a" });
    return (
    <div className={classes.container}>
    <Popup
      trigger={<button className={classes.button}>Remove</button>}
      modal
      nested
    >
      {close => (
        <div className={classes.modal}>
          <button className={classes.close} onClick={close}>
            &times;
          </button>
          <div className={classes.header}>Sell Cards</div>
          <div className={classes.content}>
            {' '}
            <br/>
            Do you make sure you want to remove this card from your selling list? If yes, please click "confirm".
            <br/><br/>
          </div>
          <div className={classes.actions}>
            <button className={classes.confirm} 
              onClick={()=> {
                console.log('confirmed ');
                close();
              }}
            >
              Confirm
            </button>
            <button
              className={classes.cancel}
              onClick={() => {
                console.log('modal closed ');
                close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Popup>
    </div>
    )
};

export default PopupExit;