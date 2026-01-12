import React,{useState, useEffect} from "react";

function ToolList(){
    const[tools, setTools] = useState([]);
    const[newTool, setNewTool] = useState({
        name: "",
        description: "",
        price_per_day: ""
    });

    useEffect(()=>{
        fetchTools();
    },[]);

    const fetchTools = async ()=> {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/tools', {
            method: 'POST',
            headers: {
                'content-Type' : 'application/json',
            },
            body: JSON.stringify(newTool)
        });

        if(response.ok){
            fetchTools();
            setNewTool({name: "", description: "", price_per_day: ""});
        }
    };

    return(
        <div className="tool-sharing">
            <h2>Share Your Tools</h2>

            <form onSubmit={handleSubmit} className="add-tool-form">
               <input 
                  type="text"
                  placeholder="Tool Name (e.g., Electric Drill)"
                  value={newTool.name}
                  onChange={(e)=> setNewTool({...newTool, name: e.target.value})}
                  required 
                />

                <textarea 
                  placeholder="Description and condition"
                  value={newTool.description}
                  onChange={(e)=>setNewTool({...newTool, description: e.target.value})}
                  required
                />

                <input 
                  type="Price per day (leave empty for free)"
                  value={newTool.price_per_day}
                  onChange={(e)=>setNewTool({...newTool, price_per_day: e.target.value})}
                />

                <button type="submit">Add Tool</button>
            </form>

            <div className="tools-grid">
                <h3>Available Tools</h3>
                {tools.map(tool => (
                    <div key={tool.id} className="tool-card">
                        <h4>{tool.name}</h4>
                        <p>{tool.description}</p>
                        <p>{tool.price_per_day? `$${tool.price_per_day}/day`:'FREE'}</p>

                        <small>Shared by:{tool.owner?.name}</small>
                    </div>    
                ))}
            </div>
        </div>
    )
}

export default ToolList;