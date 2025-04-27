import React from 'react'

const DarkModeSwitch = () => {
    const darkMode = false;
    return (
        <button>
            {darkMode? "☀ Dark" : "🌙 Light"} 
        </button>
    )
}

export default DarkModeSwitch
