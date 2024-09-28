export function InputBox({label, placeholder,onChange}){
    return (
         <>
         <div>
            <div className="font-semibold pb-[7px] w-full">
                <label>{label}</label>
            </div>
            <input onChange={onChange} placeholder={placeholder}/>
         </div>
         </>
)}