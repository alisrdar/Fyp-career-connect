"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function QuizQuestion() {
    const [question, setQuestion] = useState(null)
    const [selected, setSelected] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                setError(null);
                // const res = await axios.get('/api/dashboard/quiz/nextquestion', { withCredentials: true });

                const res = await fetch('/api/quiz/nextquestion', { credentials: 'include' });
                const data = await res.json();
                console.log('API res:', res.status, data);
                if (!res.ok) throw new Error(data.error || data.message);
                console.log('Setting question:', data);
                setQuestion(data);
            } catch (err) {
                console.log('Error caught:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, []);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
    console.log('Rendering with question:', question);
    const handleSelect = (option) => {
        setSelected(option)
    }

    return (
        <div className="p-4 border rounded shadow max-w-xl mx-auto bg-white">
            <h2 className="text-xl font-bold mb-4">{question.question}</h2>

            {question.article && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                    <strong>Article:</strong> <p>{question.article}</p>
                </div>
            )}
            {question.support && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                    <strong>Support:</strong> <p>{question.support}</p>
                </div>
            )}

            <ul className="space-y-3">
                {question.options.map((opt, idx) => (
                    <li
                        key={idx}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${selected === opt ? 'bg-blue-100 border-blue-300' : ''
                            }`}
                        onClick={() => handleSelect(opt)}
                    >
                        {opt}
                    </li>
                ))}
            </ul>
        </div>
    )
}
