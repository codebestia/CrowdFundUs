import "./loader.css"
const Loader = () => {
    return (
    <div className="loader-cover">
        <div>
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
     );
}

export const PageLoader = ()=>{
    return (
        <div className="page-loader-cover">
            <div>
                <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
         );
}
 
export default Loader;