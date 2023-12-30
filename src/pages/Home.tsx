import { useState } from "react"

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex justify-center text-2xl font-semibold">
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  )
}
