import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

 function Card({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 16,
        margin: "0 0 8px 0",
        backgroundColor: "red",
    };
    
    return (
        <>
       
        <h3>{id}</h3>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
        </div>
        </>
    );
    }
    

export default Card;
