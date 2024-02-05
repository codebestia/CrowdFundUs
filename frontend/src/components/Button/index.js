import "./button.css";
import {forwardRef} from "react";



const Button = forwardRef(({children,active=false, disabled=false,icon=null, onClick,...props},ref)=>{
    return (
        <button className={"btn "+`${active && 'btn-active'}`} onClick={onClick} disabled={disabled} ref={ref} {...props}>
            {icon && (<><span className="icon" ><>{icon}</></span>&nbsp;</>)}{children}
        </button>
    );
});
 
export default Button;