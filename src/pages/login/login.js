import './login.css';
import '../../global.css';
import pikachu from '../../images/pikachu.png';

export default function Login(props){

    const NoMetamask = () => {
        return (
            <div>
                <p>
                    No MetaMask detected. 
                    <br></br>
                    Please install&nbsp;
                    <span className = "login-highlight">
                        METAMASK 
                    </span>
                    &nbsp;to your browser to proceed. 
                </p>
            </div>
        )
    }

    const LoginMetamask = () => {
        return (
            <div>
                <p className='login-tips'>
                    {/* <b> */}
                    Please log in with&nbsp;
                    <span className = "login-highlight">
                        METAMASK 
                    </span>
                    &nbsp;to proceed 
                    {/* </b> */}
                </p>
                <button className = "login-btn" onClick = {props.connectTo}>
                    Click here to connect
                </button>
            </div>
        )
    }

    return (
        <div className='background-image'>
            <div className = "login">
                <img src = {pikachu} className = "login-logo" alt = "logo" />
                <h2 style={{ marginBottom: 0 }} className = "login-title">
                    Card Stack - Pokémon TCG 
                    <br/>
                    <span className = "login-author">
                        Developed by: CardStack
                    </span>
                </h2>
                {
                    props.isHaveMetamask ?
                    <LoginMetamask /> :
                    <NoMetamask />
                }
            </div>
        </div>
    )
}
