import axios from "axios"
import { useState } from "react"

export default function App() {
  const [input, setInput] = useState("")


  const submit = async () => {
    try {
      const data = await axios.post("http://localhost:3000", { task: input })
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">

      <input className="border-2 border-gray-400 rounded-md px-2 py-1" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button className="border-2 border-gray-400 rounded-md px-2 py-1" onClick={submit}>Submit</button>
    </div>
  )
}
