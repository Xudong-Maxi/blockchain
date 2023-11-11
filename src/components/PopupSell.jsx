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

const sellconfirm = async (contract, address, inputVal, id, close) =>{
  try{
    const ret = await contract.methods.sale_card(id, inputVal).send({from: address});
  }
  catch(err){
    alert("Transaction canceled.");
  }
  close();
}

const handleConfirm = (contract, address, id,close) =>{
  const inputVal = document.getElementById('inputVal').value;
  // check int
  if(isNaN(parseInt(inputVal))){
    alert("The input is invalid!");
    console.log("The input is invalid!");
  } else {
    // alert(`"Your card is selling! \nPrice: ${inputVal}"`);
    if(window.confirm(`Do you make sure to sell this card? \nPrice: ${inputVal}Wei`)) {
      console.log(inputVal);
      sellconfirm(contract, address, inputVal, id, close);
      close();
    }
  }

}

const PopupSell = (props) => {
  const contract = props.contract;
  const address = props.address;
  const id = props.id;

  const classes = useStyles({ color:"#bf8a1a" });
    return (
    <div className={classes.container}>
    <Popup
      trigger={<button className={classes.button}>Sell</button>}
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
            Do you make sure you want to sell this card? If yes, please input the price and click "confirm".
            <br/><br/>
            <input width = "30px" type = "number" id = "inputVal"></input>
          </div>
          <div className={classes.actions}>
            <button className={classes.confirm} onClick={()=> handleConfirm(contract, address, id,close)}>Confirm</button>
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

export default PopupSell;