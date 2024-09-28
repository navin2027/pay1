export  function Button({label,onClick}){
    return (
        <>
        <div className="bg-black text-white text-center font-bold my-[10px]">
         <button onClick={onClick} type="button">{label}</button>
        </div>
        </>
)}