import {forwardRef} from "react";
import "./input.css"

export const TextArea = forwardRef(({label=null,...props},ref)=>{
    return (
       <div>
        {label && <label>{label}</label>}
        <textarea  className="form-input" ref={ref} {...props} ></textarea>
       </div>
    );
});

const Input = forwardRef(({label=null,...props},ref)=>{
    return (
       <div>
        {label && <label>{label}</label>}
        <input  className="form-input" ref={ref} {...props} />
       </div>
    );
});
export default Input;