import {Link} from "react-router-dom"

export function BottomWarning({label,buttonText,to}){
    return (
        <>
        <div className="flex justify-center">
            <div className="font-semibold">
                {label}
            </div>
            <Link className="font-bold"to={to}>{buttonText}</Link>
        </div>
        </>
)}